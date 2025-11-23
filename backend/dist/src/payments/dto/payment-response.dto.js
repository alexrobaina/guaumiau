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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PaymentResponseDto {
    id;
    status;
    statusDetail;
    transactionAmount;
    currency;
    externalTransactionId;
    platformCommission;
    providerAmount;
    description;
    createdAt;
}
exports.PaymentResponseDto = PaymentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del pago' }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estado del pago' }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detalle del estado' }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "statusDetail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Monto total' }),
    __metadata("design:type", Number)
], PaymentResponseDto.prototype, "transactionAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Moneda' }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la transacción externa' }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "externalTransactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Comisión de la plataforma' }),
    __metadata("design:type", Number)
], PaymentResponseDto.prototype, "platformCommission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Monto para el proveedor' }),
    __metadata("design:type", Number)
], PaymentResponseDto.prototype, "providerAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción del pago' }),
    __metadata("design:type", String)
], PaymentResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación' }),
    __metadata("design:type", Date)
], PaymentResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=payment-response.dto.js.map