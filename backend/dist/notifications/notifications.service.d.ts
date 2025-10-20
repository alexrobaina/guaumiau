import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class NotificationsService implements OnModuleInit {
    private configService;
    private readonly logger;
    private isInitialized;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    sendPushNotification(token: string, title: string, body: string, data?: any): Promise<{
        success: boolean;
        messageId: any;
    }>;
    sendMulticastNotification(tokens: string[], title: string, body: string, data?: any): Promise<{
        successCount: any;
        failureCount: any;
        responses: any;
    }>;
}
