import React, { useState } from 'react'
import { ScrollView, View, Alert, Linking } from 'react-native'
import { Card } from '@components/atoms/Card'
import { Button } from '@components/atoms/Button'
import { Spinner } from '@components/atoms/Spinner'
import { Text } from '@components/atoms/Text'
import { PaymentMethodSelector } from '@components/molecules/PaymentMethodSelector'
import { PriceBreakdown } from '@components/organisms/PriceBreakdown'
import { useCreatePaymentPreference } from '@/hooks/payment/usePayment'
import { useAuth } from '@/contexts/AuthContext'
import { styles } from './styles'
import type { PaymentScreenProps } from './PaymentScreen.types'

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ route, navigation }) => {
  const { booking } = route.params
  const { user } = useAuth()

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mercadopago')

  const { mutate: createPaymentPreference, isPending } = useCreatePaymentPreference({
    onSuccess: async data => {
      Alert.alert(
        'Redirigiendo a Mercado Pago',
        '¿Deseas continuar con el pago?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Continuar',
            onPress: async () => {
              // Abrir Mercado Pago en el navegador/webview
              const supported = await Linking.canOpenURL(data.initPoint)
              if (supported) {
                await Linking.openURL(data.initPoint)

                // Navegar a una pantalla de "pendiente" o volver
                navigation.navigate('Profile')
              } else {
                Alert.alert('Error', 'No se puede abrir Mercado Pago', [{ text: 'OK' }])
              }
            },
          },
        ],
        { cancelable: false },
      )
    },
    onError: (error: any) => {
      Alert.alert(
        'Error al procesar el pago',
        error?.response?.data?.message || 'No se pudo iniciar el proceso de pago',
        [{ text: 'OK' }],
      )
    },
  })

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Por favor selecciona un método de pago', [{ text: 'OK' }])
      return
    }

    // Crear preferencia de pago con Mercado Pago
    createPaymentPreference({
      bookingId: booking.id,
    })
  }

  const platformCommissionPercent = 15
  const serviceCost = booking.basePrice || 0
  const commission = serviceCost * (platformCommissionPercent / 100)
  const total = serviceCost + commission

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <Card style={styles.section}>
        <Text style={styles.title}>Completar Pago</Text>
        <Text style={styles.subtitle}>
          Reserva con {booking.provider?.firstName} {booking.provider?.lastName}
        </Text>
      </Card>

      {/* Price Breakdown */}
      <View style={styles.section}>
        <PriceBreakdown
          serviceName={booking.serviceType || 'Servicio'}
          servicePrice={serviceCost}
          platformCommissionPercent={platformCommissionPercent}
        />
      </View>

      {/* Payment Method Selector */}
      <Card style={styles.section}>
        <PaymentMethodSelector
          label="Seleccionar Método de Pago"
          selectedMethodId={selectedPaymentMethod}
          onMethodSelect={setSelectedPaymentMethod}
        />
      </Card>

      {/* Payment Info */}
      <Card style={styles.section}>
        <Text style={styles.infoTitle}>Información Importante</Text>
        <Text style={styles.infoText}>
          • El pago se procesará de forma segura a través de Mercado Pago
        </Text>
        <Text style={styles.infoText}>
          • El paseador recibirá ${serviceCost.toFixed(2)} por el servicio
        </Text>
        <Text style={styles.infoText}>
          • La comisión de ${commission.toFixed(2)} cubre costos operativos de la plataforma
        </Text>
        <Text style={styles.infoText}>
          • Tu reserva se confirmará automáticamente al completar el pago
        </Text>
      </Card>

      {/* Pay Button */}
      <Button
        title={`Pagar $${total.toFixed(2)}`}
        onPress={handlePayment}
        loading={isPending}
        style={styles.payButton}
      />

      {/* Cancel Button */}
      <Button
        title="Cancelar"
        onPress={() => navigation.goBack()}
        variant="outline"
        style={styles.cancelButton}
      />
    </ScrollView>
  )
}
