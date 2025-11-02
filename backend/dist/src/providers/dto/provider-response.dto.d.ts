export declare class ProviderUserDto {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
}
export declare class ProviderServiceDto {
    id: string;
    serviceType: string;
    basePrice: number;
    pricingUnit: string;
    description?: string;
    duration?: number;
    maxPets: number;
    acceptedPetTypes: string[];
    acceptedPetSizes: string[];
}
export declare class ProviderResponseDto {
    id: string;
    user: ProviderUserDto;
    bio?: string;
    experience?: string;
    isAvailable: boolean;
    isVerified: boolean;
    averageRating: number;
    totalReviews: number;
    completedBookings: number;
    servicesOffered: string[];
    services: ProviderServiceDto[];
    distance?: number;
}
export declare class PaginatedProvidersResponseDto {
    providers: ProviderResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
