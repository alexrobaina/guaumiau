export interface UserBooking {
  id: string
  serviceType: string
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'REJECTED'
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


