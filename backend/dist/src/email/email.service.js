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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
const templates_1 = require("./templates");
let EmailService = EmailService_1 = class EmailService {
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    transporter;
    isConfigured = false;
    constructor(configService) {
        this.configService = configService;
        this.initializeTransporter();
    }
    initializeTransporter() {
        const emailHost = this.configService.get('EMAIL_HOST');
        const emailPort = this.configService.get('EMAIL_PORT');
        const emailUser = this.configService.get('EMAIL_USER');
        const emailPassword = this.configService.get('EMAIL_PASSWORD');
        if (!emailHost || !emailUser || !emailPassword) {
            this.logger.warn('Email service not configured. Emails will be logged to console.');
            return;
        }
        this.transporter = nodemailer.createTransport({
            host: emailHost,
            port: emailPort || 587,
            secure: emailPort === 465,
            auth: {
                user: emailUser,
                pass: emailPassword,
            },
        });
        this.isConfigured = true;
        this.logger.log('Email service configured successfully');
    }
    async sendPasswordResetEmail(email, resetToken) {
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
        const template = (0, templates_1.passwordResetTemplate)({ resetUrl });
        const mailOptions = {
            from: this.configService.get('EMAIL_FROM', 'noreply@guaumiau.com'),
            to: email,
            subject: 'Restablecer Contraseña - Guaumiau',
            html: template.html,
            text: template.text,
        };
        if (this.isConfigured) {
            try {
                await this.transporter.sendMail(mailOptions);
                this.logger.log(`Password reset email sent to ${email}`);
            }
            catch (error) {
                this.logger.error(`Failed to send email to ${email}:`, error.message);
                throw new Error('Failed to send password reset email');
            }
        }
        else {
            this.logger.warn(`[DEV MODE] Password reset email would be sent to: ${email}`);
            this.logger.warn(`[DEV MODE] Reset URL: ${resetUrl}`);
            this.logger.warn(`[DEV MODE] Reset Token: ${resetToken}`);
        }
    }
    async sendWelcomeEmail(email, username) {
        const template = (0, templates_1.welcomeEmailTemplate)({ username });
        const mailOptions = {
            from: this.configService.get('EMAIL_FROM', 'noreply@guaumiau.com'),
            to: email,
            subject: '¡Bienvenido a Guaumiau! 🐾',
            html: template.html,
            text: template.text,
        };
        if (this.isConfigured) {
            try {
                await this.transporter.sendMail(mailOptions);
                this.logger.log(`Welcome email sent to ${email}`);
            }
            catch (error) {
                this.logger.error(`Failed to send welcome email to ${email}:`, error.message);
            }
        }
        else {
            this.logger.warn(`[DEV MODE] Welcome email would be sent to: ${email}`);
        }
    }
    async sendEmailVerification(email, verificationToken, username) {
        const backendUrl = this.configService.get('BACKEND_URL', 'http://localhost:3000');
        const verificationUrl = `${backendUrl}/auth/verify?token=${verificationToken}`;
        const template = (0, templates_1.emailVerificationTemplate)({ username, verificationUrl });
        const mailOptions = {
            from: this.configService.get('EMAIL_FROM', 'noreply@guaumiau.com'),
            to: email,
            subject: 'Verifica tu correo electrónico - Guaumiau 🐾',
            html: template.html,
            text: template.text,
        };
        if (this.isConfigured) {
            try {
                await this.transporter.sendMail(mailOptions);
                this.logger.log(`Email verification sent to ${email}`);
            }
            catch (error) {
                this.logger.error(`Failed to send verification email to ${email}:`, error.message);
                throw new Error('Failed to send verification email');
            }
        }
        else {
            this.logger.warn(`[DEV MODE] Verification email would be sent to: ${email}`);
            this.logger.warn(`[DEV MODE] Verification URL: ${verificationUrl}`);
            this.logger.warn(`[DEV MODE] Verification Token: ${verificationToken}`);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map