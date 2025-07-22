const { Kafka } = require('kafkajs');
require('dotenv').config();

/**
 * Kafka configuration and client setup
 */
class KafkaConfig {
  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'js-emailer',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      retry: {
        initialRetryTime: 100,
        retries: 8
      }
    });

    this.producer = null;
    this.consumer = null;
  }

  async createProducer() {
    if (!this.producer) {
      this.producer = this.kafka.producer({
        maxInFlightRequests: 1,
        idempotent: true,
        transactionTimeout: 30000
      });
      await this.producer.connect();
      console.log('✅ Kafka Producer connected');
    }
    return this.producer;
  }

  async createConsumer(groupId = null) {
    if (!this.consumer) {
      this.consumer = this.kafka.consumer({
        groupId: groupId || process.env.KAFKA_GROUP_ID || 'email-consumer-group',
        sessionTimeout: 30000,
        heartbeatInterval: 3000
      });
      await this.consumer.connect();
      console.log('✅ Kafka Consumer connected');
    }
    return this.consumer;
  }

  async disconnect() {
    const promises = [];
    if (this.producer) {
      promises.push(this.producer.disconnect());
    }
    if (this.consumer) {
      promises.push(this.consumer.disconnect());
    }
    await Promise.all(promises);
    console.log('✅ Kafka connections closed');
  }

  getKafka() {
    return this.kafka;
  }
}

module.exports = new KafkaConfig();
