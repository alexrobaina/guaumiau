import { PrismaService } from '../prisma/prisma.service';
import { SearchWalkersDto } from './dto/search-walkers.dto';
export declare class WalkersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private calculateDistance;
    private toRad;
    searchWalkers(searchDto: SearchWalkersDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string | null;
        latitude: number | null;
        longitude: number | null;
        serviceProvider: {
            bio: string | null;
            servicesOffered: import("@prisma/client").$Enums.ServiceType[];
            isVerified: boolean;
            averageRating: number;
            totalReviews: number;
            services: {
                id: string;
                serviceType: import("@prisma/client").$Enums.ServiceType;
                basePrice: number;
                description: string | null;
                duration: number | null;
            }[];
        } | null;
    }[]>;
    getAllWalkers(): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string | null;
        latitude: number | null;
        longitude: number | null;
        serviceProvider: {
            bio: string | null;
            servicesOffered: import("@prisma/client").$Enums.ServiceType[];
            isVerified: boolean;
            averageRating: number;
            totalReviews: number;
            services: {
                id: string;
                serviceType: import("@prisma/client").$Enums.ServiceType;
                basePrice: number;
                description: string | null;
                duration: number | null;
            }[];
        } | null;
    }[]>;
    getWalkerById(id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        avatar: string | null;
        serviceProvider: {
            bio: string | null;
            servicesOffered: import("@prisma/client").$Enums.ServiceType[];
            isVerified: boolean;
            averageRating: number;
            totalReviews: number;
            services: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                acceptedPetTypes: import("@prisma/client").$Enums.PetType[];
                acceptedPetSizes: import("@prisma/client").$Enums.PetSize[];
                serviceType: import("@prisma/client").$Enums.ServiceType;
                basePrice: number;
                pricingUnit: import("@prisma/client").$Enums.PricingUnit;
                description: string | null;
                duration: number | null;
                maxPets: number;
                extraPetFee: number | null;
                weekendSurcharge: number | null;
                holidaySurcharge: number | null;
                providerId: string;
            }[];
        } | null;
    }>;
}
