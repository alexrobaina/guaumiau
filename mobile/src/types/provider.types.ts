export interface ProviderUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  city?: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface ProviderService {
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

export interface Provider {
  id: string;
  user: ProviderUser;
  bio?: string;
  experience?: string;
  isAvailable: boolean;
  isVerified: boolean;
  averageRating: number;
  totalReviews: number;
  completedBookings: number;
  servicesOffered: string[];
  services: ProviderService[];
  distance?: number;
}

export interface PaginatedProvidersResponse {
  providers: Provider[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProviderQueryParams {
  latitude?: number;
  longitude?: number;
  radius?: number;
  serviceType?: string;
  availableNow?: boolean;
  minRating?: number;
  search?: string;
  page?: number;
  limit?: number;
}
