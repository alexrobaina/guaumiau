import React from 'react'
import { View } from 'react-native'
import { Text } from '../../atoms/Text'
import { styles } from './styles'
import type { PriceBreakdownProps } from './PriceBreakdown.types'

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  serviceName,
  servicePrice,
  bookingFee,
  platformCommissionPercent = 15,
  numberOfPets,
  pricePerPet,
  pets,
}) => {
  // Calculate commission based on percentage or use legacy bookingFee
  const commission = bookingFee !== undefined
    ? bookingFee
    : servicePrice * (platformCommissionPercent / 100)

  const providerAmount = servicePrice
  const total = servicePrice + commission

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Desglose de Precios</Text>

      <View style={styles.itemsContainer}>
        {/* Show individual pets if pets array is provided */}
        {pets && pets.length > 0 && pricePerPet ? (
          <>
            {pets.map((pet) => (
              <View key={pet.id} style={styles.row}>
                <Text style={styles.itemLabel} numberOfLines={1}>
                  {serviceName} - {pet.name}
                </Text>
                <Text style={styles.itemValue}>${pricePerPet.toFixed(2)}</Text>
              </View>
            ))}
          </>
        ) : numberOfPets && numberOfPets > 1 && pricePerPet ? (
          /* Fallback: Show summary if pets array not provided but multiple pets */
          <View style={styles.row}>
            <Text style={styles.itemLabel} numberOfLines={1}>
              {serviceName} (${pricePerPet.toFixed(2)} × {numberOfPets} mascota{numberOfPets > 1 ? 's' : ''})
            </Text>
            <Text style={styles.itemValue}>${providerAmount.toFixed(2)}</Text>
          </View>
        ) : (
          /* Single pet or no pet info */
          <View style={styles.row}>
            <Text style={styles.itemLabel} numberOfLines={1}>{serviceName}</Text>
            <Text style={styles.itemValue}>${providerAmount.toFixed(2)}</Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.itemLabel} numberOfLines={1}>Comisión de Servicio ({platformCommissionPercent}%)</Text>
          <Text style={styles.itemValue}>${commission.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total a Pagar</Text>
        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
      </View>
    </View>
  )
}
