export const Colors = {
  // Primary Colors - Orange
  primary: {
    50: '#FFF4F0',
    100: '#FFE5D9',
    200: '#FFC4A3',
    300: '#FF9B6D',
    400: '#FF7B47',
    500: '#FF6B35', // Main brand color
    600: '#E55A26',
    700: '#CC4A1A',
    800: '#B33A0F',
    900: '#8C2D0B',
    950: '#5C1A05',
  },

  // Secondary Colors - Teal
  secondary: {
    50: '#E6F7F7',
    100: '#B3E5E5',
    200: '#80D3D3',
    300: '#4DC1C1',
    400: '#26B3B3',
    500: '#00A5A5', // Main secondary
    600: '#008F8F',
    700: '#007979',
    800: '#006363',
    900: '#004D4D',
    950: '#003333',
  },

  // Tertiary Colors - Yellow
  tertiary: {
    50: '#FFFBEB',
    100: '#FFF4C4',
    200: '#FFEC99',
    300: '#FFE066',
    400: '#FFD43B',
    500: '#FFC911', // Main accent
    600: '#E5B000',
    700: '#CC9A00',
    800: '#B38600',
    900: '#8C6900',
    950: '#5C4400',
  },

  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Climbing Hold Colors
  hold: {
    yellow: '#FFD700',
    green: '#00FF00',
    blue: '#0080FF',
    red: '#FF0000',
    purple: '#9370DB',
    orange: '#FFA500',
    pink: '#FF69B4',
    black: '#000000',
    white: '#FFFFFF',
  },

  // Neutral Colors
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },

  // Common colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Dark mode specific
  dark: {
    bg: '#0F0F0F',
    surface: '#1A1A1A',
    border: '#2A2A2A',
  },
} as const;
