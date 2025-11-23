import React, { useState } from 'react'
import { View, TouchableOpacity, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Text } from '@components/atoms/Text'
import { Clock } from 'lucide-react-native'
import { styles } from './styles'
import type { TimePickerProps } from './TimePicker.types'

export const TimePicker: React.FC<TimePickerProps> = ({
  label = 'Hora',
  value,
  onChange,
  placeholder = 'Selecciona una hora',
}) => {
  const [showPicker, setShowPicker] = useState(false)

  // Convert "HH:MM" string to Date object
  const getDateFromTime = (timeString: string): Date => {
    if (!timeString) {
      return new Date()
    }
    const [hours, minutes] = timeString.split(':').map(Number)
    const date = new Date()
    date.setHours(hours || 0)
    date.setMinutes(minutes || 0)
    return date
  }

  // Convert Date object to "HH:MM" string
  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  // Format time for display (12-hour format with AM/PM)
  const formatDisplayTime = (timeString: string): string => {
    if (!timeString) return placeholder

    const [hours, minutes] = timeString.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false)
    }

    if (selectedDate) {
      const timeString = formatTime(selectedDate)
      onChange(timeString)
    }
  }

  const handlePress = () => {
    setShowPicker(true)
  }

  const handleDismiss = () => {
    setShowPicker(false)
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity style={styles.inputContainer} onPress={handlePress} activeOpacity={0.7}>
        <Clock size={20} color="#666" style={styles.icon} />
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {value ? formatDisplayTime(value) : placeholder}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <>
          {Platform.OS === 'ios' && (
            <View style={styles.iosPickerContainer}>
              <View style={styles.iosPickerHeader}>
                <TouchableOpacity onPress={handleDismiss}>
                  <Text style={styles.iosPickerButton}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDismiss}>
                  <Text style={[styles.iosPickerButton, styles.iosPickerButtonDone]}>Listo</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={getDateFromTime(value)}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                locale="es-ES"
              />
            </View>
          )}

          {Platform.OS === 'android' && (
            <DateTimePicker
              value={getDateFromTime(value)}
              mode="time"
              display="default"
              onChange={handleTimeChange}
              is24Hour={false}
            />
          )}
        </>
      )}
    </View>
  )
}
