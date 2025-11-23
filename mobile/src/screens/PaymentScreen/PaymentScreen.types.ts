import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '@/navigation/types'

export type PaymentScreenProps = NativeStackScreenProps<RootStackParamList, 'Payment'>

export interface PaymentFormData {
  paymentMethodId: string
  cardToken?: string
  payerEmail: string
}
