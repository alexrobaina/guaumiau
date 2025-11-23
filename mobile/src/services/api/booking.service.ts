import apiClient from './client'
import type { BookingRequest, Booking, Service, Pet, Provider } from '@/types/booking.types'
import type { UserBooking } from '@/types/booking.api.types'

export const bookingService = {
  // Get provider by ID (legacy name: getWalker)
  getWalker: async (walkerId: string): Promise<Provider> => {
    const response = await apiClient.get<Provider>(`/providers/${walkerId}`)
    return response.data
  },

  // Get user's pets
  getPets: async (): Promise<Pet[]> => {
    const response = await apiClient.get<Pet[]>('/pets')
    return response.data
  },

  // Get available services
  getServices: async (): Promise<Service[]> => {
    const response = await apiClient.get<Service[]>('/services')
    return response.data
  },

  // Get services by provider
  getProviderServices: async (providerId: string): Promise<Service[]> => {
    const response = await apiClient.get<Service[]>(`/services/provider/${providerId}`)
    return response.data
  },

  // Get available time slots for a specific date
  getTimeSlots: async (date: Date, providerId: string): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/bookings/time-slots', {
      params: {
        date: date.toISOString(),
        providerId,
      },
    })
    return response.data
  },

  // Create a new booking
  createBooking: async (bookingData: BookingRequest): Promise<Booking> => {
    const response = await apiClient.post<Booking>('/bookings', {
      ...bookingData,
      date: bookingData.date.toISOString(),
    })
    return response.data
  },

  // Get user's bookings
  getBookings: async (): Promise<UserBooking[]> => {
    const response = await apiClient.get<UserBooking[]>('/bookings')
    return response.data
  },

  // Get booking by ID
  getBooking: async (bookingId: string): Promise<UserBooking> => {
    const response = await apiClient.get<UserBooking>(`/bookings/${bookingId}`)
    return response.data
  },

  // Cancel booking
  cancelBooking: async (bookingId: string): Promise<Booking> => {
    const response = await apiClient.patch<Booking>(`/bookings/${bookingId}/cancel`)
    return response.data
  },
}
