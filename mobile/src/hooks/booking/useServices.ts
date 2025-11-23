import { useQuery } from '@tanstack/react-query'
import { bookingService } from '@services/api/booking.service'

// Mock data for testing
const MOCK_SERVICES = [
  {
    id: '1',
    serviceType: 'DOG_WALKING',
    basePrice: 15.0,
    pricingUnit: 'PER_WALK',
    description: 'Paseo corto de 30 minutos',
    duration: 30,
    isActive: true,
  },
  {
    id: '2',
    serviceType: 'DOG_WALKING',
    basePrice: 25.0,
    pricingUnit: 'PER_WALK',
    description: 'Paseo largo de 60 minutos',
    duration: 60,
    isActive: true,
  },
  {
    id: '3',
    serviceType: 'PET_SITTING',
    basePrice: 12.0,
    pricingUnit: 'PER_HOUR',
    description: 'Cuidado por hora',
    duration: 60,
    isActive: true,
  },
]

export const useServices = (providerId?: string) => {
  return useQuery({
    queryKey: providerId ? ['services', 'provider', providerId] : ['services'],
    queryFn: async () => {
      // Try to fetch from API, fallback to mock data
      try {
        if (providerId) {
          console.log('[useServices] Fetching services for provider:', providerId)
          const services = await bookingService.getProviderServices(providerId)
          console.log('[useServices] Services fetched successfully:', services?.length || 0, 'services')

          // If no services found, use mock data
          if (!services || services.length === 0) {
            console.log('[useServices] No services found for provider, using mock data')
            return MOCK_SERVICES
          }

          return services
        }
        console.log('[useServices] Fetching all services')
        const services = await bookingService.getServices()
        console.log('[useServices] All services fetched:', services?.length || 0)

        // If no services found, use mock data
        if (!services || services.length === 0) {
          console.log('[useServices] No services found, using mock data')
          return MOCK_SERVICES
        }

        return services
      } catch (error) {
        console.error('[useServices] Error fetching services:', error)
        // Return mock data if API fails
        return MOCK_SERVICES
      }
    },
    enabled: providerId ? !!providerId : true,
  })
}
