export interface WalkerService {
  id: string
  serviceType: string
  basePrice: number
  duration: number
  description?: string
}

export interface Walker {
  id: string
  firstName: string
  lastName: string
  avatar?: string
  email: string
  latitude: number | null
  longitude: number | null
  distance?: number | null
  serviceProvider?: {
    bio?: string
    averageRating: number
    totalReviews: number
    servicesOffered: string[]
    isVerified: boolean
    services: WalkerService[]
  }
}

export interface UserLocation {
  lat: number
  lng: number
}

export type FilterType = 'ALL' | 'DOG_WALKING' | 'DOG_SITTING' | 'CAT_SITTING' | 'DISTANCE' | 'RATING'
