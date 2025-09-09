import { StateCreator } from 'zustand';
import { Equipment } from '@/types';
import { RootState } from '../types';

export interface OnboardingData {
  experience: 'beginner' | 'intermediate' | 'advanced' | 'elite' | null;
  currentGrade: {
    boulder: string;
    sport: string;
  };
  goals: string[];
  equipment: Equipment[];
  trainingAvailability: {
    daysPerWeek: number;
    hoursPerSession: number;
  };
  injuries: string[];
  preferredStyle: 'boulder' | 'sport' | 'trad' | 'all' | null;
  completed: boolean;
}

export interface OnboardingSlice {
  data: OnboardingData;
  currentStep: number;
  totalSteps: number;
  
  // Actions
  setExperience: (experience: OnboardingData['experience']) => void;
  setCurrentGrade: (grades: OnboardingData['currentGrade']) => void;
  setGoals: (goals: string[]) => void;
  setEquipment: (equipment: Equipment[]) => void;
  setTrainingAvailability: (availability: OnboardingData['trainingAvailability']) => void;
  setInjuries: (injuries: string[]) => void;
  setPreferredStyle: (style: OnboardingData['preferredStyle']) => void;
  
  // Navigation
  nextStep: () => void;
  previousStep: () => void;
  setCurrentStep: (step: number) => void;
  
  // Persistence
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const initialOnboardingData: OnboardingData = {
  experience: null,
  currentGrade: {
    boulder: '',
    sport: ''
  },
  goals: [],
  equipment: [],
  trainingAvailability: {
    daysPerWeek: 3,
    hoursPerSession: 1
  },
  injuries: [],
  preferredStyle: null,
  completed: false
};

export const createOnboardingSlice: StateCreator<
  RootState,
  [['zustand/immer', never]],
  [],
  OnboardingSlice
> = (set, get) => ({
  data: initialOnboardingData,
  currentStep: 0,
  totalSteps: 7,

  // Actions
  setExperience: (experience) =>
    set((state) => {
      state.data.experience = experience;
    }),

  setCurrentGrade: (grades) =>
    set((state) => {
      state.data.currentGrade = grades;
    }),

  setGoals: (goals) =>
    set((state) => {
      state.data.goals = goals;
    }),

  setEquipment: (equipment) =>
    set((state) => {
      state.data.equipment = equipment;
    }),

  setTrainingAvailability: (availability) =>
    set((state) => {
      state.data.trainingAvailability = availability;
    }),

  setInjuries: (injuries) =>
    set((state) => {
      state.data.injuries = injuries;
    }),

  setPreferredStyle: (style) =>
    set((state) => {
      state.data.preferredStyle = style;
    }),

  // Navigation
  nextStep: () =>
    set((state) => {
      if (state.currentStep < state.totalSteps - 1) {
        state.currentStep += 1;
      }
    }),

  previousStep: () =>
    set((state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    }),

  setCurrentStep: (step) =>
    set((state) => {
      state.currentStep = Math.max(0, Math.min(step, state.totalSteps - 1));
    }),

  // Persistence
  completeOnboarding: () =>
    set((state) => {
      state.data.completed = true;
    }),

  resetOnboarding: () =>
    set((state) => {
      state.data = initialOnboardingData;
      state.currentStep = 0;
    }),
});