import { StateCreator } from 'zustand';
import { Appearance, ColorSchemeName } from 'react-native';
import { RootState } from '../types';

export interface ThemeSlice {
  mode: 'light' | 'dark' | 'system';
  colorScheme: ColorSchemeName;
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  syncWithSystem: () => void;
}

export const createThemeSlice: StateCreator<
  RootState,
  [['zustand/immer', never]],
  [],
  ThemeSlice
> = (set, _get) => ({
  mode: 'system',
  colorScheme: Appearance.getColorScheme(),

  setMode: mode =>
    set((state: RootState) => {
      state.mode = mode;
      state.colorScheme =
        mode === 'system' ? Appearance.getColorScheme() : mode;
    }),

  syncWithSystem: () =>
    set((state: RootState) => {
      if (state.mode === 'system') {
        state.colorScheme = Appearance.getColorScheme();
      }
    }),
});
