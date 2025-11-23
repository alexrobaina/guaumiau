import apiClient from './client'

export interface SearchWalkersParams {
  latitude?: number
  longitude?: number
  maxDistance?: number
  minRating?: number
  serviceTypes?: string[]
  maxPrice?: number
  minPrice?: number
}

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

export const walkersService = {
  searchWalkers: async (params?: SearchWalkersParams): Promise<Walker[]> => {
    const response = await apiClient.get<Walker[]>('/walkers', { params })
    return response.data
  },

  getWalkerById: async (id: string): Promise<Walker> => {
    const response = await apiClient.get<Walker>(`/walkers/${id}`)
    return response.data
  },
}
