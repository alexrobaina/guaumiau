import { ApiProperty } from '@nestjs/swagger';

export class ProviderUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false })
  city?: string;

  @ApiProperty({ required: false })
  country?: string;

  @ApiProperty({ required: false })
  latitude?: number;

  @ApiProperty({ required: false })
  longitude?: number;
}

export class ProviderServiceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  serviceType: string;

  @ApiProperty()
  basePrice: number;

  @ApiProperty()
  pricingUnit: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  duration?: number;

  @ApiProperty()
  maxPets: number;

  @ApiProperty({ type: [String] })
  acceptedPetTypes: string[];

  @ApiProperty({ type: [String] })
  acceptedPetSizes: string[];
}

export class ProviderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: ProviderUserDto })
  user: ProviderUserDto;

  @ApiProperty({ required: false })
  bio?: string;

  @ApiProperty({ required: false })
  experience?: string;

  @ApiProperty()
  isAvailable: boolean;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  averageRating: number;

  @ApiProperty()
  totalReviews: number;

  @ApiProperty()
  completedBookings: number;

  @ApiProperty({ type: [String] })
  servicesOffered: string[];

  @ApiProperty({ type: [ProviderServiceDto] })
  services: ProviderServiceDto[];

  @ApiProperty({ required: false })
  distance?: number;
}

export class PaginatedProvidersResponseDto {
  @ApiProperty({ type: [ProviderResponseDto] })
  providers: ProviderResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
