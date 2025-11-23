import React, { useMemo } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native'
import { Text } from '../../atoms/Text'
import { styles } from './styles'
import type { CalendarDatePickerProps } from './CalendarDatePicker.types'

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  label,
  selectedDate,
  onSelectDate,
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return {
      daysInMonth,
      startingDayOfWeek,
      year,
      month,
    }
  }, [currentMonth])

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleSelectDate = (day: number) => {
    const newDate = new Date(calendarData.year, calendarData.month, day)
    onSelectDate(newDate)
  }

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === calendarData.month &&
      selectedDate.getFullYear() === calendarData.year
    )
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === calendarData.month &&
      today.getFullYear() === calendarData.year
    )
  }

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Calendar size={16} color="#111827" />
          <Text style={styles.label}>{label}</Text>
        </View>
      )}

      <View style={styles.calendarContainer}>
        {/* Header with month/year navigation */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
            <ChevronLeft size={20} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.monthYear}>
            {MONTH_NAMES[calendarData.month]} {calendarData.year}
          </Text>

          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <ChevronRight size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Day names */}
        <View style={styles.dayNamesContainer}>
          {DAY_NAMES.map((dayName) => (
            <View key={dayName} style={styles.dayNameCell}>
              <Text style={styles.dayNameText}>{dayName}</Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.daysGrid}>
          {/* Empty cells before first day of month */}
          {Array.from({ length: calendarData.startingDayOfWeek }).map((_, index) => (
            <View key={`empty-${index}`} style={styles.dayCell} />
          ))}

          {/* Days of the month */}
          {Array.from({ length: calendarData.daysInMonth }).map((_, index) => {
            const day = index + 1
            const isSelected = isSelectedDate(day)
            const isTodayDate = isToday(day)

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayCell,
                  isTodayDate && styles.todayCell,
                  isSelected && styles.selectedCell,
                ]}
                onPress={() => handleSelectDate(day)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayText,
                    isTodayDate && styles.todayText,
                    isSelected && styles.selectedText,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </View>
  )
}
