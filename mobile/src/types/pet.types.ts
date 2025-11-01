/**
 * Pet Types - TypeScript interfaces for Pet management
 */

export enum PetType {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  RABBIT = 'RABBIT',
  HAMSTER = 'HAMSTER',
  FISH = 'FISH',
  REPTILE = 'REPTILE',
  OTHER = 'OTHER',
}

export enum PetSize {
  EXTRA_SMALL = 'EXTRA_SMALL', // < 5kg
  SMALL = 'SMALL', // 5-10kg
  MEDIUM = 'MEDIUM', // 10-25kg
  LARGE = 'LARGE', // 25-45kg
  EXTRA_LARGE = 'EXTRA_LARGE', // > 45kg
}

export enum PetGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNKNOWN = 'UNKNOWN',
}

export enum EnergyLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
}

export interface VaccinationRecord {
  name: string;
  date: string;
  nextDue?: string;
}

export interface Pet {
  id: string;
  ownerId: string;

  // Basic Info
  name: string;
  type: PetType;
  breed?: string | null;
  size: PetSize;
  weight?: number | null;
  age?: number | null;
  gender: PetGender;
  photos?: string[];

  // Medical Info
  isVaccinated?: boolean;
  vaccinationRecords?: VaccinationRecord[];
  isNeutered?: boolean;
  microchipId?: string | null;
  allergies?: string | null;
  medications?: string | null;
  specialNeeds?: string | null;

  // Veterinary Contact
  vetName?: string | null;
  vetPhone?: string | null;
  vetAddress?: string | null;

  // Behavior & Preferences
  energyLevel?: EnergyLevel | null;
  isFriendlyWithDogs?: boolean;
  isFriendlyWithCats?: boolean;
  isFriendlyWithKids?: boolean;
  trainingLevel?: string | null;
  favoriteActivities?: string | null;

  // Walk Preferences
  preferredWalkDuration?: number | null;
  preferredWalkFrequency?: string | null;

  // Notes
  specialInstructions?: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface CreatePetRequest {
  // Basic Info
  name: string;
  type: PetType;
  breed?: string;
  size: PetSize;
  weight?: number;
  age?: number;
  gender: PetGender;
  photos?: string[];

  // Medical Info
  isVaccinated?: boolean;
  vaccinationRecords?: VaccinationRecord[];
  isNeutered?: boolean;
  microchipId?: string;
  allergies?: string;
  medications?: string;
  specialNeeds?: string;

  // Veterinary Contact
  vetName?: string;
  vetPhone?: string;
  vetAddress?: string;

  // Behavior & Preferences
  energyLevel?: EnergyLevel;
  isFriendlyWithDogs?: boolean;
  isFriendlyWithCats?: boolean;
  isFriendlyWithKids?: boolean;
  trainingLevel?: string;
  favoriteActivities?: string;

  // Walk Preferences
  preferredWalkDuration?: number;
  preferredWalkFrequency?: string;

  // Notes
  specialInstructions?: string;
}

export interface UpdatePetRequest extends Partial<CreatePetRequest> {}

export interface UpdateMedicalInfoRequest {
  isVaccinated?: boolean;
  vaccinationRecords?: VaccinationRecord[];
  isNeutered?: boolean;
  microchipId?: string;
  allergies?: string;
  medications?: string;
  specialNeeds?: string;
  vetName?: string;
  vetPhone?: string;
  vetAddress?: string;
}

export interface UpdateBehaviorInfoRequest {
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

export interface AddPhotoRequest {
  photoUrl: string;
}

export interface RemovePhotoRequest {
  photoUrl: string;
}

export interface PetResponse extends Pet {}
export interface PetsListResponse extends Array<Pet> {}
