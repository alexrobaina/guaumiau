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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mercadopago_1 = require("mercadopago");
const prisma_service_1 = require("../prisma/prisma.service");
const payments_config_1 = require("./payments.config");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    prisma;
    logger = new common_1.Logger(PaymentsService_1.name);
    clients = new Map();
    paymentClients = new Map();
    preferenceClients = new Map();
    constructor(prisma) {
        this.prisma = prisma;
        this.initializeClients();
    }
    initializeClients() {
        Object.entries(payments_config_1.PAYMENT_CONFIG).forEach(([country, config]) => {
            const countryCode = country;
            if (!config.accessToken) {
                this.logger.warn(`No access token configured for country: ${country}`);
                return;
            }
            const client = new mercadopago_1.MercadoPagoConfig({
                accessToken: config.accessToken,
                options: {
                    timeout: 5000,
                },
            });
            this.clients.set(countryCode, client);
            this.paymentClients.set(countryCode, new mercadopago_1.Payment(client));
            this.preferenceClients.set(countryCode, new mercadopago_1.Preference(client));
            this.logger.log(`Mercado Pago client initialized for ${country}`);
        });
    }
    getPaymentClient(country) {
        const client = this.paymentClients.get(country);
        if (!client) {
            throw new common_1.BadRequestException(`Payment client not configured for country: ${country}`);
        }
        return client;
    }
    getPreferenceClient(country) {
        const client = this.preferenceClients.get(country);
        if (!client) {
            throw new common_1.BadRequestException(`Preference client not configured for country: ${country}`);
        }
        return client;
    }
    async createPaymentPreference(bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                client: true,
                provider: true,
                pets: {
                    include: {
                        pet: true,
                    },
                },
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        const country = (booking.client.country || 'AR');
        const config = payments_config_1.PAYMENT_CONFIG[country];
        const preferenceClient = this.getPreferenceClient(country);
        const platformCommission = booking.totalPrice * (config.platformCommissionPercent / 100);
        const providerAmount = booking.totalPrice - platformCommission;
        this.logger.log(`Creating payment preference for booking ${bookingId}`);
        this.logger.log(`Total: ${booking.totalPrice} ${config.currency}`);
        this.logger.log(`Platform commission: ${platformCommission} ${config.currency}`);
        this.logger.log(`Provider amount: ${providerAmount} ${config.currency}`);
        try {
            const preference = await preferenceClient.create({
                body: {
                    items: [
                        {
                            id: booking.id,
                            title: `Servicio de ${booking.serviceType}`,
                            description: `Reserva con ${booking.provider.firstName} ${booking.provider.lastName}`,
                            quantity: 1,
                            unit_price: booking.totalPrice,
                            currency_id: config.currency,
                        },
                    ],
                    payer: {
                        email: booking.client.email,
                        name: booking.client.firstName,
                        surname: booking.client.lastName,
                    },
                    back_urls: {
                        success: `${process.env.FRONTEND_URL}/payment/success`,
                        failure: `${process.env.FRONTEND_URL}/payment/failure`,
                        pending: `${process.env.FRONTEND_URL}/payment/pending`,
                    },
                    auto_return: 'approved',
                    external_reference: bookingId,
                    notification_url: `${process.env.BACKEND_URL}/payments/webhook`,
                },
            });
            this.logger.log(`Payment preference created: ${preference.id}`);
            return {
                preferenceId: preference.id,
                initPoint: preference.init_point,
            };
        }
        catch (error) {
            this.logger.error(`Error creating payment preference: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to create payment preference: ${error.message}`);
        }
    }
    async processPayment(createPaymentDto) {
        const { bookingId, paymentMethodId, token, payerEmail } = createPaymentDto;
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                client: true,
                provider: true,
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        const country = (booking.client.country || 'AR');
        const config = payments_config_1.PAYMENT_CONFIG[country];
        const paymentClient = this.getPaymentClient(country);
        const platformCommission = booking.totalPrice * (config.platformCommissionPercent / 100);
        const providerAmount = booking.totalPrice - platformCommission;
        this.logger.log(`Processing payment for booking ${bookingId}`);
        this.logger.log(`Amount: ${booking.totalPrice} ${config.currency}`);
        this.logger.log(`Platform commission: ${platformCommission}`);
        try {
            const payment = await paymentClient.create({
                body: {
                    transaction_amount: booking.totalPrice,
                    token,
                    description: `Servicio de ${booking.serviceType} - Reserva #${booking.id}`,
                    installments: 1,
                    payment_method_id: paymentMethodId,
                    payer: {
                        email: payerEmail,
                    },
                    external_reference: bookingId,
                },
            });
            this.logger.log(`Payment created: ${payment.id} - Status: ${payment.status}`);
            await this.prisma.transaction.create({
                data: {
                    bookingId,
                    type: 'PAYMENT',
                    amount: booking.totalPrice,
                    currency: config.currency,
                    serviceFee: providerAmount,
                    platformCommission,
                    processingFee: 0,
                    paymentProvider: 'mercadopago',
                    externalTransactionId: payment.id.toString(),
                    status: this.mapPaymentStatus(payment.status),
                    description: createPaymentDto.description || `Pago de reserva ${bookingId}`,
                    metadata: {
                        paymentMethodId,
                        country,
                    },
                    completedAt: payment.status === 'approved' ? new Date() : undefined,
                },
            });
            await this.prisma.booking.update({
                where: { id: bookingId },
                data: {
                    paymentStatus: this.mapPaymentStatus(payment.status),
                    paymentMethod: this.mapPaymentMethod(paymentMethodId),
                    paymentTransactionId: payment.id.toString(),
                    ...(payment.status === 'approved' && { status: 'CONFIRMED', confirmedAt: new Date() }),
                },
            });
            return {
                id: payment.id.toString(),
                status: payment.status,
                statusDetail: payment.status_detail,
                transactionAmount: payment.transaction_amount,
                currency: config.currency,
                externalTransactionId: payment.id.toString(),
                platformCommission,
                providerAmount,
                description: payment.description,
                createdAt: new Date(payment.date_created),
            };
        }
        catch (error) {
            this.logger.error(`Error processing payment: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Payment failed: ${error.message}`);
        }
    }
    async getPayment(paymentId, country) {
        const paymentClient = this.getPaymentClient(country);
        try {
            const payment = await paymentClient.get({ id: paymentId });
            return payment;
        }
        catch (error) {
            this.logger.error(`Error fetching payment: ${error.message}`);
            throw new common_1.NotFoundException(`Payment not found: ${paymentId}`);
        }
    }
    async processWebhook(notification) {
        this.logger.log(`Processing webhook: ${JSON.stringify(notification)}`);
        if (notification.type === 'payment') {
            const paymentId = notification.data.id;
            for (const country of ['AR', 'CO']) {
                try {
                    const payment = await this.getPayment(paymentId, country);
                    if (payment) {
                        await this.updateBookingFromPayment(payment);
                        break;
                    }
                }
                catch (error) {
                    continue;
                }
            }
        }
    }
    async updateBookingFromPayment(payment) {
        const bookingId = payment.external_reference;
        if (!bookingId) {
            this.logger.warn(`Payment ${payment.id} has no external reference (bookingId)`);
            return;
        }
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            this.logger.warn(`Booking ${bookingId} not found`);
            return;
        }
        const newStatus = this.mapPaymentStatus(payment.status);
        this.logger.log(`Updating booking ${bookingId} payment status to ${newStatus}`);
        await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                paymentStatus: newStatus,
                ...(payment.status === 'approved' && { status: 'CONFIRMED', confirmedAt: new Date() }),
                ...(payment.status === 'rejected' && { status: 'CANCELLED', cancelledAt: new Date() }),
            },
        });
        await this.prisma.transaction.updateMany({
            where: {
                externalTransactionId: payment.id.toString(),
            },
            data: {
                status: newStatus,
                completedAt: payment.status === 'approved' ? new Date() : undefined,
            },
        });
    }
    mapPaymentStatus(mpStatus) {
        const statusMap = {
            approved: 'COMPLETED',
            pending: 'PENDING',
            in_process: 'PROCESSING',
            rejected: 'FAILED',
            cancelled: 'FAILED',
            refunded: 'REFUNDED',
        };
        return statusMap[mpStatus] || 'PENDING';
    }
    mapPaymentMethod(methodId) {
        if (methodId.includes('credit'))
            return 'CREDIT_CARD';
        if (methodId.includes('debit'))
            return 'DEBIT_CARD';
        return 'MERCADO_PAGO';
    }
    getPublicKey(country) {
        const config = payments_config_1.PAYMENT_CONFIG[country];
        if (!config.publicKey) {
            throw new common_1.BadRequestException(`Public key not configured for country: ${country}`);
        }
        return config.publicKey;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map