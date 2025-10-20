import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(payload: any): Promise<{
        id: string;
        email: string;
        username: string;
        avatar: string | null;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
