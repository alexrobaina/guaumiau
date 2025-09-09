import React, { createContext, useContext, useEffect } from 'react';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';
import { useStore } from '@/store';

interface ThemeContextType {
  colorScheme: ColorSchemeName;
  setColorScheme: (scheme: 'light' | 'dark' | 'system') => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const { mode, setMode, syncWithSystem } = useStore();

  useEffect(() => {
    // Sync with system preference changes
    const subscription = Appearance.addChangeListener(() => {
      syncWithSystem();
    });

    return () => subscription.remove();
  }, [syncWithSystem]);

  // Determine the actual color scheme based on mode
  const getActualColorScheme = (): ColorSchemeName => {
    if (mode === 'system') {
      return systemColorScheme;
    }
    return mode;
  };

  const colorScheme = getActualColorScheme();

  const setColorSchemeHandler = (scheme: 'light' | 'dark' | 'system') => {
    setMode(scheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        setColorScheme: setColorSchemeHandler,
        isDark: colorScheme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// Hook for easier theme-based styling
export const useThemedStyles = <T extends Record<string, any>>(
  lightStyles: T,
  darkStyles: T
): T => {
  const { isDark } = useTheme();
  return isDark ? darkStyles : lightStyles;
};
