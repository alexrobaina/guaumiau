import { PetType, PetSize, PetGender, EnergyLevel } from '@prisma/client';
declare class PetOwnerDto {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string | null;
}
export declare class PetResponseDto {
    id: string;
    ownerId: string;
    owner?: PetOwnerDto;
    name: string;
    type: PetType;
    breed?: string | null;
    size: PetSize;
    weight?: number | null;
    age?: number | null;
    gender: PetGender;
    photos?: string[];
    isVaccinated?: boolean;
    vaccinationRecords?: any;
    isNeutered?: boolean;
    microchipId?: string | null;
    allergies?: string | null;
    medications?: string | null;
    specialNeeds?: string | null;
    vetName?: string | null;
    vetPhone?: string | null;
    vetAddress?: string | null;
    energyLevel?: EnergyLevel | null;
    isFriendlyWithDogs?: boolean;
    isFriendlyWithCats?: boolean;
    isFriendlyWithKids?: boolean;
    trainingLevel?: string | null;
    favoriteActivities?: string | null;
    preferredWalkDuration?: number | null;
    preferredWalkFrequency?: string | null;
    specialInstructions?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export {};
