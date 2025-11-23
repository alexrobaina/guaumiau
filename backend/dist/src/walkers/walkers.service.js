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
exports.WalkersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WalkersService = class WalkersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
                Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
    async searchWalkers(searchDto) {
        console.log('[WalkersService] Searching walkers with filters:', JSON.stringify(searchDto, null, 2));
        const { latitude, longitude, maxDistance, minRating, serviceTypes, maxPrice, minPrice, } = searchDto;
        const where = {
            roles: {
                has: 'SERVICE_PROVIDER',
            },
            serviceProvider: {
                isNot: null,
            },
        };
        if (minRating !== undefined) {
            where.serviceProvider = {
                ...where.serviceProvider,
                averageRating: {
                    gte: minRating,
                },
            };
        }
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
        });
        console.log('[WalkersService] Found', walkers.length, 'service providers before filtering');
        let filteredWalkers = walkers;
        if (serviceTypes && serviceTypes.length > 0) {
            console.log('[WalkersService] Filtering by service types:', serviceTypes);
            filteredWalkers = walkers.filter((walker) => {
                const serviceTypesFromServices = walker.serviceProvider?.services.map((s) => s.serviceType) || [];
                const serviceTypesFromProfile = walker.serviceProvider?.servicesOffered || [];
                const allServiceTypes = [...serviceTypesFromServices, ...serviceTypesFromProfile];
                console.log('[WalkersService] Walker', walker.firstName, walker.lastName, 'has services:', allServiceTypes);
                const hasMatch = serviceTypes.some((type) => allServiceTypes.includes(type));
                return hasMatch;
            });
            console.log('[WalkersService] After service type filter:', filteredWalkers.length, 'walkers');
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            filteredWalkers = filteredWalkers.filter((walker) => {
                const services = walker.serviceProvider?.services || [];
                return services.some((service) => {
                    const matchesMin = minPrice === undefined || service.basePrice >= minPrice;
                    const matchesMax = maxPrice === undefined || service.basePrice <= maxPrice;
                    return matchesMin && matchesMax;
                });
            });
        }
        if (latitude !== undefined && longitude !== undefined) {
            console.log('[WalkersService] Calculating distances from location:', latitude, longitude);
            const walkersWithDistance = filteredWalkers
                .map((walker) => {
                const providerLat = walker.latitude;
                const providerLng = walker.longitude;
                let distance = null;
                if (providerLat !== null && providerLng !== null) {
                    distance = this.calculateDistance(latitude, longitude, providerLat, providerLng);
                }
                return {
                    ...walker,
                    distance,
                };
            })
                .filter((walker) => {
                if (maxDistance !== undefined && walker.distance !== null) {
                    return walker.distance <= maxDistance;
                }
                return true;
            })
                .sort((a, b) => {
                if (a.distance === null)
                    return 1;
                if (b.distance === null)
                    return -1;
                return a.distance - b.distance;
            });
            console.log('[WalkersService] After distance filter:', walkersWithDistance.length, 'walkers');
            console.log('[WalkersService] Returning', walkersWithDistance.length, 'walkers with distances');
            return walkersWithDistance;
        }
        console.log('[WalkersService] No location provided, returning', filteredWalkers.length, 'walkers sorted by rating');
        return filteredWalkers.sort((a, b) => {
            const ratingA = a.serviceProvider?.averageRating || 0;
            const ratingB = b.serviceProvider?.averageRating || 0;
            return ratingB - ratingA;
        });
    }
    async getAllWalkers() {
        return this.searchWalkers({});
    }
    async getWalkerById(id) {
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
        });
        if (!walker || !walker.serviceProvider) {
            throw new common_1.NotFoundException('Walker not found');
        }
        return walker;
    }
};
exports.WalkersService = WalkersService;
exports.WalkersService = WalkersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalkersService);
//# sourceMappingURL=walkers.service.js.map