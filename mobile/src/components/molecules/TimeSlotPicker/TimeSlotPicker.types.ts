export interface TimeSlotPickerProps {
  label?: string
  timeSlots: string[]
  selectedTime: string
  onSelectTime: (time: string) => void
}
