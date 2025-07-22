const emailService = require('../services/emailService');
const kafkaProducer = require('../kafka/producer');
require('dotenv').config();

/**
 * Example script demonstrating case notification email functionality
 */

async function sendCaseNotificationDirect() {
  console.log('📧 Testing case notification email (direct send)...');
  
  try {
    // Example case notification data
    const caseData = {
      caseNumber: '22AC-CC12345',
      caseTitle: 'State of Missouri vs. John Doe'
    };

    // Send HTML email
    await emailService.sendTemplatedEmail({
      to: 'user@example.com',
      subject: `Case Notification - ${caseData.caseNumber}`,
      template: 'case-notification',
      data: caseData
    });
    
    console.log('✅ Case notification email sent successfully');
  } catch (error) {
    console.error('❌ Error sending case notification:', error.message);
  }
}

async function sendCaseNotificationViaKafka() {
  console.log('📨 Testing case notification via Kafka...');
  
  try {
    const caseData = {
      id: 'case-notification-001',
      to: 'user@example.com',
      subject: 'Case Update - 22AC-CC12345',
      template: 'case-notification',
      data: {
        caseNumber: '22AC-CC12345',
        caseTitle: 'State of Missouri vs. John Doe'
      }
    };

    await kafkaProducer.sendEmailNotification(caseData);
    console.log('✅ Case notification queued via Kafka successfully');
  } catch (error) {
    console.error('❌ Error queuing case notification:', error.message);
  }
}

async function sendSimpleCaseNotification() {
  console.log('📧 Testing simple case notification...');
  
  try {
    const simpleCaseData = {
      caseNumber: '22AC-CC67890',
      caseTitle: 'State of Missouri vs. Jane Smith'
    };

    await emailService.sendTemplatedEmail({
      to: 'user@example.com',
      subject: `Case Tracking Confirmation - ${simpleCaseData.caseNumber}`,
      template: 'case-notification',
      data: simpleCaseData
    });
    
    console.log('✅ Simple case notification sent successfully');
  } catch (error) {
    console.error('❌ Error sending simple case notification:', error.message);
  }
}

async function sendTextOnlyNotification() {
  console.log('📧 Testing text-only case notification...');
  
  try {
    const caseData = {
      caseNumber: '22AC-CC11111',
      caseTitle: 'State of Missouri vs. Test User'
    };

    await emailService.sendTemplatedEmail({
      to: 'user@example.com',
      subject: `Case Update - ${caseData.caseNumber}`,
      template: 'case-notification-text',
      data: caseData
    });
    
    console.log('✅ Text-only case notification sent successfully');
  } catch (error) {
    console.error('❌ Error sending text-only notification:', error.message);
  }
}

async function runCaseNotificationTests() {
  console.log('🚀 Starting case notification tests...\n');
  
  // Verify email connection first
  const isConnected = await emailService.verifyConnection();
  if (!isConnected) {
    console.error('❌ Email connection failed. Please check your .env configuration.');
    return;
  }
  
  await sendSimpleCaseNotification();
  console.log('');
  
  await sendCaseNotificationDirect();
  console.log('');
  
  await sendTextOnlyNotification();
  console.log('');
  
  await sendCaseNotificationViaKafka();
  console.log('');
  
  console.log('🎉 All case notification tests completed!');
  console.log('\n📝 Template Usage Notes:');
  console.log('   • case-notification.hbs - HTML template for case notifications');
  console.log('   • case-notification-text.hbs - Plain text version');
  console.log('   • Templates require caseNumber and caseTitle fields');
  console.log('   • Converted from original Apache Velocity templates');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  await kafkaProducer.disconnect();
  process.exit(0);
});

// Run tests
if (require.main === module) {
  runCaseNotificationTests().catch(console.error);
}

module.exports = {
  sendCaseNotificationDirect,
  sendCaseNotificationViaKafka,
  sendSimpleCaseNotification,
  sendTextOnlyNotification
};
