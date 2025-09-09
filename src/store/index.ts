import { create } from 'zustand';
import { devtools, subscribeWithSelector, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAuthSlice } from './slices/auth.slice';
import { createUISlice } from './slices/ui.slice';
import { createWorkoutSlice } from './slices/workout.slice';
import { createThemeSlice } from './slices/theme.slice';
import { createOnboardingSlice } from './slices/onboarding.slice';
import { RootState } from './types';

export type { RootState };

export const useStore = create<RootState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get, api) => ({
          ...createAuthSlice(set, get, api),
          ...createUISlice(set, get, api),
          ...createWorkoutSlice(set, get, api),
          ...createThemeSlice(set, get, api),
          ...createOnboardingSlice(set, get, api),
        }))
      ),
      {
        name: 'cruxclimb-storage',
        storage: {
          getItem: async name => {
            const value = await AsyncStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          },
          setItem: async (name, value) => {
            await AsyncStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: async name => {
            await AsyncStorage.removeItem(name);
          },
        },
      }
    ),
    {
      name: 'cruxclimb-store',
    }
  )
);
