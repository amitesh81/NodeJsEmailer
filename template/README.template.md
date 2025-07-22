# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## Features

- 📧 **Email Service** with Nodemailer
- 🎨 **Template Engine** with Handlebars
- 📨 **Message Queue** with Kafka
- 🔄 **Producer/Consumer** architecture
- 🌐 **REST API** endpoints
- ⚙️ **Environment Configuration**
- 🧪 **Test Scripts** included

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Kafka
```bash
docker-compose up -d
```

### 4. Run the Application
```bash
npm start
```

## Configuration

Update `.env` with your settings:

```env
# Email Configuration
EMAIL_HOST={{EMAIL_HOST}}
EMAIL_USER={{EMAIL_USER}}
EMAIL_PASS={{EMAIL_PASS}}

# Kafka Configuration
KAFKA_BROKERS={{KAFKA_BROKERS}}
KAFKA_TOPIC={{KAFKA_TOPIC}}
```

## Available Scripts

```bash
npm start          # Start the application
npm run dev        # Start with nodemon (development)
npm run producer   # Run producer example
npm run consumer   # Run consumer only
npm run test-email # Run email tests
```

## API Endpoints

- `GET /health` - Health check
- `POST /send-email` - Send email directly
- `POST /queue-email` - Queue email via Kafka
- `POST /send-message` - Send custom Kafka message

## Usage Examples

### Send Email Directly
```javascript
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

### Queue Email via Kafka
```javascript
await kafkaProducer.sendEmailNotification({
  to: 'user@example.com',
  subject: 'Notification',
  template: 'notification',
  data: {
    title: 'Important Update',
    message: 'Your account has been updated.'
  }
});
```

## License

MIT

## Author

{{AUTHOR_NAME}}
