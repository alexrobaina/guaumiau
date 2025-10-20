import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, emailService: EmailService);
    register(email: string, username: string, password: string, avatar?: string): Promise<{
        accessToken: any;
        refreshToken: any;
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string | null;
            resetPasswordToken: string | null;
            resetPasswordExpires: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(email: string, password: string): Promise<{
        accessToken: any;
        refreshToken: any;
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string | null;
            resetPasswordToken: string | null;
            resetPasswordExpires: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    validateUser(userId: string): Promise<{
        id: string;
        email: string;
        username: string;
        avatar: string | null;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: any;
        refreshToken: any;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    private generateTokens;
}
