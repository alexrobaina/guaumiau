import React from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import { Clock } from 'lucide-react-native'
import { Text } from '../../atoms/Text'
import { styles } from './styles'
import type { TimeSlotPickerProps } from './TimeSlotPicker.types'

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  label,
  timeSlots,
  selectedTime,
  onSelectTime,
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Clock size={16} color="#111827" />
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.timeSlotsContainer}>
          {timeSlots.map((time) => {
            const isSelected = time === selectedTime
            return (
              <TouchableOpacity
                key={time}
                style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
                onPress={() => onSelectTime(time)}
                activeOpacity={0.7}
              >
                <Text style={[styles.timeSlotText, isSelected && styles.timeSlotTextSelected]}>
                  {time}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}
