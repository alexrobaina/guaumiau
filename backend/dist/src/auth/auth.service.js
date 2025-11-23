"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const bcrypt = __importStar(require("bcryptjs"));
const crypto_1 = require("crypto");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    configService;
    emailService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService, configService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
    }
    async register(email, username, password, firstName, lastName, userRole, termsAccepted, avatar, address, latitude, longitude, city, country) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email or username already exists');
        }
        if (!termsAccepted) {
            throw new common_1.BadRequestException('You must accept the Terms & Conditions to register');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const hashedVerificationToken = await bcrypt.hash(verificationToken, 10);
        const verificationExpires = new Date(Date.now() + 24 * 3600000);
        const user = await this.prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                firstName,
                lastName,
                roles: [userRole],
                termsAccepted,
                termsAcceptedAt: new Date(),
                avatar,
                address,
                latitude,
                longitude,
                city,
                country: country || 'AR',
                emailVerificationToken: hashedVerificationToken,
                emailVerificationExpires: verificationExpires,
            },
        });
        const { password: _, refreshToken: __, ...userWithoutPassword } = user;
        const tokens = await this.generateTokens(user.id);
        this.emailService.sendEmailVerification(email, verificationToken, username).catch((error) => {
            this.logger.error(`Failed to send verification email: ${error.message}`);
        });
        return {
            user: userWithoutPassword,
            ...tokens,
        };
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const { password: _, refreshToken: __, ...userWithoutPassword } = user;
        const tokens = await this.generateTokens(user.id);
        return {
            user: userWithoutPassword,
            ...tokens,
        };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return { message: 'If the email exists, a reset link has been sent' };
        }
        const resetToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const hashedToken = await bcrypt.hash(resetToken, 10);
        const resetExpires = new Date(Date.now() + 3600000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: resetExpires,
            },
        });
        await this.emailService.sendPasswordResetEmail(email, resetToken);
        return {
            message: 'If the email exists, a reset link has been sent',
        };
    }
    async resetPassword(token, newPassword) {
        const users = await this.prisma.user.findMany({
            where: {
                resetPasswordExpires: {
                    gte: new Date(),
                },
            },
        });
        let foundUser = null;
        for (const u of users) {
            if (u.resetPasswordToken && await bcrypt.compare(token, u.resetPasswordToken)) {
                foundUser = u;
                break;
            }
        }
        if (!foundUser) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: foundUser.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });
        return { message: 'Password reset successfully' };
    }
    async validateUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return null;
        }
        const { password: _, refreshToken: __, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET', 'refresh-secret-change-in-production'),
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user || !user.refreshToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!isRefreshTokenValid) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const tokens = await this.generateTokens(user.id);
            return tokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        return { message: 'Logged out successfully' };
    }
    async verifyEmail(token) {
        const users = await this.prisma.user.findMany({
            where: {
                emailVerificationExpires: {
                    gte: new Date(),
                },
                isEmailVerified: false,
            },
        });
        let foundUser = null;
        for (const u of users) {
            if (u.emailVerificationToken && await bcrypt.compare(token, u.emailVerificationToken)) {
                foundUser = u;
                break;
            }
        }
        if (!foundUser) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
        await this.prisma.user.update({
            where: { id: foundUser.id },
            data: {
                isEmailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpires: null,
            },
        });
        return { message: 'Email verified successfully' };
    }
    async resendVerificationEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.isEmailVerified) {
            throw new common_1.BadRequestException('Email already verified');
        }
        const verificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const hashedVerificationToken = await bcrypt.hash(verificationToken, 10);
        const verificationExpires = new Date(Date.now() + 24 * 3600000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerificationToken: hashedVerificationToken,
                emailVerificationExpires: verificationExpires,
            },
        });
        await this.emailService.sendEmailVerification(email, verificationToken, user.username);
        return { message: 'Verification email sent' };
    }
    async updateLocation(userId, latitude, longitude, address, city, country) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                latitude,
                longitude,
                ...(address && { address }),
                ...(city && { city }),
                ...(country && { country }),
            },
        });
        const { password: _, refreshToken: __, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async updateProfile(userId, updateData) {
        if (updateData.email || updateData.username) {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    AND: [
                        { id: { not: userId } },
                        {
                            OR: [
                                ...(updateData.email ? [{ email: updateData.email }] : []),
                                ...(updateData.username ? [{ username: updateData.username }] : []),
                            ],
                        },
                    ],
                },
            });
            if (existingUser) {
                throw new common_1.BadRequestException('Email or username already exists');
            }
        }
        if (updateData.phone) {
            const existingPhone = await this.prisma.user.findFirst({
                where: {
                    AND: [
                        { id: { not: userId } },
                        { phone: updateData.phone },
                    ],
                },
            });
            if (existingPhone) {
                throw new common_1.BadRequestException('Phone number already exists');
            }
        }
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(updateData.email && { email: updateData.email }),
                ...(updateData.username && { username: updateData.username }),
                ...(updateData.firstName && { firstName: updateData.firstName }),
                ...(updateData.lastName && { lastName: updateData.lastName }),
                ...(updateData.phone && { phone: updateData.phone }),
                ...(updateData.avatar && { avatar: updateData.avatar }),
                ...(updateData.address && { address: updateData.address }),
                ...(updateData.latitude !== undefined && { latitude: updateData.latitude }),
                ...(updateData.longitude !== undefined && { longitude: updateData.longitude }),
                ...(updateData.city && { city: updateData.city }),
                ...(updateData.state && { state: updateData.state }),
                ...(updateData.postalCode && { postalCode: updateData.postalCode }),
                ...(updateData.country && { country: updateData.country }),
            },
        });
        const { password: _, refreshToken: __, ...userWithoutPassword } = user;
        return { user: userWithoutPassword };
    }
    async generateTokens(userId) {
        const payload = { sub: userId };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET', 'your-secret-key-change-in-production'),
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET', 'refresh-secret-change-in-production'),
            expiresIn: '7d',
        });
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashedRefreshToken },
        });
        return {
            accessToken,
            refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map