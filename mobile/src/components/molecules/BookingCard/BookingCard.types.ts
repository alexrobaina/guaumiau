export interface Booking {
  id: string
  serviceType: string
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED'
  startDate: string
  endDate: string
  totalPrice: number
  currency: string
  provider?: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
  client?: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
  pets: Array<{
    id: string
    name: string
    type: string
  }>
  pickupAddress?: string
}

export interface BookingCardProps {
  booking: Booking
  onPress: (bookingId: string) => void
  userRole: 'client' | 'provider' // To determine which user info to show
}
