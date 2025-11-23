import React, { useState } from 'react'
import { ScrollView, View, Alert, Platform, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Text } from '@components/atoms/Text'
import { Card } from '@components/atoms/Card'
import { Button } from '@components/atoms/Button'
import { Textarea } from '@components/atoms/Textarea'
import { Spinner } from '@components/atoms/Spinner'
import { TimePicker } from '@components/atoms/TimePicker'
import { ServiceSelector } from '@components/molecules/ServiceSelector'
import { PetSelector } from '@components/molecules/PetSelector'
import { GooglePlacesInput } from '@components/atoms/GooglePlacesInput'
import { PriceBreakdown } from '@components/organisms/PriceBreakdown'
import { Calendar } from 'lucide-react-native'
import { useBooking } from '@/hooks/booking/useBooking'
import { useProvider } from '@/hooks/api/useProvider'
import { usePets } from '@/hooks/api/usePets'
import { useServices } from '@/hooks/booking/useServices'
import { styles } from './styles'
import type { BookingScreenProps } from './BookingScreen.types'

export const BookingScreen: React.FC<BookingScreenProps> = ({ route, navigation }) => {
  const { providerId } = route.params

  // Fetch data
  const { data: provider, isLoading: isLoadingProvider } = useProvider(providerId)
  const { data: pets, isLoading: isLoadingPets } = usePets()
  const { data: services, isLoading: isLoadingServices } = useServices(providerId)

  // Form state
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedTime, setSelectedTime] = useState('')
  const [location, setLocation] = useState('')
  const [instructions, setInstructions] = useState('')

  // Booking mutation
  const { mutate: createBooking, isPending: isCreatingBooking } = useBooking({
    onSuccess: () => {
      Alert.alert('Reserva Confirmada', 'Tu reserva ha sido creada exitosamente.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Profile'),
        },
      ])
    },
    onError: (error: any) => {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'No se pudo crear la reserva.',
        [{ text: 'OK' }],
      )
    },
  })

  // Set initial values when data loads
  React.useEffect(() => {
    if (services && services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id)
    }
  }, [services, selectedServiceId])

  React.useEffect(() => {
    if (pets && pets.length > 0 && selectedPetIds.length === 0) {
      setSelectedPetIds([pets[0].id])
    }
  }, [pets, selectedPetIds])

  const handleTogglePet = (petId: string) => {
    setSelectedPetIds(prev =>
      prev.includes(petId) ? prev.filter(id => id !== petId) : [...prev, petId],
    )
  }

  const handleSelectPlace = (place: { address: string }) => {
    setLocation(place.address)
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }
    if (date) {
      setSelectedDate(date)
    }
  }

  const handleConfirmBooking = () => {
    // Validation
    if (!selectedServiceId) {
      Alert.alert('Error', 'Por favor selecciona un servicio.', [{ text: 'OK' }])
      return
    }

    if (selectedPetIds.length === 0) {
      Alert.alert('Error', 'Por favor selecciona al menos una mascota.', [{ text: 'OK' }])
      return
    }

    if (!selectedTime) {
      Alert.alert('Error', 'Por favor selecciona una hora.', [{ text: 'OK' }])
      return
    }

    if (!location) {
      Alert.alert('Error', 'Por favor ingresa una ubicación.', [{ text: 'OK' }])
      return
    }

    const selectedService = services?.find(s => s.id === selectedServiceId)
    if (!selectedService || !provider?.user?.id) {
      Alert.alert('Error', 'Información incompleta.', [{ text: 'OK' }])
      return
    }

    createBooking({
      providerId: provider.user.id,
      serviceType: selectedService.serviceType as any,
      petIds: selectedPetIds,
      date: selectedDate,
      time: selectedTime,
      location,
      instructions,
    })
  }

  const selectedService = services?.find(s => s.id === selectedServiceId)
  const numberOfPets = selectedPetIds.length
  const serviceCost = (selectedService?.basePrice || 0) * numberOfPets
  const platformCommissionPercent = 15
  const isLoading = isLoadingProvider || isLoadingPets || isLoadingServices

  // Get selected pets info for price breakdown
  const selectedPets = pets?.filter(pet => selectedPetIds.includes(pet.id)).map(pet => ({
    id: pet.id,
    name: pet.name,
  })) || []

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Provider Header */}
      {provider && (
        <Card style={styles.section}>
          <Text style={styles.providerName}>
            {provider.user.firstName} {provider.user.lastName}
          </Text>
          <Text style={styles.providerInfo}>
            ⭐ {provider.averageRating?.toFixed(1) || '5.0'} · {provider.totalReviews || 0} reseñas
          </Text>
        </Card>
      )}

      {/* Service Selection */}
      {services && services.length > 0 && (
        <Card style={styles.section}>
          <ServiceSelector
            label="Servicio"
            services={services.map(s => ({
              id: s.id,
              name: s.description || s.serviceType,
              price: s.basePrice,
            }))}
            selectedServiceId={selectedServiceId}
            onServiceChange={setSelectedServiceId}
          />
        </Card>
      )}

      {/* Pet Selection */}
      {pets && pets.length > 0 && (
        <Card style={styles.section}>
          <PetSelector
            label="Mascotas"
            pets={pets.map(p => ({
              id: p.id,
              name: p.name,
              image: p.photos?.[0],
            }))}
            selectedPetIds={selectedPetIds}
            onTogglePet={handleTogglePet}
          />
        </Card>
      )}

      {/* Date Picker */}
      <Card style={styles.section}>
        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}>
          <Calendar size={20} color="#666" style={{ marginRight: 12 }} />
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <>
            {Platform.OS === 'ios' && (
              <View style={styles.iosPickerContainer}>
                <View style={styles.iosPickerHeader}>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.iosPickerButton}>Listo</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  locale="es-ES"
                  minimumDate={new Date()}
                />
              </View>
            )}

            {Platform.OS === 'android' && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </>
        )}
      </Card>

      {/* Time Picker */}
      <Card style={styles.section}>
        <TimePicker
          label="Hora"
          value={selectedTime}
          onChange={setSelectedTime}
          placeholder="Selecciona una hora"
        />
      </Card>

      {/* Location */}
      <Card style={styles.section}>
        <Text style={styles.label}>Dirección</Text>
        <GooglePlacesInput
          placeholder="Ingresa la dirección"
          value={location}
          onChangeText={setLocation}
          onPlaceSelected={(data) => handleSelectPlace({ address: data.description })}
        />
      </Card>

      {/* Instructions */}
      <Card style={styles.section}>
        <Textarea
          label="Notas (Opcional)"
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Instrucciones especiales..."
          numberOfLines={3}
        />
      </Card>

      {/* Price Breakdown */}
      {selectedService && (
        <View style={styles.section}>
          <PriceBreakdown
            serviceName={selectedService.description || 'Servicio'}
            servicePrice={serviceCost}
            platformCommissionPercent={platformCommissionPercent}
            numberOfPets={numberOfPets}
            pricePerPet={selectedService.basePrice}
            pets={selectedPets}
          />
        </View>
      )}

      {/* Confirm Button */}
      <Button
        title="Confirmar Reserva"
        onPress={handleConfirmBooking}
        loading={isCreatingBooking}
        style={styles.confirmButton}
      />
    </ScrollView>
  )
}
