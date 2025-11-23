import apiClient from './client'

export interface CreatePaymentPreferenceRequest {
  bookingId: string
}

export interface CreatePaymentPreferenceResponse {
  preferenceId: string
  initPoint: string
}

export interface ProcessPaymentRequest {
  bookingId: string
  paymentMethodId: string
  token?: string
  payerEmail: string
  description?: string
}

export interface PaymentResponse {
  id: string
  status: string
  statusDetail: string
  transactionAmount: number
  currency: string
  externalTransactionId: string
  platformCommission: number
  providerAmount: number
  description?: string
  createdAt: string
}

export interface PublicKeyResponse {
  publicKey: string
  country: string
}

const paymentService = {
  /**
   * Crear preferencia de pago (Checkout Pro)
   */
  createPaymentPreference: async (
    request: CreatePaymentPreferenceRequest,
  ): Promise<CreatePaymentPreferenceResponse> => {
    const response = await apiClient.post<CreatePaymentPreferenceResponse>(
      '/payments/preference',
      request,
    )
    return response.data
  },

  /**
   * Procesar pago directo
   */
  processPayment: async (request: ProcessPaymentRequest): Promise<PaymentResponse> => {
    const response = await apiClient.post<PaymentResponse>('/payments/process', request)
    return response.data
  },

  /**
   * Obtener información de un pago
   */
  getPayment: async (paymentId: string, country: string = 'AR'): Promise<any> => {
    const response = await apiClient.get(`/payments/${paymentId}`, {
      params: { country },
    })
    return response.data
  },

  /**
   * Obtener clave pública de Mercado Pago según país
   */
  getPublicKey: async (country: string = 'AR'): Promise<PublicKeyResponse> => {
    const response = await apiClient.get<PublicKeyResponse>(`/payments/public-key/${country}`)
    return response.data
  },
}

export default paymentService
