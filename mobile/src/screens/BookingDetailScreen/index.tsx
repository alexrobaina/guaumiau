import React from 'react'
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { Text } from '@components/atoms/Text'
import { Spinner } from '@components/atoms/Spinner'
import { Avatar } from '@components/atoms/Avatar'
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Dog,
  Cat,
  FileText,
  AlertCircle,
} from 'lucide-react-native'
import { styles } from './styles'
import type { BookingDetailScreenProps } from './BookingDetailScreen.types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingService } from '@/services/api/booking.service'
import { useAuth } from '@/contexts/AuthContext'

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

export const BookingDetailScreen: React.FC<BookingDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { bookingId } = route.params
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch booking details
  const {
    data: booking,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingService.getBooking(bookingId),
  })

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: () => bookingService.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      Alert.alert('Éxito', 'La reserva ha sido cancelada.')
    },
    onError: () => {
      Alert.alert('Error', 'No se pudo cancelar la reserva.')
    },
  })

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro de que deseas cancelar esta reserva?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => cancelMutation.mutate(),
        },
      ],
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPetIcon = (petType: string) => {
    switch (petType.toUpperCase()) {
      case 'DOG':
        return <Dog size={16} color="#6B7280" style={styles.petIcon} />
      case 'CAT':
        return <Cat size={16} color="#6B7280" style={styles.petIcon} />
      default:
        return <Dog size={16} color="#6B7280" style={styles.petIcon} />
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" />
      </View>
    )
  }

  // Error state
  if (isError || !booking) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color="#DC2626" style={{ marginBottom: 16 }} />
          <Text style={styles.errorText}>
            No se pudo cargar la información de la reserva.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const statusConfig = STATUS_CONFIG[booking.status]
  const isUserClient = booking.client?.id === user?.id
  const otherUser = isUserClient ? booking.provider : booking.client
  const canCancel =
    (booking.status === 'PENDING' || booking.status === 'CONFIRMED') &&
    !cancelMutation.isPending

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={[styles.statusBadge, statusConfig.style]}>
            <Text style={[styles.statusText, statusConfig.textStyle]}>
              {statusConfig.label}
            </Text>
          </View>

          <Text style={styles.serviceTitle}>
            {SERVICE_TYPE_LABELS[booking.serviceType] || booking.serviceType}
          </Text>

          <Text style={styles.bookingId}>ID: {booking.id.slice(0, 8).toUpperCase()}</Text>

          <View style={styles.dateTimeRow}>
            <Calendar size={20} color="#6B7280" style={styles.dateTimeIcon} />
            <Text style={styles.dateTimeText}>{formatDate(booking.startDate)}</Text>
          </View>

          <View style={styles.dateTimeRow}>
            <Clock size={20} color="#6B7280" style={styles.dateTimeIcon} />
            <Text style={styles.dateTimeText}>
              {formatTime(booking.startDate)} - {formatTime(booking.endDate)}
            </Text>
          </View>
        </View>

        {/* User Info Card */}
        {otherUser && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              {isUserClient ? 'Paseador' : 'Cliente'}
            </Text>
            <View style={styles.userRow}>
              <Avatar
                source={otherUser.avatar}
                fallbackText={otherUser.firstName}
                size="medium"
                style={styles.userAvatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {otherUser.firstName} {otherUser.lastName}
                </Text>
                <Text style={styles.userRole}>{otherUser.email}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Pets Card */}
        {booking.pets && booking.pets.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Mascotas ({booking.pets.length})</Text>
            <View style={styles.petsGrid}>
              {booking.pets.map((bookingPet: any) => (
                <View key={bookingPet.pet.id} style={styles.petItem}>
                  {getPetIcon(bookingPet.pet.type)}
                  <Text style={styles.petName}>{bookingPet.pet.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Location Card */}
        {booking.pickupAddress && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Ubicación</Text>
            <View style={styles.locationRow}>
              <MapPin size={20} color="#6B7280" style={styles.locationIcon} />
              <Text style={styles.locationText}>{booking.pickupAddress}</Text>
            </View>
          </View>
        )}

        {/* Instructions Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Instrucciones</Text>
          {booking.specialInstructions ? (
            <Text style={styles.instructionsText}>{booking.specialInstructions}</Text>
          ) : (
            <Text style={styles.noInstructions}>Sin instrucciones especiales</Text>
          )}
        </View>

        {/* Price Breakdown Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Desglose de Precios</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Servicio</Text>
            <Text style={styles.priceValue}>
              ${booking.basePrice.toFixed(2)} {booking.currency}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Comisión de Servicio (15%)</Text>
            <Text style={styles.priceValue}>
              ${booking.platformCommission.toFixed(2)} {booking.currency}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ${booking.totalPrice.toFixed(2)} {booking.currency}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {canCancel && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={handleCancelBooking}
            disabled={cancelMutation.isPending}
          >
            <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
              {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar Reserva'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
