const emailService = require('../services/emailService');
const kafkaProducer = require('../kafka/producer');
require('dotenv').config();

/**
 * Test script to demonstrate email functionality
 */


async function testKafkaEmail() {
  console.log('🧪 Testing Kafka email queue...');
  
  try {
    // Test email via Kafka using case-notification template
    await kafkaProducer.sendEmailNotification({
      id: 'test-kafka-001',
      to: 'exampleh@gmail.com',
      subject: 'Kafka Case Notification Test',
      template: 'case-notification',
      data: {
        caseNumber: '22AC-KAFKA001',
        caseTitle: 'Kafka Test Case Notification'
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
      to: 'example@gmail.com',
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
