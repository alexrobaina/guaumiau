import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { CountryCode } from './payments.config';
export declare class PaymentsService {
    private readonly prisma;
    private readonly logger;
    private clients;
    private paymentClients;
    private preferenceClients;
    constructor(prisma: PrismaService);
    private initializeClients;
    private getPaymentClient;
    private getPreferenceClient;
    createPaymentPreference(bookingId: string): Promise<{
        preferenceId: string;
        initPoint: string;
    }>;
    processPayment(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto>;
    getPayment(paymentId: string, country: CountryCode): Promise<any>;
    processWebhook(notification: any): Promise<void>;
    private updateBookingFromPayment;
    private mapPaymentStatus;
    private mapPaymentMethod;
    getPublicKey(country: CountryCode): string;
}
