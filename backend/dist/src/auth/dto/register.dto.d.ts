import { UserRole } from '@prisma/client';
export declare class RegisterDto {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    userRole: UserRole;
    termsAccepted: boolean;
    avatar?: string;
}
