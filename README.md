# NodeJsEmailer - Nodemailer + Handlebars + Kafka Integration

A comprehensive Node.js email service that integrates **Nodemailer**, **Handlebars**, **Kafka Client**, and **Kafka Consumer Service** for scalable email processing with Missouri Judiciary case notification templates.

## Features

- 📧 **Email Service** with Nodemailer
- 🎨 **Template Engine** with Handlebars
- 📨 **Message Queue** with Kafka
- 🔄 **Producer/Consumer** architecture
- 🌐 **REST API** endpoints
- ⚙️ **Environment Configuration**
- 🧪 **Test Scripts** included

## Project Structure

```
src/
├── config/
│   ├── email.js          # Email configuration
│   └── kafka.js          # Kafka configuration
├── services/
│   └── emailService.js   # Email service with template support
├── kafka/
│   ├── producer.js       # Kafka message producer
│   └── consumer.js       # Kafka message consumer
├── templates/
│   ├── welcome.hbs       # Welcome email template
│   └── notification.hbs  # Notification email template
├── examples/
│   └── test-email.js     # Test script
└── index.js              # Main application
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update `.env` with your settings:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Kafka Configuration
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=js-emailer
KAFKA_GROUP_ID=email-consumer-group
KAFKA_TOPIC=email-notifications
```

### 3. Start Kafka

Make sure Kafka is running on your system:

```bash
# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# Start Kafka
bin/kafka-server-start.sh config/server.properties
```

### 4. Run the Application

```bash
# Start the main application (includes consumer)
npm start

# Or run in development mode
npm run dev
```

## Usage Examples

### Direct Email Sending

```javascript
const emailService = require('./src/services/emailService');

// Send templated email
await emailService.sendTemplatedEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  template: 'welcome',
  data: {
    name: 'John Doe',
    message: 'Welcome to our service!'
  }
});
```

### Kafka Producer

```javascript
const kafkaProducer = require('./src/kafka/producer');

// Queue email via Kafka
await kafkaProducer.sendEmailNotification({
  to: 'user@example.com',
  subject: 'Notification',
  template: 'notification',
  data: {
    title: 'Important Update',
    recipientName: 'John Doe',
    message: 'Your account has been updated.'
  }
});
```

### REST API Endpoints

#### Send Email Directly
```bash
POST /send-email
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Test Email",
  "template": "welcome",
  "data": {
    "name": "John Doe",
    "message": "Hello from the API!"
  }
}
```

#### Queue Email via Kafka
```bash
POST /queue-email
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Queued Email",
  "template": "notification",
  "data": {
    "title": "System Alert",
    "recipientName": "John Doe",
    "message": "This email was queued via Kafka."
  }
}
```

#### Health Check
```bash
GET /health
```

## Available Scripts

```bash
npm start          # Start the application
npm run dev        # Start with nodemon (development)
npm run producer   # Run producer example
npm run consumer   # Run consumer only
npm run test-email # Run email tests
```

## Email Templates

### Creating Custom Templates

1. Create a new `.hbs` file in `src/templates/`
2. Use Handlebars syntax for dynamic content:

```handlebars
<h1>Hello {{name}}!</h1>
<p>{{message}}</p>

{{#if showButton}}
<a href="{{buttonUrl}}">{{buttonText}}</a>
{{/if}}
```

### Template Data

Pass data to templates via the `data` parameter:

```javascript
{
  name: 'John Doe',
  message: 'Welcome to our service!',
  showButton: true,
  buttonUrl: 'https://example.com',
  buttonText: 'Get Started'
}
```

## Kafka Integration

### Message Flow

1. **Producer** sends email notification to Kafka topic
2. **Consumer** receives message and processes it
3. **Email Service** renders template and sends email

### Custom Message Types

Extend the consumer to handle different message types:

```javascript
// In consumer.js
async processMessage(messageData) {
  const { type, ...data } = messageData;
  
  switch (type) {
    case 'email_notification':
      await this.handleEmailNotification(data);
      break;
    case 'custom_type':
      await this.handleCustomType(data);
      break;
  }
}
```

## Configuration

### Email Providers

The system supports any SMTP provider. Common configurations:

**Gmail:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

**Outlook:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

**SendGrid:**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

### Kafka Configuration

Adjust Kafka settings in `.env`:

```env
KAFKA_BROKERS=localhost:9092,localhost:9093  # Multiple brokers
KAFKA_CLIENT_ID=my-app
KAFKA_GROUP_ID=my-consumer-group
KAFKA_TOPIC=my-topic
```

## Testing

Run the test script to verify everything works:

```bash
npm run test-email
```

This will:
- Test direct email sending
- Test Kafka message queuing
- Test template rendering
- Verify configurations

## Production Considerations

1. **Error Handling**: Implement dead letter queues for failed messages
2. **Monitoring**: Add logging and metrics
3. **Security**: Use proper authentication and encryption
4. **Scaling**: Run multiple consumer instances
5. **Templates**: Store templates in a database for dynamic updates

## Troubleshooting

### Common Issues

1. **Email not sending**: Check SMTP credentials and firewall settings
2. **Kafka connection failed**: Ensure Kafka is running and accessible
3. **Template not found**: Verify template file exists in `src/templates/`
4. **Consumer not processing**: Check Kafka topic and consumer group settings

### Debug Mode

Set `NODE_ENV=development` for detailed logging.

## License

MIT
