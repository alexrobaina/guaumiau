export const PAYMENT_CONFIG = {
  AR: {
    currency: 'ARS',
    platformCommissionPercent: 15, // Tu comisión (15%)
    accessToken: process.env.MERCADOPAGO_AR_ACCESS_TOKEN || '',
    publicKey: process.env.MERCADOPAGO_AR_PUBLIC_KEY || '',
  },
  CO: {
    currency: 'COP',
    platformCommissionPercent: 15, // Tu comisión (15%)
    accessToken: process.env.MERCADOPAGO_CO_ACCESS_TOKEN || '',
    publicKey: process.env.MERCADOPAGO_CO_PUBLIC_KEY || '',
  },
}

export type CountryCode = keyof typeof PAYMENT_CONFIG
