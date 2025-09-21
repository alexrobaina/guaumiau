import { create } from 'zustand';
import { devtools, subscribeWithSelector, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAuthSlice } from './slices/auth.slice';
import { createOnboardingSlice } from './slices/onboarding.slice';
import { RootState } from './types';

export type { RootState };

export const useStore = create<RootState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get, api) => ({
          ...createAuthSlice(set, get, api),
          ...createOnboardingSlice(set, get, api),
        }))
      ),
      {
        name: 'cruxclimb-storage',
        storage: {
          getItem: async name => {
            try {
              const value = await AsyncStorage.getItem(name);
              return value ? JSON.parse(value) : null;
            } catch (error) {
              console.warn('⚠️ Failed to get item from storage:', name, error);
              return null;
            }
          },
          setItem: async (name, value) => {
            try {
              await AsyncStorage.setItem(name, JSON.stringify(value));
            } catch (error) {
              console.warn('⚠️ Failed to set item in storage:', name, error);
            }
          },
          removeItem: async name => {
            try {
              await AsyncStorage.removeItem(name);
            } catch (error) {
              console.warn('⚠️ Failed to remove item from storage:', name, error);
            }
          },
        },
      }
    ),
    {
      name: 'cruxclimb-store',
    }
  )
);

