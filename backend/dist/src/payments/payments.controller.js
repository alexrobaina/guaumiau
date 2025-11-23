"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const payment_response_dto_1 = require("./dto/payment-response.dto");
const webhook_notification_dto_1 = require("./dto/webhook-notification.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PaymentsController = PaymentsController_1 = class PaymentsController {
    paymentsService;
    logger = new common_1.Logger(PaymentsController_1.name);
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async createPaymentPreference(body) {
        return this.paymentsService.createPaymentPreference(body.bookingId);
    }
    async processPayment(createPaymentDto) {
        return this.paymentsService.processPayment(createPaymentDto);
    }
    async getPublicKey(country) {
        const publicKey = this.paymentsService.getPublicKey(country.toUpperCase());
        return { publicKey, country };
    }
    async getPayment(paymentId, country = 'AR') {
        return this.paymentsService.getPayment(paymentId, country.toUpperCase());
    }
    async handleWebhook(notification, request) {
        this.logger.log(`Received webhook notification: ${JSON.stringify(notification)}`);
        try {
            await this.paymentsService.processWebhook(notification);
            return { status: 'ok' };
        }
        catch (error) {
            this.logger.error(`Error processing webhook: ${error.message}`, error.stack);
            return { status: 'error', message: error.message };
        }
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('preference'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear preferencia de pago (Checkout Pro)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Preferencia creada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Solicitud inválida' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reserva no encontrada' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createPaymentPreference", null);
__decorate([
    (0, common_1.Post)('process'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Procesar pago directo' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Pago procesado exitosamente', type: payment_response_dto_1.PaymentResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Pago rechazado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reserva no encontrada' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "processPayment", null);
__decorate([
    (0, common_1.Get)('public-key/:country'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener clave pública de Mercado Pago' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Clave pública obtenida' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'País no configurado' }),
    __param(0, (0, common_1.Param)('country')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPublicKey", null);
__decorate([
    (0, common_1.Get)(':paymentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener información de un pago' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Información del pago' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pago no encontrado' }),
    __param(0, (0, common_1.Param)('paymentId')),
    __param(1, (0, common_1.Query)('country')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPayment", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Webhook de Mercado Pago' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notificación procesada' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [webhook_notification_dto_1.WebhookNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleWebhook", null);
exports.PaymentsController = PaymentsController = PaymentsController_1 = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map