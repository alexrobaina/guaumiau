import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(email: string, username: string, password: string, firstName: string, lastName: string, userRole: UserRole, termsAccepted: boolean, avatar?: string, address?: string, latitude?: number, longitude?: number, city?: string, country?: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email or username already exists');
    }

    if (!termsAccepted) {
      throw new BadRequestException('You must accept the Terms & Conditions to register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const verificationToken = randomBytes(32).toString('hex');
    const hashedVerificationToken = await bcrypt.hash(verificationToken, 10);
    const verificationExpires = new Date(Date.now() + 24 * 3600000); // 24 hours

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
        country: country || 'AR', // Default to Argentina if not provided
        emailVerificationToken: hashedVerificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    const { password: _, refreshToken: __, ...userWithoutPassword } = user;
    const tokens = await this.generateTokens(user.id);

    // Send verification email (non-blocking)
    this.emailService.sendEmailVerification(email, verificationToken, username).catch((error) => {
      this.logger.error(`Failed to send verification email: ${error.message}`);
    });

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, refreshToken: __, ...userWithoutPassword } = user;
    const tokens = await this.generateTokens(user.id);

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: resetExpires,
      },
    });

    // Send password reset email
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return {
      message: 'If the email exists, a reset link has been sent',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const users = await this.prisma.user.findMany({
      where: {
        resetPasswordExpires: {
          gte: new Date(),
        },
      },
    });

    let foundUser: User | null = null;
    for (const u of users) {
      if (u.resetPasswordToken && await bcrypt.compare(token, u.resetPasswordToken)) {
        foundUser = u;
        break;
      }
    }

    if (!foundUser) {
      throw new BadRequestException('Invalid or expired reset token');
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

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const { password: _, refreshToken: __, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'refresh-secret-change-in-production'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user.id);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: 'Logged out successfully' };
  }

  async verifyEmail(token: string) {
    const users = await this.prisma.user.findMany({
      where: {
        emailVerificationExpires: {
          gte: new Date(),
        },
        isEmailVerified: false,
      },
    });

    let foundUser: User | null = null;
    for (const u of users) {
      if (u.emailVerificationToken && await bcrypt.compare(token, u.emailVerificationToken)) {
        foundUser = u;
        break;
      }
    }

    if (!foundUser) {
      throw new BadRequestException('Invalid or expired verification token');
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

  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate new verification token
    const verificationToken = randomBytes(32).toString('hex');
    const hashedVerificationToken = await bcrypt.hash(verificationToken, 10);
    const verificationExpires = new Date(Date.now() + 24 * 3600000); // 24 hours

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: hashedVerificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    // Send verification email
    await this.emailService.sendEmailVerification(email, verificationToken, user.username);

    return { message: 'Verification email sent' };
  }

  async updateLocation(userId: string, latitude: number, longitude: number, address?: string, city?: string, country?: string) {
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

  async updateProfile(userId: string, updateData: {
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }) {
    // Check if email or username is being updated and if it's already taken
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
        throw new BadRequestException('Email or username already exists');
      }
    }

    // Check if phone is being updated and if it's already taken
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
        throw new BadRequestException('Phone number already exists');
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

  private async generateTokens(userId: string) {
    const payload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET', 'your-secret-key-change-in-production'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'refresh-secret-change-in-production'),
      expiresIn: '7d',
    });

    // Hash and store refresh token
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
}
