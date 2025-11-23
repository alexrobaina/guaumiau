export declare class PaymentResponseDto {
    id: string;
    status: string;
    statusDetail: string;
    transactionAmount: number;
    currency: string;
    externalTransactionId: string;
    platformCommission: number;
    providerAmount: number;
    description?: string;
    createdAt: Date;
}
