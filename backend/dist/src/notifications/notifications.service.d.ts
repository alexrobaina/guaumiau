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
        messageId: string;
    }>;
    sendMulticastNotification(tokens: string[], title: string, body: string, data?: any): Promise<{
        successCount: number;
        failureCount: number;
        responses: import("node_modules/firebase-admin/lib/messaging/messaging-api").SendResponse[];
    }>;
}
