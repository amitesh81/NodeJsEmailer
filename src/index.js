const express = require('express');
const kafkaProducer = require('./kafka/producer');
const kafkaConsumer = require('./kafka/consumer');
const emailService = require('./services/emailService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Main application class
 */
class EmailerApp {
  constructor() {
    this.isShuttingDown = false;
  }

  async initialize() {
    try {
      // Verify email connection
      await emailService.verifyConnection();
      
      // Start Kafka consumer
      await kafkaConsumer.start();
      
      console.log('✅ Application initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
      throw error;
    }
  }

  setupRoutes() {
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        consumer: kafkaConsumer.getStatus()
      });
    });

    // Send email directly (for testing)
    app.post('/send-email', async (req, res) => {
      try {
        console.log('📨 Received request body:', req.body);
        const { to, subject, template, data, ...options } = req.body;
        
        // Validate required fields
        if (!to) {
          return res.status(400).json({ success: false, error: 'Missing required field: to' });
        }
        if (!subject) {
          return res.status(400).json({ success: false, error: 'Missing required field: subject' });
        }
        
        let result;
        if (template) {
          result = await emailService.sendTemplatedEmail({
            to, subject, template, data, ...options
          });
        } else {
          result = await emailService.sendEmail({
            to, subject, ...options
          });
        }
        
        res.json({ success: true, messageId: result.messageId });
      } catch (error) {
        console.error('❌ API Error:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Queue email via Kafka
    app.post('/queue-email', async (req, res) => {
      try {
        const emailData = req.body;
        const result = await kafkaProducer.sendEmailNotification(emailData);
        
        res.json({ 
          success: true, 
          message: 'Email queued successfully',
          kafkaResult: result 
        });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Send custom message to Kafka
    app.post('/send-message', async (req, res) => {
      try {
        const { topic, key, value, headers } = req.body;
        const result = await kafkaProducer.sendMessage(topic, key, value, headers);
        
        res.json({ 
          success: true, 
          message: 'Message sent successfully',
          kafkaResult: result 
        });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
  }

  setupGracefulShutdown() {
    const shutdown = async (signal) => {
      if (this.isShuttingDown) return;
      this.isShuttingDown = true;
      
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      
      try {
        // Stop Kafka consumer
        await kafkaConsumer.disconnect();
        
        // Disconnect Kafka producer
        await kafkaProducer.disconnect();
        
        console.log('✅ Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }

  async start() {
    try {
      await this.initialize();
      this.setupRoutes();
      this.setupGracefulShutdown();
      
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📧 Email service ready`);
        console.log(`📨 Kafka consumer listening for messages`);
        console.log('\nAvailable endpoints:');
        console.log(`  GET  /health - Health check`);
        console.log(`  POST /send-email - Send email directly`);
        console.log(`  POST /queue-email - Queue email via Kafka`);
        console.log(`  POST /send-message - Send custom Kafka message`);
      });
      
    } catch (error) {
      console.error('❌ Failed to start application:', error);
      process.exit(1);
    }
  }
}

// Start the application
const app_instance = new EmailerApp();
app_instance.start();

module.exports = app;
