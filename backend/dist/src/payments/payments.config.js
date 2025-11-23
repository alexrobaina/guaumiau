"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_CONFIG = void 0;
exports.PAYMENT_CONFIG = {
    AR: {
        currency: 'ARS',
        platformCommissionPercent: 15,
        accessToken: process.env.MERCADOPAGO_AR_ACCESS_TOKEN || '',
        publicKey: process.env.MERCADOPAGO_AR_PUBLIC_KEY || '',
    },
    CO: {
        currency: 'COP',
        platformCommissionPercent: 15,
        accessToken: process.env.MERCADOPAGO_CO_ACCESS_TOKEN || '',
        publicKey: process.env.MERCADOPAGO_CO_PUBLIC_KEY || '',
    },
};
//# sourceMappingURL=payments.config.js.map