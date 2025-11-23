import React, { useState } from 'react'
import { View, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import { Text } from '@components/atoms/Text'
import { Spinner } from '@components/atoms/Spinner'
import { BookingCard } from '@components/molecules/BookingCard'
import { Calendar, AlertCircle } from 'lucide-react-native'
import { styles } from './styles'
import type { MyBookingsScreenProps } from './MyBookingsScreen.types'
import { useBookings } from '@/hooks/api/useBookings'
import { useAuth } from '@/contexts/AuthContext'

type TabType = 'asClient' | 'asProvider'

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('asClient')
  const { user } = useAuth()

  const { data: bookings, isLoading, isError, refetch } = useBookings()

  const handleBookingPress = (bookingId: string) => {
    navigation.navigate('BookingDetail', { bookingId })
  }

  const handleRetry = () => {
    refetch()
  }

  // Filter bookings based on active tab and user role
  const filteredBookings = React.useMemo(() => {
    if (!bookings || !user) return []

    if (activeTab === 'asClient') {
      // Show bookings where current user is the client
      return bookings.filter((booking) => booking.client?.id === user.id)
    } else {
      // Show bookings where current user is the provider
      return bookings.filter((booking) => booking.provider?.id === user.id)
    }
  }, [bookings, activeTab, user])

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" />
      </View>
    )
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color="#DC2626" style={{ marginBottom: 16 }} />
          <Text style={styles.errorText}>
            No se pudieron cargar las reservas. Por favor, intenta nuevamente.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Calendar size={64} color="#D1D5DB" style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>
        {activeTab === 'asClient' ? 'No tienes reservas' : 'No tienes solicitudes'}
      </Text>
      <Text style={styles.emptyText}>
        {activeTab === 'asClient'
          ? 'Encuentra un paseador y reserva tu primer servicio'
          : 'Aún no has recibido solicitudes de servicio'}
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'asClient' && styles.activeTab]}
          onPress={() => setActiveTab('asClient')}
        >
          <Text style={[styles.tabText, activeTab === 'asClient' && styles.activeTabText]}>
            Mis Reservas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'asProvider' && styles.activeTab]}
          onPress={() => setActiveTab('asProvider')}
        >
          <Text style={[styles.tabText, activeTab === 'asProvider' && styles.activeTabText]}>
            Mis Servicios
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={handleBookingPress}
            userRole={activeTab === 'asClient' ? 'client' : 'provider'}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.contentContainer,
          filteredBookings.length === 0 && { flex: 1 },
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#F97316"
            colors={['#F97316']}
          />
        }
      />
    </View>
  )
}
