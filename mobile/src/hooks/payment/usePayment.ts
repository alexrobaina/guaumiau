import { useMutation, useQuery } from '@tanstack/react-query'
import paymentService, {
  CreatePaymentPreferenceRequest,
  ProcessPaymentRequest,
} from '@/services/api/payment.service'

/**
 * Hook para crear preferencia de pago (Checkout Pro)
 */
export const useCreatePaymentPreference = (options?: {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}) => {
  return useMutation({
    mutationFn: (request: CreatePaymentPreferenceRequest) =>
      paymentService.createPaymentPreference(request),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}

/**
 * Hook para procesar un pago directo
 */
export const useProcessPayment = (options?: {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}) => {
  return useMutation({
    mutationFn: (request: ProcessPaymentRequest) => paymentService.processPayment(request),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}

/**
 * Hook para obtener información de un pago
 */
export const usePayment = (paymentId?: string, country: string = 'AR') => {
  return useQuery({
    queryKey: ['payment', paymentId, country],
    queryFn: () => paymentService.getPayment(paymentId!, country),
    enabled: !!paymentId,
  })
}

/**
 * Hook para obtener la clave pública de Mercado Pago
 */
export const usePublicKey = (country: string = 'AR') => {
  return useQuery({
    queryKey: ['payment-public-key', country],
    queryFn: () => paymentService.getPublicKey(country),
  })
}
