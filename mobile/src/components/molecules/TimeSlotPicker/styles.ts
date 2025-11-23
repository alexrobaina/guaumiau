import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  scrollContent: {
    paddingRight: 16,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  timeSlotSelected: {
    borderColor: '#F97316',
    backgroundColor: '#F97316',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
})
