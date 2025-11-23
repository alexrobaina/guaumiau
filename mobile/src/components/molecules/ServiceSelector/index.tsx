import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text } from '../../atoms/Text'
import { styles } from './styles'
import type { ServiceSelectorProps } from './ServiceSelector.types'

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  label,
  services,
  selectedServiceId,
  onServiceChange,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.servicesContainer}>
        {services.map((service) => {
          const isSelected = service.id === selectedServiceId
          return (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
              onPress={() => onServiceChange(service.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.serviceName, isSelected && styles.serviceNameSelected]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {service.name}
              </Text>
              <Text style={[styles.servicePrice, isSelected && styles.servicePriceSelected]}>
                ${service.price}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
