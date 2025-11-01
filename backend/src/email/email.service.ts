import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import {
  emailVerificationTemplate,
  welcomeEmailTemplate,
  passwordResetTemplate,
} from './templates';

/**
 * Email service for sending transactional emails
 * Supports Gmail, SendGrid, Mailgun, and other SMTP providers
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailHost = this.configService.get<string>('EMAIL_HOST');
    const emailPort = this.configService.get<number>('EMAIL_PORT');
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');

    if (!emailHost || !emailUser || !emailPassword) {
      this.logger.warn('Email service not configured. Emails will be logged to console.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort || 587,
      secure: emailPort === 465,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    this.isConfigured = true;
    this.logger.log('Email service configured successfully');
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const template = passwordResetTemplate({ resetUrl });

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM', 'noreply@guaumiau.com'),
      to: email,
      subject: 'Restablecer Contraseña - Guaumiau',
      html: template.html,
      text: template.text,
    };

    if (this.isConfigured) {
      try {
        await this.transporter.sendMail(mailOptions);
        this.logger.log(`Password reset email sent to ${email}`);
      } catch (error) {
        this.logger.error(`Failed to send email to ${email}:`, error.message);
        throw new Error('Failed to send password reset email');
      }
    } else {
      // Development mode - log the email instead of sending
      this.logger.warn(`[DEV MODE] Password reset email would be sent to: ${email}`);
      this.logger.warn(`[DEV MODE] Reset URL: ${resetUrl}`);
      this.logger.warn(`[DEV MODE] Reset Token: ${resetToken}`);
    }
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    const template = welcomeEmailTemplate({ username });

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM', 'noreply@guaumiau.com'),
      to: email,
      subject: '¡Bienvenido a Guaumiau! 🐾',
      html: template.html,
      text: template.text,
    };

    if (this.isConfigured) {
      try {
        await this.transporter.sendMail(mailOptions);
        this.logger.log(`Welcome email sent to ${email}`);
      } catch (error) {
        this.logger.error(`Failed to send welcome email to ${email}:`, error.message);
        // Don't throw - welcome email is not critical
      }
    } else {
      this.logger.warn(`[DEV MODE] Welcome email would be sent to: ${email}`);
    }
  }

  async sendEmailVerification(email: string, verificationToken: string, username: string): Promise<void> {
    // Use backend URL for HTML verification page
    const backendUrl = this.configService.get<string>('BACKEND_URL', 'http://localhost:3000');
    const verificationUrl = `${backendUrl}/auth/verify?token=${verificationToken}`;

    const template = emailVerificationTemplate({ username, verificationUrl });

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM', 'noreply@guaumiau.com'),
      to: email,
      subject: 'Verifica tu correo electrónico - Guaumiau 🐾',
      html: template.html,
      text: template.text,
    };

    if (this.isConfigured) {
      try {
        await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email verification sent to ${email}`);
      } catch (error) {
        this.logger.error(`Failed to send verification email to ${email}:`, error.message);
        throw new Error('Failed to send verification email');
      }
    } else {
      // Development mode - log the email instead of sending
      this.logger.warn(`[DEV MODE] Verification email would be sent to: ${email}`);
      this.logger.warn(`[DEV MODE] Verification URL: ${verificationUrl}`);
      this.logger.warn(`[DEV MODE] Verification Token: ${verificationToken}`);
    }
  }
}
