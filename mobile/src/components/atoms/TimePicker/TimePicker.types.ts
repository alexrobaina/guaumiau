export interface TimePickerProps {
  label?: string
  value: string // Format: "HH:MM" (e.g., "14:30")
  onChange: (time: string) => void
  placeholder?: string
}
