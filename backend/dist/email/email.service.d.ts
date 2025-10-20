import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    private transporter;
    private isConfigured;
    constructor(configService: ConfigService);
    private initializeTransporter;
    sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
    sendWelcomeEmail(email: string, username: string): Promise<void>;
}
