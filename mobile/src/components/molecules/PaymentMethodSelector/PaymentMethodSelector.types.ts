export interface PaymentMethod {
  id: string
  name: string
  icon: string
  type: 'credit_card' | 'debit_card' | 'mercadopago' | 'cash'
}

export interface PaymentMethodSelectorProps {
  label?: string
  selectedMethodId?: string
  onMethodSelect: (methodId: string) => void
  methods?: PaymentMethod[]
}
