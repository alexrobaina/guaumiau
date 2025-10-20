import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

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

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM', 'noreply@cruxclimb.com'),
      to: email,
      subject: 'Password Reset Request - CruxClimb',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for your CruxClimb account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #4CAF50;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2025 CruxClimb. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request

        Hello,

        We received a request to reset your password for your CruxClimb account.

        Click the link below to reset your password:
        ${resetUrl}

        This link will expire in 1 hour.

        If you didn't request a password reset, you can safely ignore this email.

        © 2025 CruxClimb. All rights reserved.
      `,
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
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM', 'noreply@cruxclimb.com'),
      to: email,
      subject: 'Welcome to CruxClimb!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to CruxClimb!</h1>
            </div>
            <div class="content">
              <p>Hi ${username},</p>
              <p>Thanks for joining CruxClimb! We're excited to have you on board.</p>
              <p>Start your climbing journey today and track your progress with our app.</p>
              <p>Happy climbing! 🧗</p>
            </div>
            <div class="footer">
              <p>© 2025 CruxClimb. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
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
}
