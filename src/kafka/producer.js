const kafkaConfig = require('../config/kafka');
require('dotenv').config();

/**
 * Kafka Producer Service
 */
class KafkaProducer {
  constructor() {
    this.producer = null;
    this.topic = process.env.KAFKA_TOPIC || 'email-notifications';
  }

  async initialize() {
    this.producer = await kafkaConfig.createProducer();
  }

  /**
   * Send email notification message to Kafka
   */
  async sendEmailNotification(emailData) {
    try {
      if (!this.producer) {
        await this.initialize();
      }

      const message = {
        topic: this.topic,
        messages: [{
          key: emailData.id || Date.now().toString(),
          value: JSON.stringify({
            ...emailData,
            timestamp: new Date().toISOString(),
            type: 'email_notification'
          }),
          headers: {
            'content-type': 'application/json',
            'source': 'js-emailer'
          }
        }]
      };

      const result = await this.producer.send(message);
      console.log('✅ Message sent to Kafka:', result);
      return result;
    } catch (error) {
      console.error('❌ Error sending message to Kafka:', error);
      throw error;
    }
  }

  /**
   * Send generic message to Kafka
   */
  async sendMessage(topic, key, value, headers = {}) {
    try {
      if (!this.producer) {
        await this.initialize();
      }

      const message = {
        topic: topic || this.topic,
        messages: [{
          key,
          value: typeof value === 'string' ? value : JSON.stringify(value),
          headers: {
            'content-type': 'application/json',
            ...headers
          }
        }]
      };

      const result = await this.producer.send(message);
      console.log('✅ Message sent to Kafka:', result);
      return result;
    } catch (error) {
      console.error('❌ Error sending message to Kafka:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.producer) {
      await this.producer.disconnect();
      console.log('✅ Kafka Producer disconnected');
    }
  }
}

module.exports = new KafkaProducer();

// Example usage when run directly
if (require.main === module) {
  (async () => {
    const producer = new KafkaProducer();
    
    try {
      // Example email notification
      await producer.sendEmailNotification({
        id: 'test-001',
        to: 'user@example.com',
        subject: 'Test Notification',
        template: 'welcome',
        data: {
          name: 'John Doe',
          message: 'Welcome to our service!'
        }
      });

      console.log('Test message sent successfully');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await producer.disconnect();
      process.exit(0);
    }
  })();
}
