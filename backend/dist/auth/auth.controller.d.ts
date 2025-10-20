import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
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
    login(loginDto: LoginDto): Promise<{
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
    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: any;
        refreshToken: any;
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
}
