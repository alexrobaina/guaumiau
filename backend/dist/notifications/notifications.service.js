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
var NotificationsService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin = __importStar(require("firebase-admin"));
let NotificationsService = NotificationsService_1 = class NotificationsService {
    configService;
    logger = new common_1.Logger(NotificationsService_1.name);
    isInitialized = false;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const serviceAccount = this.configService.get('FIREBASE_SERVICE_ACCOUNT');
        if (!serviceAccount) {
            this.logger.warn('FIREBASE_SERVICE_ACCOUNT not configured. Push notifications will be disabled.');
            return;
        }
        try {
            const credentials = JSON.parse(serviceAccount);
            if (!credentials.project_id || credentials.project_id === 'your-project-id') {
                this.logger.warn('Firebase credentials not properly configured. Push notifications will be disabled.');
                return;
            }
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert(credentials),
                });
                this.isInitialized = true;
                this.logger.log('Firebase Admin SDK initialized successfully');
            }
        }
        catch (error) {
            this.logger.error('Failed to initialize Firebase Admin SDK:', error.message);
            this.logger.warn('Push notifications will be disabled.');
        }
    }
    async sendPushNotification(token, title, body, data) {
        if (!this.isInitialized) {
            this.logger.error('Firebase not initialized. Cannot send push notification.');
            throw new Error('Push notifications are not available. Firebase is not initialized.');
        }
        const message = {
            notification: {
                title,
                body,
            },
            data: data || {},
            token,
        };
        try {
            const response = await admin.messaging().send(message);
            return { success: true, messageId: response };
        }
        catch (error) {
            this.logger.error('Error sending push notification:', error);
            throw error;
        }
    }
    async sendMulticastNotification(tokens, title, body, data) {
        if (!this.isInitialized) {
            this.logger.error('Firebase not initialized. Cannot send multicast notification.');
            throw new Error('Push notifications are not available. Firebase is not initialized.');
        }
        const message = {
            notification: {
                title,
                body,
            },
            data: data || {},
            tokens,
        };
        try {
            const response = await admin.messaging().sendEachForMulticast(message);
            return {
                successCount: response.successCount,
                failureCount: response.failureCount,
                responses: response.responses,
            };
        }
        catch (error) {
            this.logger.error('Error sending multicast notification:', error);
            throw error;
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map