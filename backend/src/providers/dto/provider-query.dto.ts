import { IsOptional, IsEnum, IsNumber, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum ServiceTypeFilter {
  DOG_WALKING = 'DOG_WALKING',
  DOG_RUNNING = 'DOG_RUNNING',
  DOG_SITTING = 'DOG_SITTING',
  CAT_SITTING = 'CAT_SITTING',
  PET_SITTING = 'PET_SITTING',
  DOG_BOARDING = 'DOG_BOARDING',
  CAT_BOARDING = 'CAT_BOARDING',
  PET_BOARDING = 'PET_BOARDING',
  DOG_DAYCARE = 'DOG_DAYCARE',
  PET_DAYCARE = 'PET_DAYCARE',
  HOME_VISITS = 'HOME_VISITS',
  PET_TAXI = 'PET_TAXI',
}

export class ProviderQueryDto {
  @ApiPropertyOptional({ description: 'Latitude for location-based search' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude for location-based search' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Radius in kilometers',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  radius?: number = 10;

  @ApiPropertyOptional({
    enum: ServiceTypeFilter,
    description: 'Filter by service type',
  })
  @IsOptional()
  @IsEnum(ServiceTypeFilter)
  serviceType?: ServiceTypeFilter;

  @ApiPropertyOptional({
    description: 'Filter by availability (true/false)',
  })
  @IsOptional()
  @Type(() => Boolean)
  availableNow?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum rating (0-5)',
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({
    description: 'Search by provider name, city, or bio',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}
