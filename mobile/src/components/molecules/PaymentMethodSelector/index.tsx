import React from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import { Text } from '@components/atoms/Text'
import { CreditCard, Smartphone, Wallet, DollarSign } from 'lucide-react-native'
import { styles } from './styles'
import type { PaymentMethodSelectorProps, PaymentMethod } from './PaymentMethodSelector.types'

const DEFAULT_METHODS: PaymentMethod[] = [
  {
    id: 'credit_card',
    name: 'Tarjeta de Crédito',
    icon: 'credit_card',
    type: 'credit_card',
  },
  {
    id: 'debit_card',
    name: 'Tarjeta de Débito',
    icon: 'debit_card',
    type: 'debit_card',
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    icon: 'mercadopago',
    type: 'mercadopago',
  },
]

const getIcon = (iconName: string, color: string) => {
  const iconProps = { size: 24, color }

  switch (iconName) {
    case 'credit_card':
    case 'debit_card':
      return <CreditCard {...iconProps} />
    case 'mercadopago':
      return <Smartphone {...iconProps} />
    case 'cash':
      return <DollarSign {...iconProps} />
    default:
      return <Wallet {...iconProps} />
  }
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  label = 'Método de Pago',
  selectedMethodId,
  onMethodSelect,
  methods = DEFAULT_METHODS,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {methods.map(method => {
          const isSelected = selectedMethodId === method.id

          return (
            <TouchableOpacity
              key={method.id}
              style={[styles.methodCard, isSelected && styles.methodCardSelected]}
              onPress={() => onMethodSelect(method.id)}
              activeOpacity={0.7}>
              <View style={styles.iconContainer}>
                {getIcon(method.icon, isSelected ? '#007AFF' : '#666')}
              </View>
              <Text style={[styles.methodName, isSelected && styles.methodNameSelected]}>
                {method.name}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}
