import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProviderQueryDto } from './dto/provider-query.dto';
import {
  ProviderResponseDto,
  PaginatedProvidersResponseDto,
} from './dto/provider-response.dto';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Find providers with filters and pagination
   */
  async findProviders(
    query: ProviderQueryDto,
  ): Promise<PaginatedProvidersResponseDto> {
    const {
      latitude,
      longitude,
      radius = 50,
      serviceType,
      availableNow,
      minRating,
      search,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause - only show verified providers
    const where: any = {
      isVerified: true,
    };

    // Add optional filters only if they are explicitly provided
    if (availableNow !== undefined) {
      where.isAvailable = availableNow;
    }

    if (minRating !== undefined && minRating > 0) {
      where.averageRating = { gte: minRating };
    }

    if (serviceType !== undefined && serviceType) {
      where.servicesOffered = { has: serviceType };
    }

    // Add search filter
    if (search !== undefined && search.trim()) {
      const searchTerm = search.trim();
      where.OR = [
        {
          user: {
            firstName: { contains: searchTerm, mode: 'insensitive' },
          },
        },
        {
          user: {
            lastName: { contains: searchTerm, mode: 'insensitive' },
          },
        },
        {
          user: {
            city: { contains: searchTerm, mode: 'insensitive' },
          },
        },
        {
          bio: { contains: searchTerm, mode: 'insensitive' },
        },
      ];
    }

    // Get providers with user and services
    const providers = await this.prisma.serviceProviderProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            city: true,
            country: true,
            latitude: true,
            longitude: true,
          },
        },
        services: {
          where: {
            isActive: true,
          },
        },
      },
      orderBy: [
        { averageRating: 'desc' },
        { totalReviews: 'desc' },
        { completedBookings: 'desc' },
      ],
    });

    // Calculate distances and map to DTO
    const hasLocationFilter =
      latitude !== undefined &&
      longitude !== undefined &&
      !isNaN(latitude) &&
      !isNaN(longitude);

    const mappedProviders: ProviderResponseDto[] = providers
      .map((provider) => {
        let distance: number | undefined;

        // Calculate distance if user location is provided
        if (
          hasLocationFilter &&
          provider.user.latitude &&
          provider.user.longitude
        ) {
          distance = this.calculateDistance(
            latitude,
            longitude,
            provider.user.latitude,
            provider.user.longitude,
          );
        }

        return {
          id: provider.id,
          user: {
            id: provider.user.id,
            firstName: provider.user.firstName,
            lastName: provider.user.lastName,
            avatar: provider.user.avatar || undefined,
            city: provider.user.city || undefined,
            country: provider.user.country,
            latitude: provider.user.latitude || undefined,
            longitude: provider.user.longitude || undefined,
          },
          bio: provider.bio || undefined,
          experience: provider.experience || undefined,
          isAvailable: provider.isAvailable,
          isVerified: provider.isVerified,
          averageRating: provider.averageRating,
          totalReviews: provider.totalReviews,
          completedBookings: provider.completedBookings,
          servicesOffered: provider.servicesOffered || [],
          services: provider.services.map((service) => ({
            id: service.id,
            serviceType: service.serviceType,
            basePrice: service.basePrice,
            pricingUnit: service.pricingUnit,
            description: service.description || undefined,
            duration: service.duration || undefined,
            maxPets: service.maxPets,
            acceptedPetTypes: service.acceptedPetTypes || [],
            acceptedPetSizes: service.acceptedPetSizes || [],
          })),
          distance,
        };
      })
      .filter((provider) => {
        // Filter by radius if location is provided
        if (hasLocationFilter && radius > 0) {
          // Exclude providers without location
          if (provider.distance === undefined) {
            return false;
          }
          // Exclude providers outside radius
          return provider.distance <= radius;
        }
        // Include all providers if no location filter
        return true;
      });

    // Sort providers
    // If minRating filter is active, prioritize rating over distance
    if (minRating !== undefined && minRating > 0) {
      // Sort by rating first (descending - 5.0, 4.9, 4.8, etc.)
      // Then by total reviews (descending - more reviews = more reliable)
      // Then by distance (ascending - closer is better)
      mappedProviders.sort((a, b) => {
        // Primary sort: Rating (descending - highest rating first: 5.0 > 4.9 > 4.8)
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }

        // Secondary sort: Total reviews (descending - more reviews = more reliable)
        if (b.totalReviews !== a.totalReviews) {
          return b.totalReviews - a.totalReviews;
        }

        // Tertiary sort: Distance (ascending - closer is better)
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return 0;
      });
    } else if (hasLocationFilter) {
      // Sort by distance if location provided and no rating filter
      mappedProviders.sort((a, b) => {
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    } else {
      // Sort by rating and reviews if no location and no rating filter
      mappedProviders.sort((a, b) => {
        if (a.averageRating !== b.averageRating) {
          return b.averageRating - a.averageRating;
        }
        return b.totalReviews - a.totalReviews;
      });
    }

    // Paginate
    const total = mappedProviders.length;
    const paginatedProviders = mappedProviders.slice(skip, skip + limit);

    return {
      providers: paginatedProviders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get a single provider by ID
   */
  async findOne(id: string): Promise<ProviderResponseDto> {
    const provider = await this.prisma.serviceProviderProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            city: true,
            country: true,
            latitude: true,
            longitude: true,
          },
        },
        services: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!provider) {
      throw new Error('Provider not found');
    }

    return {
      id: provider.id,
      user: {
        id: provider.user.id,
        firstName: provider.user.firstName,
        lastName: provider.user.lastName,
        avatar: provider.user.avatar || undefined,
        city: provider.user.city || undefined,
        country: provider.user.country,
        latitude: provider.user.latitude || undefined,
        longitude: provider.user.longitude || undefined,
      },
      bio: provider.bio || undefined,
      experience: provider.experience || undefined,
      isAvailable: provider.isAvailable,
      isVerified: provider.isVerified,
      averageRating: provider.averageRating,
      totalReviews: provider.totalReviews,
      completedBookings: provider.completedBookings,
      servicesOffered: provider.servicesOffered || [],
      services: provider.services.map((service) => ({
        id: service.id,
        serviceType: service.serviceType,
        basePrice: service.basePrice,
        pricingUnit: service.pricingUnit,
        description: service.description || undefined,
        duration: service.duration || undefined,
        maxPets: service.maxPets,
        acceptedPetTypes: service.acceptedPetTypes || [],
        acceptedPetSizes: service.acceptedPetSizes || [],
      })),
    };
  }
}
