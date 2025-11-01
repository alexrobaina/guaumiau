import { PetType, PetSize, PetGender, EnergyLevel } from '@prisma/client';
declare class VaccinationRecordDto {
    name: string;
    date: string;
    nextDue?: string;
}
export declare class CreatePetDto {
    name: string;
    type: PetType;
    breed?: string;
    size: PetSize;
    weight?: number;
    age?: number;
    gender: PetGender;
    photos?: string[];
    isVaccinated?: boolean;
    vaccinationRecords?: VaccinationRecordDto[];
    isNeutered?: boolean;
    microchipId?: string;
    allergies?: string;
    medications?: string;
    specialNeeds?: string;
    vetName?: string;
    vetPhone?: string;
    vetAddress?: string;
    energyLevel?: EnergyLevel;
    isFriendlyWithDogs?: boolean;
    isFriendlyWithCats?: boolean;
    isFriendlyWithKids?: boolean;
    trainingLevel?: string;
    favoriteActivities?: string;
    preferredWalkDuration?: number;
    preferredWalkFrequency?: string;
    specialInstructions?: string;
}
export {};
