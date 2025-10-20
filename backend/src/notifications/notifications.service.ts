import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private isInitialized = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const serviceAccount = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT');

    if (!serviceAccount) {
      this.logger.warn('FIREBASE_SERVICE_ACCOUNT not configured. Push notifications will be disabled.');
      return;
    }

    // Check if it's a valid JSON and has required fields
    try {
      const credentials = JSON.parse(serviceAccount);

      if (!credentials.project_id || credentials.project_id === 'your-project-id') {
        this.logger.warn('Firebase credentials not properly configured. Push notifications will be disabled.');
        return;
      }

      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(credentials),
        });
        this.isInitialized = true;
        this.logger.log('Firebase Admin SDK initialized successfully');
      }
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK:', error.message);
      this.logger.warn('Push notifications will be disabled.');
    }
  }

  async sendPushNotification(token: string, title: string, body: string, data?: any) {
    if (!this.isInitialized) {
      this.logger.error('Firebase not initialized. Cannot send push notification.');
      throw new Error('Push notifications are not available. Firebase is not initialized.');
    }

    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      token,
    };

    try {
      const response = await admin.messaging().send(message);
      return { success: true, messageId: response };
    } catch (error) {
      this.logger.error('Error sending push notification:', error);
      throw error;
    }
  }

  async sendMulticastNotification(tokens: string[], title: string, body: string, data?: any) {
    if (!this.isInitialized) {
      this.logger.error('Firebase not initialized. Cannot send multicast notification.');
      throw new Error('Push notifications are not available. Firebase is not initialized.');
    }

    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      tokens,
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses,
      };
    } catch (error) {
      this.logger.error('Error sending multicast notification:', error);
      throw error;
    }
  }
}
