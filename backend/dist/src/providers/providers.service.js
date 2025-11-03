"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProvidersService = class ProvidersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
                Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return Math.round(distance * 10) / 10;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    async findProviders(query) {
        console.log('🔍 [BACKEND] Received query:', JSON.stringify(query, null, 2));
        const { latitude, longitude, radius = 50, serviceType, availableNow, minRating, search, page = 1, limit = 10, } = query;
        const skip = (page - 1) * limit;
        console.log('🔍 [BACKEND] Parsed params:', {
            latitude,
            longitude,
            radius,
            serviceType,
            availableNow,
            minRating,
            search,
            page,
            limit,
        });
        const where = {
            isVerified: true,
        };
        console.log('🔍 [BACKEND] Initial where clause:', JSON.stringify(where, null, 2));
        if (availableNow !== undefined) {
            console.log('🔍 [BACKEND] Adding availableNow filter:', availableNow);
            where.isAvailable = availableNow;
        }
        if (minRating !== undefined && minRating > 0) {
            console.log('🔍 [BACKEND] Adding minRating filter:', minRating);
            where.averageRating = { gte: minRating };
        }
        if (serviceType !== undefined && serviceType) {
            console.log('🔍 [BACKEND] Adding serviceType filter:', serviceType);
            where.servicesOffered = { has: serviceType };
        }
        if (search !== undefined && search.trim()) {
            const searchTerm = search.trim();
            console.log('🔍 [BACKEND] Adding search filter:', searchTerm);
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
        console.log('🔍 [BACKEND] Final where clause:', JSON.stringify(where, null, 2));
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
        console.log('🔍 [BACKEND] Found', providers.length, 'providers from DB before location filtering');
        const hasLocationFilter = latitude !== undefined &&
            longitude !== undefined &&
            !isNaN(latitude) &&
            !isNaN(longitude);
        console.log('🔍 [BACKEND] Location filter active:', hasLocationFilter, 'Radius:', radius);
        const mappedProviders = providers
            .map((provider) => {
            let distance;
            if (hasLocationFilter &&
                provider.user.latitude &&
                provider.user.longitude) {
                distance = this.calculateDistance(latitude, longitude, provider.user.latitude, provider.user.longitude);
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
            if (hasLocationFilter && radius > 0) {
                if (provider.distance === undefined) {
                    return false;
                }
                return provider.distance <= radius;
            }
            return true;
        });
        if (minRating !== undefined && minRating > 0) {
            mappedProviders.sort((a, b) => {
                if (b.averageRating !== a.averageRating) {
                    return b.averageRating - a.averageRating;
                }
                if (b.totalReviews !== a.totalReviews) {
                    return b.totalReviews - a.totalReviews;
                }
                if (a.distance !== undefined && b.distance !== undefined) {
                    return a.distance - b.distance;
                }
                if (a.distance === undefined)
                    return 1;
                if (b.distance === undefined)
                    return -1;
                return 0;
            });
        }
        else if (hasLocationFilter) {
            mappedProviders.sort((a, b) => {
                if (a.distance === undefined)
                    return 1;
                if (b.distance === undefined)
                    return -1;
                return a.distance - b.distance;
            });
        }
        else {
            mappedProviders.sort((a, b) => {
                if (a.averageRating !== b.averageRating) {
                    return b.averageRating - a.averageRating;
                }
                return b.totalReviews - a.totalReviews;
            });
        }
        const total = mappedProviders.length;
        const paginatedProviders = mappedProviders.slice(skip, skip + limit);
        console.log('🔍 [BACKEND] After location filtering and pagination:', {
            totalProviders: total,
            returnedProviders: paginatedProviders.length,
            page,
            limit,
        });
        console.log('🔍 [BACKEND] Returning providers:', paginatedProviders.map(p => `${p.user.firstName} ${p.user.lastName} (${p.averageRating}⭐, ${p.distance ? p.distance + 'km' : 'no distance'})`).join(', '));
        return {
            providers: paginatedProviders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
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
};
exports.ProvidersService = ProvidersService;
exports.ProvidersService = ProvidersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProvidersService);
//# sourceMappingURL=providers.service.js.map