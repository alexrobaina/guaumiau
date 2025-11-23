export declare const PAYMENT_CONFIG: {
    AR: {
        currency: string;
        platformCommissionPercent: number;
        accessToken: string;
        publicKey: string;
    };
    CO: {
        currency: string;
        platformCommissionPercent: number;
        accessToken: string;
        publicKey: string;
    };
};
export type CountryCode = keyof typeof PAYMENT_CONFIG;
