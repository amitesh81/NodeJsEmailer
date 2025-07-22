# NodeJsEmailer Project Template

This is a comprehensive template for creating Node.js email services with Kafka integration and Handlebars templating.

## 🚀 Quick Start Template

### Prerequisites
- Node.js 16+ installed
- Docker and Docker Compose
- Gmail account with App Password (or other SMTP provider)

### Template Structure
```
your-email-project/
├── src/
│   ├── config/
│   │   ├── email.js          # Email configuration
│   │   └── kafka.js          # Kafka configuration
│   ├── services/
│   │   └── emailService.js   # Email service with templates
│   ├── kafka/
│   │   ├── producer.js       # Kafka message producer
│   │   └── consumer.js       # Kafka message consumer
│   ├── templates/
│   │   ├── welcome.hbs       # Welcome email template
│   │   └── notification.hbs  # Notification template
│   ├── examples/
│   │   └── test-email.js     # Test scripts
│   └── index.js              # Main application
├── docker-compose.yml        # Kafka Docker setup
├── package.json              # Dependencies
├── .env.example              # Environment template
├── .gitignore               # Git ignore rules
└── README.md                # Project documentation
```

## 📋 Setup Checklist

### 1. Initialize Project
```bash
# Create new project directory
mkdir your-email-project
cd your-email-project

# Initialize npm project
npm init -y

# Install dependencies
npm install kafkajs nodemailer handlebars dotenv express
npm install --save-dev nodemon
```

### 2. Copy Template Files
Copy the following files from NodeJsEmailer template:
- [ ] `src/` directory structure
- [ ] `docker-compose.yml`
- [ ] `.env.example`
- [ ] `.gitignore`
- [ ] `package.json` scripts

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Configure your settings:
# - EMAIL_USER: Your email address
# - EMAIL_PASS: App password or SMTP password
# - KAFKA_BROKERS: Kafka broker addresses
# - KAFKA_TOPIC: Your topic name
```

### 4. Start Services
```bash
# Start Kafka with Docker
docker-compose up -d

# Install dependencies
npm install

# Test email configuration
npm run test-email

# Start the application
npm start
```

## 🎨 Customization Guide

### Email Templates
1. **Create new templates** in `src/templates/`
2. **Use Handlebars syntax** for dynamic content
3. **Test templates** with example data

Example template:
```handlebars
<!DOCTYPE html>
<html>
<head>
    <title>{{subject}}</title>
</head>
<body>
    <h1>Hello {{name}}!</h1>
    <p>{{message}}</p>
    {{#if actionUrl}}
    <a href="{{actionUrl}}">{{actionText}}</a>
    {{/if}}
</body>
</html>
```

### Kafka Topics
1. **Configure topics** in `.env` file
2. **Create producers** for different message types
3. **Set up consumers** for message processing

### Email Providers
Support for multiple email providers:

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
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

## 🔧 Configuration Options

### Package.json Scripts
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "producer": "node src/kafka/producer.js",
    "consumer": "node src/kafka/consumer.js",
    "test-email": "node src/examples/test-email.js"
  }
}
```

### Environment Variables
```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Kafka Configuration
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=your-app-name
KAFKA_GROUP_ID=your-consumer-group
KAFKA_TOPIC=your-topic

# Application Configuration
PORT=3000
NODE_ENV=development
```

## 📊 Monitoring & Debugging

### Kafka UI
- Access at: http://localhost:8080
- Monitor topics, messages, and consumers
- Debug message flow

### Application Logs
- Email sending status
- Kafka connection status
- Error handling and debugging

### Health Checks
```bash
# Check application health
curl http://localhost:3000/health

# Check Kafka containers
docker-compose ps
```

## 🚀 Deployment Options

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY src/ ./src/
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment-Specific Configs
- Development: Local Kafka + Gmail
- Staging: Cloud Kafka + SendGrid
- Production: Managed Kafka + Enterprise SMTP

## 🔒 Security Best Practices

1. **Never commit .env files**
2. **Use App Passwords** for Gmail
3. **Rotate credentials** regularly
4. **Validate input data** in API endpoints
5. **Use HTTPS** in production
6. **Monitor failed authentications**

## 📚 Usage Examples

### Send Welcome Email
```javascript
await emailService.sendTemplatedEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  template: 'welcome',
  data: {
    name: 'John Doe',
    actionUrl: 'https://yourapp.com/activate'
  }
});
```

### Queue Email via Kafka
```javascript
await kafkaProducer.sendEmailNotification({
  to: 'user@example.com',
  subject: 'Notification',
  template: 'notification',
  data: {
    message: 'Your order is ready!'
  }
});
```

### API Endpoint Usage
```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Test Email",
    "template": "welcome",
    "data": {"name": "Test User"}
  }'
```

## 🎯 Template Variations

### Microservice Version
- Separate email service
- API-only interface
- Docker containerized

### Monolith Integration
- Part of larger application
- Shared database
- Internal service calls

### Serverless Version
- AWS Lambda functions
- SQS instead of Kafka
- S3 for template storage

## 📖 Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Handlebars Guide](https://handlebarsjs.com/)
- [KafkaJS Documentation](https://kafka.js.org/)
- [Docker Compose Reference](https://docs.docker.com/compose/)

---

**Created from NodeJsEmailer project by amitesh81**  
**Template Version:** 1.0  
**Last Updated:** 2025-01-21
