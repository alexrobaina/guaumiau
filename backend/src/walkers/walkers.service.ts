import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { SearchWalkersDto } from './dto/search-walkers.dto'

@Injectable()
export class WalkersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @returns distance in kilometers
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1)
    const dLon = this.toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  async searchWalkers(searchDto: SearchWalkersDto) {
    console.log('[WalkersService] Searching walkers with filters:', JSON.stringify(searchDto, null, 2))

    const {
      latitude,
      longitude,
      maxDistance,
      minRating,
      serviceTypes,
      maxPrice,
      minPrice,
    } = searchDto

    // Build where clause for Prisma
    const where: any = {
      roles: {
        has: 'SERVICE_PROVIDER',
      },
      serviceProvider: {
        isNot: null,
      },
    }

    // Filter by minimum rating
    if (minRating !== undefined) {
      where.serviceProvider = {
        ...where.serviceProvider,
        averageRating: {
          gte: minRating,
        },
      }
    }

    // Get all service providers
    const walkers = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        email: true,
        latitude: true,
        longitude: true,
        serviceProvider: {
          select: {
            bio: true,
            averageRating: true,
            totalReviews: true,
            servicesOffered: true,
            isVerified: true,
            services: {
              where: {
                isActive: true,
              },
              select: {
                id: true,
                serviceType: true,
                basePrice: true,
                duration: true,
                description: true,
              },
            },
          },
        },
      },
    })

    console.log('[WalkersService] Found', walkers.length, 'service providers before filtering')

    // Filter by service types if specified
    let filteredWalkers = walkers
    if (serviceTypes && serviceTypes.length > 0) {
      console.log('[WalkersService] Filtering by service types:', serviceTypes)
      filteredWalkers = walkers.filter((walker) => {
        // Check both services (from Service table) and servicesOffered (from ServiceProviderProfile)
        const serviceTypesFromServices = walker.serviceProvider?.services.map(
          (s) => s.serviceType,
        ) || []
        const serviceTypesFromProfile = walker.serviceProvider?.servicesOffered || []

        // Combine both sources
        const allServiceTypes = [...serviceTypesFromServices, ...serviceTypesFromProfile]

        console.log('[WalkersService] Walker', walker.firstName, walker.lastName, 'has services:', allServiceTypes)

        // Check if any of the requested service types match
        const hasMatch = serviceTypes.some((type) => allServiceTypes.includes(type))
        return hasMatch
      })
      console.log('[WalkersService] After service type filter:', filteredWalkers.length, 'walkers')
    }

    // Filter by price range if specified
    if (minPrice !== undefined || maxPrice !== undefined) {
      filteredWalkers = filteredWalkers.filter((walker) => {
        const services = walker.serviceProvider?.services || []
        return services.some((service) => {
          const matchesMin = minPrice === undefined || service.basePrice >= minPrice
          const matchesMax = maxPrice === undefined || service.basePrice <= maxPrice
          return matchesMin && matchesMax
        })
      })
    }

    // Calculate distance and filter if location provided
    if (latitude !== undefined && longitude !== undefined) {
      console.log('[WalkersService] Calculating distances from location:', latitude, longitude)
      const walkersWithDistance = filteredWalkers
        .map((walker) => {
          const providerLat = walker.latitude
          const providerLng = walker.longitude

          let distance: number | null = null
          if (providerLat !== null && providerLng !== null) {
            distance = this.calculateDistance(
              latitude,
              longitude,
              providerLat,
              providerLng,
            )
          }

          return {
            ...walker,
            distance,
          }
        })
        .filter((walker) => {
          // If maxDistance specified, filter out walkers beyond that distance
          if (maxDistance !== undefined && walker.distance !== null) {
            return walker.distance <= maxDistance
          }
          return true
        })
        .sort((a, b) => {
          // Sort by distance (nulls last)
          if (a.distance === null) return 1
          if (b.distance === null) return -1
          return a.distance - b.distance
        })

      console.log('[WalkersService] After distance filter:', walkersWithDistance.length, 'walkers')
      console.log('[WalkersService] Returning', walkersWithDistance.length, 'walkers with distances')
      return walkersWithDistance
    }

    console.log('[WalkersService] No location provided, returning', filteredWalkers.length, 'walkers sorted by rating')

    // Return walkers sorted by rating if no location provided
    return filteredWalkers.sort((a, b) => {
      const ratingA = a.serviceProvider?.averageRating || 0
      const ratingB = b.serviceProvider?.averageRating || 0
      return ratingB - ratingA
    })
  }

  async getAllWalkers() {
    return this.searchWalkers({})
  }

  async getWalkerById(id: string) {
    const walker = await this.prisma.user.findFirst({
      where: {
        id,
        roles: {
          has: 'SERVICE_PROVIDER',
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        serviceProvider: {
          select: {
            bio: true,
            averageRating: true,
            totalReviews: true,
            servicesOffered: true,
            isVerified: true,
            services: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
    })

    if (!walker || !walker.serviceProvider) {
      throw new NotFoundException('Walker not found')
    }

    return walker
  }
}
