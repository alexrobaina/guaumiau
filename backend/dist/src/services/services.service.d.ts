import { PrismaService } from '../prisma/prisma.service';
export declare class ServicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllServices(): Promise<{
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
    }[]>;
    getServicesByProvider(providerIdOrUserId: string): Promise<{
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
    }[]>;
}
