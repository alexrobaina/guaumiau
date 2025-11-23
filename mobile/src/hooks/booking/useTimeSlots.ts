import { useQuery } from '@tanstack/react-query'
import { bookingService } from '@services/api/booking.service'

export const useTimeSlots = (date?: Date, providerId?: string) => {
  return useQuery({
    queryKey: ['timeSlots', date?.toISOString(), providerId],
    queryFn: () => {
      if (!date || !providerId) {
        // Return default time slots if no date/provider provided
        return [
          '8:00 AM',
          '9:00 AM',
          '10:00 AM',
          '11:00 AM',
          '12:00 PM',
          '1:00 PM',
          '2:00 PM',
          '3:00 PM',
          '4:00 PM',
          '5:00 PM',
          '6:00 PM',
          '7:00 PM',
        ]
      }
      return bookingService.getTimeSlots(date, providerId)
    },
  })
}
