const kafkaConfig = require('../config/kafka');
const emailService = require('../services/emailService');
require('dotenv').config();

/**
 * Kafka Consumer Service
 */
class KafkaConsumer {
  constructor() {
    this.consumer = null;
    this.topic = process.env.KAFKA_TOPIC || 'email-notifications';
    this.isRunning = false;
  }

  async initialize() {
    this.consumer = await kafkaConfig.createConsumer();
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });
  }

  /**
   * Start consuming messages
   */
  async start() {
    try {
      if (!this.consumer) {
        await this.initialize();
      }

      this.isRunning = true;
      console.log(`🚀 Starting Kafka consumer for topic: ${this.topic}`);

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const messageValue = message.value.toString();
            const messageData = JSON.parse(messageValue);
            
            console.log(`📨 Received message:`, {
              topic,
              partition,
              offset: message.offset,
              key: message.key?.toString(),
              timestamp: new Date(parseInt(message.timestamp)).toISOString()
            });

            // Process the message based on type
            await this.processMessage(messageData);

          } catch (error) {
            console.error('❌ Error processing message:', error);
            // In production, you might want to send to a dead letter queue
          }
        },
      });

    } catch (error) {
      console.error('❌ Error starting consumer:', error);
      this.isRunning = false;
      throw error;
    }
  }

  /**
   * Process incoming messages
   */
  async processMessage(messageData) {
    const { type, ...data } = messageData;

    switch (type) {
      case 'email_notification':
        await this.handleEmailNotification(data);
        break;
      default:
        console.log(`⚠️ Unknown message type: ${type}`);
        console.log('Message data:', data);
    }
  }

  /**
   * Handle email notification messages
   */
  async handleEmailNotification(data) {
    try {
      console.log('📧 Processing email notification:', data);

      const { to, subject, template, data: templateData, ...emailOptions } = data;

      if (template) {
        // Send templated email
        await emailService.sendTemplatedEmail({
          to,
          subject,
          template,
          data: templateData,
          ...emailOptions
        });
      } else {
        // Send plain email
        await emailService.sendEmail({
          to,
          subject,
          ...emailOptions
        });
      }

      console.log('✅ Email notification processed successfully');
    } catch (error) {
      console.error('❌ Error processing email notification:', error);
      throw error;
    }
  }

  /**
   * Stop the consumer
   */
  async stop() {
    if (this.consumer && this.isRunning) {
      await this.consumer.stop();
      this.isRunning = false;
      console.log('🛑 Kafka consumer stopped');
    }
  }

  /**
   * Disconnect the consumer
   */
  async disconnect() {
    await this.stop();
    if (this.consumer) {
      await this.consumer.disconnect();
      console.log('✅ Kafka consumer disconnected');
    }
  }

  /**
   * Check if consumer is running
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      topic: this.topic
    };
  }
}

module.exports = new KafkaConsumer();

// Example usage when run directly
if (require.main === module) {
  const consumer = new KafkaConsumer();
  
  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down consumer...');
    await consumer.disconnect();
    await kafkaConfig.disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down consumer...');
    await consumer.disconnect();
    await kafkaConfig.disconnect();
    process.exit(0);
  });

  // Start the consumer
  consumer.start().catch(console.error);
}
