import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { UserRole } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, emailService: EmailService);
    register(email: string, username: string, password: string, firstName: string, lastName: string, userRole: UserRole, termsAccepted: boolean, avatar?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatar: string | null;
            roles: import("@prisma/client").$Enums.UserRole[];
            address: string | null;
            city: string | null;
            state: string | null;
            postalCode: string | null;
            country: string;
            latitude: number | null;
            longitude: number | null;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
            isActive: boolean;
            termsAccepted: boolean;
            termsAcceptedAt: Date | null;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue | null;
            pushTokens: string[];
            resetPasswordToken: string | null;
            resetPasswordExpires: Date | null;
            emailVerificationToken: string | null;
            emailVerificationExpires: Date | null;
            emergencyContactName: string | null;
            emergencyContactPhone: string | null;
        };
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatar: string | null;
            roles: import("@prisma/client").$Enums.UserRole[];
            address: string | null;
            city: string | null;
            state: string | null;
            postalCode: string | null;
            country: string;
            latitude: number | null;
            longitude: number | null;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
            isActive: boolean;
            termsAccepted: boolean;
            termsAcceptedAt: Date | null;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue | null;
            pushTokens: string[];
            resetPasswordToken: string | null;
            resetPasswordExpires: Date | null;
            emailVerificationToken: string | null;
            emailVerificationExpires: Date | null;
            emergencyContactName: string | null;
            emergencyContactPhone: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        roles: import("@prisma/client").$Enums.UserRole[];
        address: string | null;
        city: string | null;
        state: string | null;
        postalCode: string | null;
        country: string;
        latitude: number | null;
        longitude: number | null;
        isEmailVerified: boolean;
        isPhoneVerified: boolean;
        isActive: boolean;
        termsAccepted: boolean;
        termsAcceptedAt: Date | null;
        notificationSettings: import("@prisma/client/runtime/library").JsonValue | null;
        pushTokens: string[];
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
        emailVerificationToken: string | null;
        emailVerificationExpires: Date | null;
        emergencyContactName: string | null;
        emergencyContactPhone: string | null;
    } | null>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    private generateTokens;
}
