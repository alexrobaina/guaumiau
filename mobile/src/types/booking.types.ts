export enum ServiceType {
  DOG_WALKING = 'DOG_WALKING',
  DOG_RUNNING = 'DOG_RUNNING',
  DOG_SITTING = 'DOG_SITTING',
  CAT_SITTING = 'CAT_SITTING',
  PET_SITTING = 'PET_SITTING',
  DOG_BOARDING = 'DOG_BOARDING',
  CAT_BOARDING = 'CAT_BOARDING',
  PET_BOARDING = 'PET_BOARDING',
  DOG_DAYCARE = 'DOG_DAYCARE',
  PET_DAYCARE = 'PET_DAYCARE',
}

export interface Service {
  id: string
  name?: string
  price?: number
  basePrice: number
  duration: number
  description?: string
  serviceType: ServiceType
}

export interface Pet {
  id: string
  name: string
  image?: string
  breed?: string
  age?: number
}

export interface Provider {
  id: string
  name: string
  avatar?: string
  rating: number
  reviews: number
  bio?: string
}

export interface BookingRequest {
  providerId: string
  serviceType: ServiceType
  petIds: string[]
  date: Date
  time: string
  location: string
  instructions?: string
}

export interface Booking extends BookingRequest {
  id: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  totalPrice: number
  createdAt: Date
}
