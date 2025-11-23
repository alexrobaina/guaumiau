import { ServicesService } from './services.service';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    getServices(): Promise<{
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
    getServicesByProvider(providerId: string): Promise<{
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
