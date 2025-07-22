const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const emailConfig = require('../config/email');

/**
 * Email service with Handlebars template support
 */
class EmailService {
  constructor() {
    this.transporter = emailConfig.getTransporter();
    this.templatesPath = path.join(__dirname, '../templates');
  }

  /**
   * Compile and render Handlebars template
   */
  async renderTemplate(templateName, data) {
    try {
      const templatePath = path.join(this.templatesPath, `${templateName}.hbs`);
      const templateContent = await fs.readFile(templatePath, 'utf8');
      const template = handlebars.compile(templateContent);
      return template(data);
    } catch (error) {
      console.error(`Error rendering template ${templateName}:`, error);
      throw error;
    }
  }

  /**
   * Send email using template
   */
  async sendTemplatedEmail(options) {
    try {
      const { to, subject, template, data, from } = options;
      
      const htmlContent = await this.renderTemplate(template, data);
      
      const mailOptions = {
        from: from || process.env.EMAIL_USER,
        to,
        subject,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send plain email without template
   */
  async sendEmail(options) {
    try {
      const { to, subject, text, html, from } = options;
      
      const mailOptions = {
        from: from || process.env.EMAIL_USER,
        to,
        subject,
        text,
        html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }

  /**
   * Verify email configuration
   */
  async verifyConnection() {
    return await emailConfig.verifyConnection();
  }
}

module.exports = new EmailService();
