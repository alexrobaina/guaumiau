import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PetType, PetSize, PetGender, EnergyLevel } from '@prisma/client';

class PetOwnerDto {
  @ApiProperty({ example: 'uuid-user-123' })
  id: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  avatar?: string | null;
}

export class PetResponseDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'uuid-user-123' })
  ownerId: string;

  @ApiPropertyOptional({ type: PetOwnerDto })
  owner?: PetOwnerDto;

  @ApiProperty({ example: 'Max' })
  name: string;

  @ApiProperty({ enum: PetType, example: PetType.DOG })
  type: PetType;

  @ApiPropertyOptional({ example: 'Golden Retriever' })
  breed?: string | null;

  @ApiProperty({ enum: PetSize, example: PetSize.MEDIUM })
  size: PetSize;

  @ApiPropertyOptional({ example: 25.5 })
  weight?: number | null;

  @ApiPropertyOptional({ example: 3 })
  age?: number | null;

  @ApiProperty({ enum: PetGender, example: PetGender.MALE })
  gender: PetGender;

  @ApiPropertyOptional({ type: [String] })
  photos?: string[];

  @ApiPropertyOptional({ example: true })
  isVaccinated?: boolean;

  @ApiPropertyOptional()
  vaccinationRecords?: any;

  @ApiPropertyOptional({ example: true })
  isNeutered?: boolean;

  @ApiPropertyOptional({ example: '123456789' })
  microchipId?: string | null;

  @ApiPropertyOptional({ example: 'Chicken, wheat' })
  allergies?: string | null;

  @ApiPropertyOptional({ example: 'Heartgard monthly' })
  medications?: string | null;

  @ApiPropertyOptional({ example: 'Arthritis, needs ramp for stairs' })
  specialNeeds?: string | null;

  @ApiPropertyOptional({ example: 'Dr. Smith' })
  vetName?: string | null;

  @ApiPropertyOptional({ example: '+54 11 1234-5678' })
  vetPhone?: string | null;

  @ApiPropertyOptional({ example: 'Av. Santa Fe 1234, Buenos Aires' })
  vetAddress?: string | null;

  @ApiPropertyOptional({ enum: EnergyLevel, example: EnergyLevel.HIGH })
  energyLevel?: EnergyLevel | null;

  @ApiPropertyOptional({ example: true })
  isFriendlyWithDogs?: boolean;

  @ApiPropertyOptional({ example: true })
  isFriendlyWithCats?: boolean;

  @ApiPropertyOptional({ example: true })
  isFriendlyWithKids?: boolean;

  @ApiPropertyOptional({ example: 'Advanced' })
  trainingLevel?: string | null;

  @ApiPropertyOptional({ example: 'Playing fetch, swimming' })
  favoriteActivities?: string | null;

  @ApiPropertyOptional({ example: 30 })
  preferredWalkDuration?: number | null;

  @ApiPropertyOptional({ example: 'Twice daily' })
  preferredWalkFrequency?: string | null;

  @ApiPropertyOptional({ example: 'Needs to be fed at 8am and 6pm' })
  specialInstructions?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
