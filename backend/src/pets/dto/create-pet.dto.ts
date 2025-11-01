import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PetType, PetSize, PetGender, EnergyLevel } from '@prisma/client';
import { Type } from 'class-transformer';

class VaccinationRecordDto {
  @ApiProperty({ description: 'Vaccine name', example: 'Rabies' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Vaccination date', example: '2024-01-15' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ description: 'Next due date', example: '2025-01-15' })
  @IsString()
  @IsOptional()
  nextDue?: string;
}

export class CreatePetDto {
  // Basic Info
  @ApiProperty({
    description: 'Pet name',
    example: 'Max',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Pet type',
    enum: PetType,
    example: PetType.DOG,
  })
  @IsEnum(PetType)
  @IsNotEmpty()
  type: PetType;

  @ApiPropertyOptional({
    description: 'Pet breed',
    example: 'Golden Retriever',
  })
  @IsString()
  @IsOptional()
  breed?: string;

  @ApiProperty({
    description: 'Pet size',
    enum: PetSize,
    example: PetSize.MEDIUM,
  })
  @IsEnum(PetSize)
  @IsNotEmpty()
  size: PetSize;

  @ApiPropertyOptional({
    description: 'Pet weight in kg',
    example: 25.5,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({
    description: 'Pet age in years',
    example: 3,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(30)
  age?: number;

  @ApiProperty({
    description: 'Pet gender',
    enum: PetGender,
    example: PetGender.MALE,
  })
  @IsEnum(PetGender)
  @IsNotEmpty()
  gender: PetGender;

  @ApiPropertyOptional({
    description: 'Pet photos URLs',
    example: ['https://example.com/photo1.jpg'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];

  // Medical Info
  @ApiPropertyOptional({
    description: 'Is pet vaccinated',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isVaccinated?: boolean;

  @ApiPropertyOptional({
    description: 'Vaccination records',
    type: [VaccinationRecordDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VaccinationRecordDto)
  @IsOptional()
  vaccinationRecords?: VaccinationRecordDto[];

  @ApiPropertyOptional({
    description: 'Is pet neutered/spayed',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isNeutered?: boolean;

  @ApiPropertyOptional({
    description: 'Microchip ID',
    example: '123456789',
  })
  @IsString()
  @IsOptional()
  microchipId?: string;

  @ApiPropertyOptional({
    description: 'Pet allergies',
    example: 'Chicken, wheat',
  })
  @IsString()
  @IsOptional()
  allergies?: string;

  @ApiPropertyOptional({
    description: 'Current medications',
    example: 'Heartgard monthly',
  })
  @IsString()
  @IsOptional()
  medications?: string;

  @ApiPropertyOptional({
    description: 'Special needs or conditions',
    example: 'Arthritis, needs ramp for stairs',
  })
  @IsString()
  @IsOptional()
  specialNeeds?: string;

  // Veterinary Contact
  @ApiPropertyOptional({
    description: 'Veterinarian name',
    example: 'Dr. Smith',
  })
  @IsString()
  @IsOptional()
  vetName?: string;

  @ApiPropertyOptional({
    description: 'Veterinarian phone',
    example: '+54 11 1234-5678',
  })
  @IsString()
  @IsOptional()
  vetPhone?: string;

  @ApiPropertyOptional({
    description: 'Veterinarian address',
    example: 'Av. Santa Fe 1234, Buenos Aires',
  })
  @IsString()
  @IsOptional()
  vetAddress?: string;

  // Behavior & Preferences
  @ApiPropertyOptional({
    description: 'Energy level',
    enum: EnergyLevel,
    example: EnergyLevel.HIGH,
  })
  @IsEnum(EnergyLevel)
  @IsOptional()
  energyLevel?: EnergyLevel;

  @ApiPropertyOptional({
    description: 'Friendly with other dogs',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isFriendlyWithDogs?: boolean;

  @ApiPropertyOptional({
    description: 'Friendly with cats',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isFriendlyWithCats?: boolean;

  @ApiPropertyOptional({
    description: 'Friendly with kids',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isFriendlyWithKids?: boolean;

  @ApiPropertyOptional({
    description: 'Training level',
    example: 'Advanced',
  })
  @IsString()
  @IsOptional()
  trainingLevel?: string;

  @ApiPropertyOptional({
    description: 'Favorite activities',
    example: 'Playing fetch, swimming',
  })
  @IsString()
  @IsOptional()
  favoriteActivities?: string;

  // Walk Preferences
  @ApiPropertyOptional({
    description: 'Preferred walk duration in minutes',
    example: 30,
  })
  @IsNumber()
  @IsOptional()
  @Min(5)
  preferredWalkDuration?: number;

  @ApiPropertyOptional({
    description: 'Preferred walk frequency',
    example: 'Twice daily',
  })
  @IsString()
  @IsOptional()
  preferredWalkFrequency?: string;

  // Notes
  @ApiPropertyOptional({
    description: 'Special instructions for caregivers',
    example: 'Needs to be fed at 8am and 6pm',
  })
  @IsString()
  @IsOptional()
  specialInstructions?: string;
}
