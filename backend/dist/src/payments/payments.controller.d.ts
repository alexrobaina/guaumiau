import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { WebhookNotificationDto } from './dto/webhook-notification.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly logger;
    constructor(paymentsService: PaymentsService);
    createPaymentPreference(body: {
        bookingId: string;
    }): Promise<{
        preferenceId: string;
        initPoint: string;
    }>;
    processPayment(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto>;
    getPublicKey(country: string): Promise<{
        publicKey: string;
        country: string;
    }>;
    getPayment(paymentId: string, country?: string): Promise<any>;
    handleWebhook(notification: WebhookNotificationDto, request: any): Promise<{
        status: string;
        message?: undefined;
    } | {
        status: string;
        message: any;
    }>;
}
