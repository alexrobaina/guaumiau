import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
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
    login(loginDto: LoginDto): Promise<{
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
    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(user: any): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getProfile(user: any): Promise<{
        user: any;
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendVerification(resendVerificationDto: ResendVerificationDto): Promise<{
        message: string;
    }>;
    verifyEmailPage(token: string, res: Response): Promise<Response<any, Record<string, any>>>;
    private generateVerificationHtml;
}
