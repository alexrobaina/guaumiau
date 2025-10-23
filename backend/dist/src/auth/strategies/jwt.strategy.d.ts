import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(payload: any): Promise<{
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
        notificationSettings: import("@prisma/client/runtime/library").JsonValue | null;
        pushTokens: string[];
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
        emergencyContactName: string | null;
        emergencyContactPhone: string | null;
    }>;
}
export {};
