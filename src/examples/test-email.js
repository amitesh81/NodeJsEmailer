const emailService = require('../services/emailService');
const kafkaProducer = require('../kafka/producer');
require('dotenv').config();

/**
 * Test script to demonstrate email functionality
 */
async function testDirectEmail() {
  console.log('🧪 Testing direct email sending...');
  
  try {
    // Test templated email
    await emailService.sendTemplatedEmail({
      to: 'test@example.com',
      subject: 'Welcome Test Email',
      template: 'welcome',
      data: {
        name: 'Test User',
        message: 'This is a test welcome email sent directly.',
        actionUrl: 'https://example.com/activate',
        actionText: 'Activate Account'
      }
    });
    
    console.log('✅ Direct templated email test completed');
  } catch (error) {
    console.error('❌ Direct email test failed:', error.message);
  }
}

async function testKafkaEmail() {
  console.log('🧪 Testing Kafka email queue...');
  
  try {
    // Test email via Kafka
    await kafkaProducer.sendEmailNotification({
      id: 'test-kafka-001',
      to: 'test@example.com',
      subject: 'Kafka Test Notification',
      template: 'notification',
      data: {
        title: 'System Notification',
        recipientName: 'Test User',
        message: 'This email was sent via Kafka message queue.',
        isUrgent: true,
        details: [
          'Message processed through Kafka',
          'Template rendered with Handlebars',
          'Sent via Nodemailer'
        ],
        nextSteps: 'No action required - this is just a test.',
        senderName: 'System Administrator',
        timestamp: new Date().toLocaleString()
      }
    });
    
    console.log('✅ Kafka email test completed');
  } catch (error) {
    console.error('❌ Kafka email test failed:', error.message);
  }
}

async function testPlainEmail() {
  console.log('🧪 Testing plain email...');
  
  try {
    await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Plain Text Test',
      text: 'This is a plain text email without templates.',
      html: '<p>This is a <strong>plain HTML email</strong> without templates.</p>'
    });
    
    console.log('✅ Plain email test completed');
  } catch (error) {
    console.error('❌ Plain email test failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting email tests...\n');
  
  // Verify email connection first
  const isConnected = await emailService.verifyConnection();
  if (!isConnected) {
    console.error('❌ Email connection failed. Please check your .env configuration.');
    return;
  }
  
  await testPlainEmail();
  console.log('');
  
  await testDirectEmail();
  console.log('');
  
  await testKafkaEmail();
  console.log('');
  
  console.log('🎉 All tests completed!');
  console.log('\n📝 Note: Make sure to:');
  console.log('   1. Update .env with your email credentials');
  console.log('   2. Start Kafka server');
  console.log('   3. Run the consumer: npm run consumer');
  console.log('   4. Change test email addresses to real ones');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  await kafkaProducer.disconnect();
  process.exit(0);
});

// Run tests
runTests().catch(console.error);
