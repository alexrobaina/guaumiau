import { StateCreator } from 'zustand';
import { Equipment } from '@/types';
import { RootState } from '../types';

export interface OnboardingData {
  experience: 'beginner' | 'intermediate' | 'advanced' | 'elite' | null;
  currentGrade: {
    boulder: string;
    french: string;
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
  completeOnboarding: () => Promise<void>;
  syncOnboardingToFirebase: () => Promise<boolean>;
  resetOnboarding: () => void;
}

const initialOnboardingData: OnboardingData = {
  experience: null,
  currentGrade: {
    boulder: '',
    french: ''
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
  totalSteps: 8,

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
  completeOnboarding: async () => {
    const state = get();
    
    // Always complete onboarding locally first
    set((draft) => {
      draft.data.completed = true;
      draft.currentStep = 0; // Reset step counter for potential future use
    });
    
    try {
      // Try to save to Firebase (only works if user is authenticated)
      const { isFirebaseConfigured } = await import('@/lib/firebase/config');
      if (!isFirebaseConfigured()) {
        console.log('ℹ️ Firebase not configured, data saved locally only');
        return;
      }

      const authModule = await import('@/lib/firebase/auth');
      const firestoreModule = await import('@/lib/firebase/firestore');
      
      const AuthService = authModule.AuthService || authModule.default;
      const FirestoreService = firestoreModule.FirestoreService || firestoreModule.default;
      
      if (!AuthService || !FirestoreService) {
        console.warn('⚠️ Firebase services not properly loaded');
        return;
      }
      
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        // User is authenticated - save to Firebase
        await FirestoreService.saveOnboardingData(state.data);
        console.log('✅ Onboarding data saved to Firebase');
      } else {
        // User not authenticated - save locally only
        console.log('ℹ️ User not authenticated. Onboarding data saved locally only.');
        console.log('💡 Data will sync to Firebase when user logs in.');
      }
    } catch (error) {
      console.warn('⚠️ Failed to save onboarding data to Firebase:', error);
      // Onboarding still completed locally, just log the warning
    }
  },

  // Sync local onboarding data to Firebase (called after login)
  syncOnboardingToFirebase: async () => {
    const state = get();
    
    // Only sync if onboarding is completed locally but not synced to Firebase
    if (!state.data.completed) {
      return false; // Nothing to sync
    }
    
    try {
      // Check if Firebase is configured
      const { isFirebaseConfigured } = await import('@/lib/firebase/config');
      if (!isFirebaseConfigured()) {
        console.log('ℹ️ Firebase not configured, skipping sync');
        return false;
      }

      const authModule = await import('@/lib/firebase/auth');
      const firestoreModule = await import('@/lib/firebase/firestore');
      
      const AuthService = authModule.AuthService || authModule.default;
      const FirestoreService = firestoreModule.FirestoreService || firestoreModule.default;
      
      if (!AuthService || !FirestoreService) {
        console.warn('⚠️ Firebase services not properly loaded');
        return false;
      }
      
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        console.log('ℹ️ Cannot sync: User not authenticated');
        return false;
      }
      
      // Check if data already exists in Firebase
      const existingProfile = await FirestoreService.getUserProfile();
      if (existingProfile?.completed) {
        console.log('ℹ️ Onboarding data already exists in Firebase');
        return true;
      }
      
      // Sync local data to Firebase
      await FirestoreService.saveOnboardingData(state.data);
      console.log('✅ Local onboarding data synced to Firebase');
      return true;
    } catch (error) {
      console.warn('⚠️ Failed to sync onboarding data to Firebase:', error);
      return false;
    }
  },

  resetOnboarding: () =>
    set((state) => {
      state.data = initialOnboardingData;
      state.currentStep = 0;
    }),
});