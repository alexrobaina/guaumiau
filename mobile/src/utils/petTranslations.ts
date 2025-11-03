import { PetType, PetSize, PetGender, EnergyLevel } from '@/types/pet.types';

// Traducciones para los tipos de mascota
export const petTypeTranslations: Record<PetType, string> = {
  [PetType.DOG]: 'Perro',
  [PetType.CAT]: 'Gato',
  [PetType.BIRD]: 'Ave',
  [PetType.RABBIT]: 'Conejo',
  [PetType.HAMSTER]: 'Hámster',
  [PetType.FISH]: 'Pez',
  [PetType.REPTILE]: 'Reptil',
  [PetType.OTHER]: 'Otro',
};

// Traducciones para los tamaños
export const petSizeTranslations: Record<PetSize, string> = {
  [PetSize.EXTRA_SMALL]: 'Extra Pequeño',
  [PetSize.SMALL]: 'Pequeño',
  [PetSize.MEDIUM]: 'Mediano',
  [PetSize.LARGE]: 'Grande',
  [PetSize.EXTRA_LARGE]: 'Extra Grande',
};

// Traducciones para el género
export const petGenderTranslations: Record<PetGender, string> = {
  [PetGender.MALE]: 'Macho',
  [PetGender.FEMALE]: 'Hembra',
  [PetGender.UNKNOWN]: 'Desconocido',
};

// Traducciones para nivel de energía
export const energyLevelTranslations: Record<EnergyLevel, string> = {
  [EnergyLevel.LOW]: 'Bajo',
  [EnergyLevel.MODERATE]: 'Moderado',
  [EnergyLevel.HIGH]: 'Alto',
  [EnergyLevel.VERY_HIGH]: 'Muy Alto',
};

// Funciones helper para obtener las traducciones
export const translatePetType = (type: PetType): string => {
  return petTypeTranslations[type] || type;
};

export const translatePetSize = (size: PetSize): string => {
  return petSizeTranslations[size] || size;
};

export const translatePetGender = (gender: PetGender): string => {
  return petGenderTranslations[gender] || gender;
};

export const translateEnergyLevel = (level: EnergyLevel): string => {
  return energyLevelTranslations[level] || level;
};
