import { useMutation, useQuery, useQueryClient, type UseMutationOptions } from '@tanstack/react-query'
import { bookingService } from '@services/api/booking.service'
import type { BookingRequest, Booking } from '@/types/booking.types'

type UseBookingOptions = Omit<
  UseMutationOptions<Booking, Error, BookingRequest>,
  'mutationFn'
>

export const useBooking = (options?: UseBookingOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookingData: BookingRequest) => bookingService.createBooking(bookingData),
    ...options,
    onSuccess: async (data, variables, context) => {
      // Invalidate bookings cache to refetch updated list
      await queryClient.invalidateQueries({ queryKey: ['bookings'] })
      // Call user-provided onSuccess if exists
      if (options?.onSuccess) {
        await options.onSuccess(data, variables, context)
      }
    },
  })
}

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingService.getBookings(),
  })
}

export const useBookingDetails = (bookingId: string) => {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingService.getBooking(bookingId),
    enabled: !!bookingId,
  })
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookingId: string) => bookingService.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}
