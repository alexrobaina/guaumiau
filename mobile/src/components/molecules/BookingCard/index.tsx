import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Text } from '@components/atoms/Text'
import { Avatar } from '@components/atoms/Avatar'
import { MapPin } from 'lucide-react-native'
import { styles } from './styles'
import type { BookingCardProps } from './BookingCard.types'

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pendiente',
    style: styles.statusPending,
    textStyle: styles.statusTextPending,
  },
  CONFIRMED: {
    label: 'Confirmada',
    style: styles.statusConfirmed,
    textStyle: styles.statusTextConfirmed,
  },
  IN_PROGRESS: {
    label: 'En Progreso',
    style: styles.statusInProgress,
    textStyle: styles.statusTextInProgress,
  },
  COMPLETED: {
    label: 'Completada',
    style: styles.statusCompleted,
    textStyle: styles.statusTextCompleted,
  },
  CANCELLED: {
    label: 'Cancelada',
    style: styles.statusCancelled,
    textStyle: styles.statusTextCancelled,
  },
  REJECTED: {
    label: 'Rechazada',
    style: styles.statusRejected,
    textStyle: styles.statusTextRejected,
  },
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  DOG_WALKING: 'Paseo de Perros',
  DOG_RUNNING: 'Running con Perros',
  DOG_SITTING: 'Cuidado de Perros',
  CAT_SITTING: 'Cuidado de Gatos',
  PET_SITTING: 'Cuidado de Mascotas',
  DOG_BOARDING: 'Hospedaje de Perros',
  CAT_BOARDING: 'Hospedaje de Gatos',
  PET_BOARDING: 'Hospedaje de Mascotas',
  DOG_DAYCARE: 'Guardería Canina',
  PET_DAYCARE: 'Guardería de Mascotas',
  HOME_VISITS: 'Visitas a Domicilio',
  PET_TAXI: 'Taxi para Mascotas',
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPress,
  userRole,
}) => {
  const statusConfig = STATUS_CONFIG[booking.status]
  const otherUser = userRole === 'client' ? booking.provider : booking.client

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(booking.id)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.serviceType}>
            {SERVICE_TYPE_LABELS[booking.serviceType] || booking.serviceType}
          </Text>
          <Text style={styles.date}>{formatDate(booking.startDate)}</Text>
        </View>
        <View style={[styles.statusBadge, statusConfig.style]}>
          <Text style={[styles.statusText, statusConfig.textStyle]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Other User Info */}
      {otherUser && (
        <View style={styles.userSection}>
          <Avatar
            source={otherUser.avatar}
            fallbackText={otherUser.firstName}
            size="small"
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userLabel}>
              {userRole === 'client' ? 'Paseador' : 'Cliente'}
            </Text>
            <Text style={styles.userName}>
              {otherUser.firstName} {otherUser.lastName}
            </Text>
          </View>
        </View>
      )}

      {/* Pets */}
      {booking.pets && booking.pets.length > 0 && (
        <View style={styles.petsSection}>
          <Text style={styles.petsLabel}>Mascotas:</Text>
          <View style={styles.petsContainer}>
            {booking.pets.map((pet) => (
              <View key={pet.id} style={styles.petTag}>
                <Text style={styles.petName}>{pet.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Location */}
      {booking.pickupAddress && (
        <View style={styles.locationSection}>
          <MapPin size={16} color="#6B7280" style={styles.locationIcon} />
          <Text style={styles.locationText} numberOfLines={1}>
            {booking.pickupAddress}
          </Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.price}>
          ${booking.totalPrice.toFixed(2)} {booking.currency}
        </Text>
        <View style={styles.viewButton}>
          <Text style={styles.viewButtonText}>Ver Detalles</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
