# CruxClimb - Complete Technical Architecture Documentation

## Table of Contents

1. [Technology Stack Overview](#technology-stack-overview)
2. [Expo Configuration](#expo-configuration)
3. [React Query Implementation](#react-query-implementation)
4. [Zustand State Management](#zustand-state-management)
5. [Firebase Architecture](#firebase-architecture)
6. [Styling with React Native StyleSheet](#styling-with-react-native-stylesheet)
7. [Color System & Dark Mode](#color-system--dark-mode)
8. [Form Management with Formik & Yup](#form-management-with-formik--yup)
9. [API Layer with Axios](#api-layer-with-axios)
10. [React Native SVG Implementation](#react-native-svg-implementation)
11. [Victory Native Charts](#victory-native-charts)
12. [Error Boundaries](#error-boundaries)
13. [Atomic Design Pattern](#atomic-design-pattern)
14. [Integration Patterns](#integration-patterns)

---

## Technology Stack Overview

### Core Technologies

| Technology              | Version  | Purpose                                             |
| ----------------------- | -------- | --------------------------------------------------- |
| Expo                    | SDK 51   | React Native framework with managed workflow        |
| React Native            | 0.74     | Mobile application framework                        |
| TypeScript              | 5.3+     | Type safety and better DX                           |
| React Query             | 5.0+     | Server state management                             |
| Zustand                 | 4.5+     | Client state management                             |
| Firebase                | 10.7+    | Backend services (Auth, Firestore, Storage)         |
| React Native StyleSheet | Built-in | Native styling system with performance optimization |
| Formik                  | 2.4+     | Form state management                               |
| Yup                     | 1.3+     | Schema validation                                   |
| Axios                   | 1.6+     | HTTP client with interceptors                       |
| React Native SVG        | 14.0+    | SVG support and icons                               |
| Victory Native          | 36.0+    | Data visualization charts                           |

### Architecture Principles

- **Atomic Design**: Component hierarchy (atoms → molecules → organisms → templates → pages)
- **Separation of Concerns**: Server state (React Query) vs Client state (Zustand)
- **Type Safety**: Full TypeScript coverage with strict mode
- **Performance First**: Optimized re-renders and lazy loading
- **Offline First**: Cache-first approach with background sync
- **Theme Consistency**: Centralized design tokens with StyleSheet

---

## Expo Configuration

### Project Setup

```json
// app.json
{
  "expo": {
    "name": "CruxClimb",
    "slug": "cruxclimb",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "cruxclimb",
    "userInterfaceStyle": "automatic",
    "platforms": ["ios", "android"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "app.cruxclimb.mobile",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "Used for recording climbing videos",
        "NSPhotoLibraryUsageDescription": "Used for saving climbing photos"
      }
    },
    "android": {
      "package": "app.cruxclimb.mobile",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FF6B35"
      },
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    "plugins": [
      "expo-router",
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### Environment Configuration

```typescript
// lib/config/environment.ts
import Constants from 'expo-constants';

interface Environment {
  apiUrl: string;
  firebaseConfig: FirebaseOptions;
  enableAnalytics: boolean;
  enableCrashlytics: boolean;
}

const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000',
    firebaseConfig: {
      /* dev config */
    },
    enableAnalytics: false,
    enableCrashlytics: false,
  },
  staging: {
    apiUrl: 'https://staging-api.cruxclimb.app',
    firebaseConfig: {
      /* staging config */
    },
    enableAnalytics: true,
    enableCrashlytics: true,
  },
  prod: {
    apiUrl: 'https://api.cruxclimb.app',
    firebaseConfig: {
      /* prod config */
    },
    enableAnalytics: true,
    enableCrashlytics: true,
  },
};

const getEnvironment = (): Environment => {
  const releaseChannel = Constants.expoConfig?.extra?.releaseChannel;

  if (releaseChannel === 'production') return ENV.prod;
  if (releaseChannel === 'staging') return ENV.staging;
  return ENV.dev;
};

export const Config = getEnvironment();
```

---

## React Query Implementation

### Configuration with Axios Integration

```typescript
// lib/query/queryClient.ts
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { showErrorToast } from '@/lib/utils/toast';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Global error handling for queries
      if (query.state.data !== undefined) {
        showErrorToast(`Background refetch failed: ${error.message}`);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: error => {
      // Global error handling for mutations
      showErrorToast(`Operation failed: ${error.message}`);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 404) return false;
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 2,
      retryDelay: 1000,
    },
  },
});

// Network status observer
NetInfo.addEventListener(state => {
  if (state.isConnected && state.isInternetReachable) {
    queryClient.resumePausedMutations();
    queryClient.invalidateQueries();
  }
});
```

### Query Hooks with Axios

```typescript
// hooks/queries/useWorkouts.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import type { Workout, WorkoutFilters } from '@/types';

// Query Keys Factory
export const workoutKeys = {
  all: ['workouts'] as const,
  lists: () => [...workoutKeys.all, 'list'] as const,
  list: (filters: WorkoutFilters) => [...workoutKeys.lists(), filters] as const,
  details: () => [...workoutKeys.all, 'detail'] as const,
  detail: (id: string) => [...workoutKeys.details(), id] as const,
};

// Fetch Workouts with Pagination
export const useWorkouts = (filters: WorkoutFilters = {}) => {
  return useInfiniteQuery({
    queryKey: workoutKeys.list(filters),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get('/workouts', {
        params: {
          ...filters,
          page: pageParam,
          limit: 20,
        },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });
};

// Create Workout with Optimistic Update
export const useCreateWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workout: Omit<Workout, 'id'>) =>
      api.post<Workout>('/workouts', workout),

    onMutate: async newWorkout => {
      await queryClient.cancelQueries({ queryKey: workoutKeys.lists() });

      const previousWorkouts = queryClient.getQueryData(workoutKeys.lists());

      queryClient.setQueryData(workoutKeys.lists(), (old: any) => {
        return {
          ...old,
          pages: [
            {
              items: [{ ...newWorkout, id: 'temp-id' }, ...old.pages[0].items],
              ...old.pages[0],
            },
            ...old.pages.slice(1),
          ],
        };
      });

      return { previousWorkouts };
    },

    onError: (err, newWorkout, context) => {
      queryClient.setQueryData(workoutKeys.lists(), context?.previousWorkouts);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.lists() });
    },
  });
};
```

---

## Zustand State Management

### Store Architecture with TypeScript

```typescript
// store/index.ts
import { create } from 'zustand';
import { devtools, subscribeWithSelector, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAuthSlice, AuthSlice } from './slices/auth.slice';
import { createUISlice, UISlice } from './slices/ui.slice';
import { createWorkoutSlice, WorkoutSlice } from './slices/workout.slice';
import { createThemeSlice, ThemeSlice } from './slices/theme.slice';

export type RootState = AuthSlice & UISlice & WorkoutSlice & ThemeSlice;

export const useStore = create<RootState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((...args) => ({
          ...createAuthSlice(...args),
          ...createUISlice(...args),
          ...createWorkoutSlice(...args),
          ...createThemeSlice(...args),
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
        partialize: state => ({
          user: state.user,
          theme: state.theme,
        }),
      }
    ),
    {
      name: 'cruxclimb-store',
    }
  )
);
```

### Theme Slice for Dark Mode

```typescript
// store/slices/theme.slice.ts
import { StateCreator } from 'zustand';
import { Appearance, ColorSchemeName } from 'react-native';

export interface ThemeSlice {
  mode: 'light' | 'dark' | 'system';
  colorScheme: ColorSchemeName;
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  syncWithSystem: () => void;
}

export const createThemeSlice: StateCreator<
  ThemeSlice,
  [['zustand/immer', never]],
  [],
  ThemeSlice
> = (set, get) => ({
  mode: 'system',
  colorScheme: Appearance.getColorScheme(),

  setMode: mode =>
    set(state => {
      state.mode = mode;
      state.colorScheme =
        mode === 'system' ? Appearance.getColorScheme() : mode;
    }),

  syncWithSystem: () =>
    set(state => {
      if (state.mode === 'system') {
        state.colorScheme = Appearance.getColorScheme();
      }
    }),
});
```

---

## Firebase Architecture

### Service Layer with Axios Fallback

```typescript
// lib/firebase/services/base.service.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config';
import { api } from '@/lib/api/axios';

export abstract class BaseService<T extends { id: string }> {
  protected collectionName: string;
  protected useApi: boolean = false; // Fallback to REST API

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected get collectionRef() {
    return collection(db, this.collectionName);
  }

  async get(id: string): Promise<T | null> {
    if (this.useApi) {
      const { data } = await api.get<T>(`/${this.collectionName}/${id}`);
      return data;
    }

    const docRef = doc(this.collectionRef, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return this.fromFirestore(docSnap);
    }
    return null;
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    if (this.useApi) {
      const { data: created } = await api.post<T>(
        `/${this.collectionName}`,
        data
      );
      return created;
    }

    const docRef = doc(this.collectionRef);
    const timestamp = Timestamp.now();

    await setDoc(docRef, {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return {
      ...data,
      id: docRef.id,
      createdAt: timestamp.toDate(),
      updatedAt: timestamp.toDate(),
    } as T;
  }

  protected fromFirestore(doc: any): T {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as T;
  }
}
```

---

## Styling with React Native StyleSheet

### Design System Colors

CruxClimb uses a comprehensive color system optimized for climbing applications. All colors are defined as constants for consistency across the app.

```typescript
// lib/styles/colors.ts
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

  // Dark mode specific
  dark: {
    bg: '#0F0F0F',
    surface: '#1A1A1A',
    border: '#2A2A2A',
  },
} as const;
```

### StyleSheet-Based Component Styling

CruxClimb uses React Native's StyleSheet API for all component styling. This approach provides better performance, type safety, and consistency compared to inline styles.

#### Button Component Example

```typescript
// components/atoms/Button/Button.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, PressableProps } from 'react-native';
import { Colors } from '@/lib/styles/colors';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  style,
  ...props
}) => {
  return (
    <Pressable
      style={[
        styles.base,
        styles[`${variant}Button`],
        styles[`${size}Button`],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      {...props}
    >
      <Text style={[
        styles.baseText,
        styles[`${variant}Text`],
        styles[`${size}Text`],
      ]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Base styles
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 0,
  },

  baseText: {
    fontWeight: '600',
    textAlign: 'center',
  },

  // Variant styles
  primaryButton: {
    backgroundColor: Colors.primary[500],
  },
  primaryText: {
    color: '#FFFFFF',
  },

  secondaryButton: {
    backgroundColor: Colors.secondary[500],
  },
  secondaryText: {
    color: '#FFFFFF',
  },

  tertiaryButton: {
    backgroundColor: Colors.tertiary[500],
  },
  tertiaryText: {
    color: '#000000',
  },

  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: Colors.gray[900],
  },

  dangerButton: {
    backgroundColor: Colors.error,
  },
  dangerText: {
    color: '#FFFFFF',
  },

  // Size styles
  smButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  smText: {
    fontSize: 14,
  },

  mdButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  mdText: {
    fontSize: 16,
  },

  lgButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  lgText: {
    fontSize: 18,
  },

  xlButton: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  xlText: {
    fontSize: 20,
  },

  // Modifiers
  fullWidth: {
    width: '100%',
  },

  disabled: {
    opacity: 0.5,
  },
});
```

#### Card Component Example

```typescript
// components/atoms/Card/Card.tsx
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '@/lib/styles/colors';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'filled' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'md',
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        styles[`${padding}Padding`],
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
  },

  // Variant styles
  elevated: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  filled: {
    backgroundColor: Colors.gray[100],
  },

  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },

  // Padding styles
  nonePadding: {
    padding: 0,
  },

  smPadding: {
    padding: 8,
  },

  mdPadding: {
    padding: 16,
  },

  lgPadding: {
    padding: 24,
  },
});
```

### Typography System

```typescript
// components/atoms/Text/Text.tsx
import React from 'react';
import { Text as RNText, StyleSheet, TextProps } from 'react-native';
import { Colors } from '@/lib/styles/colors';

interface CustomTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
  color?: 'default' | 'primary' | 'secondary' | 'tertiary' | 'muted' | 'error' | 'success';
}

export const Text: React.FC<CustomTextProps> = ({
  variant = 'body',
  color = 'default',
  style,
  ...props
}) => {
  return (
    <RNText
      style={[
        styles.base,
        styles[variant],
        styles[`${color}Color`],
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System', // Use platform default
  },

  // Typography variants
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },

  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
  },

  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },

  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },

  body: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
  },

  caption: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },

  // Color variants
  defaultColor: {
    color: Colors.gray[900],
  },

  primaryColor: {
    color: Colors.primary[500],
  },

  secondaryColor: {
    color: Colors.secondary[500],
  },

  tertiaryColor: {
    color: Colors.tertiary[500],
  },

  mutedColor: {
    color: Colors.gray[500],
  },

  errorColor: {
    color: Colors.error,
  },

  successColor: {
    color: Colors.success,
  },
});
```

### Dark Mode Implementation

Dark mode is handled through the theme context and conditional styling:

```typescript
// lib/hooks/useColorScheme.ts
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  const colorScheme = useRNColorScheme();
  return colorScheme ?? 'light';
}

// Usage in components
const isDark = useColorScheme() === 'dark';

const styles = StyleSheet.create({
  container: {
    backgroundColor: isDark ? Colors.dark.bg : '#FFFFFF',
  },
  text: {
    color: isDark ? Colors.gray[100] : Colors.gray[900],
  },
});
```

---

## Color System & Dark Mode

### Theme Provider with React Native

The theme system integrates with Zustand store and React Native's built-in dark mode detection:

```typescript
// providers/ThemeProvider.tsx
import React, { createContext, useContext, useEffect } from "react";
import { Appearance, ColorSchemeName, useColorScheme } from "react-native";
import { useStore } from "@/store";

interface ThemeContextType {
  colorScheme: ColorSchemeName;
  setColorScheme: (scheme: "light" | "dark" | "system") => void;
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
  }, []);

  // Determine the actual color scheme based on mode
  const getActualColorScheme = (): ColorSchemeName => {
    if (mode === "system") {
      return systemColorScheme;
    }
    return mode;
  };

  const colorScheme = getActualColorScheme();

  const setColorScheme = (scheme: "light" | "dark" | "system") => {
    setMode(scheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        setColorScheme,
        isDark: colorScheme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
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
```

---

## Form Management with Formik & Yup

### Form Validation Schemas

```typescript
// lib/validation/schemas.ts
import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const workoutSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Workout name must be at least 3 characters')
    .max(50, 'Workout name must be less than 50 characters')
    .required('Workout name is required'),
  description: yup
    .string()
    .max(500, 'Description must be less than 500 characters'),
  difficulty: yup
    .string()
    .oneOf(['beginner', 'intermediate', 'advanced', 'elite'])
    .required('Difficulty is required'),
  duration: yup
    .number()
    .min(5, 'Duration must be at least 5 minutes')
    .max(180, 'Duration must be less than 3 hours')
    .required('Duration is required'),
  exercises: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Exercise name is required'),
        sets: yup.number().min(1).max(10),
        reps: yup.number().min(1).max(100),
        duration: yup.number().min(1).max(600),
        rest: yup.number().min(0).max(600),
      })
    )
    .min(1, 'At least one exercise is required'),
});
```

### Formik Form Component

```typescript
// components/forms/LoginForm.tsx
import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Formik, FormikHelpers } from "formik";
import { loginSchema } from "@/lib/validation/schemas";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { useLogin } from "@/hooks/mutations/useAuth";
import { text, button } from "@/lib/styles/variants";

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting, setErrors }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      await login(values);
    } catch (error: any) {
      setErrors({ email: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <Input
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={touched.email && errors.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>
                {errors.email}
              </Text>
            )}
          </View>

          <View>
            <Text style={styles.label}>Password</Text>
            <Input
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              placeholder="••••••••"
              secureTextEntry
              error={touched.password && errors.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>
                {errors.password}
              </Text>
            )}
          </View>

          <Button
            onPress={() => handleSubmit()}
            disabled={isSubmitting || isPending}
            style={styles.submitButton}
          >
            {isSubmitting || isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              "Login"
            )}
          </Button>
        </View>
      )}
    </Formik>
  );
};
```

---

## API Layer with Axios

### Axios Configuration with Interceptors

```typescript
// lib/api/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '@/lib/config/environment';
import { useStore } from '@/store';
import { router } from 'expo-router';

// Create axios instance
export const api = axios.create({
  baseURL: Config.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for timeout handling
    config.metadata = { startTime: new Date().getTime() };

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  response => {
    // Log request duration in development
    if (__DEV__) {
      const duration =
        new Date().getTime() - response.config.metadata.startTime;
      console.log(
        `${response.config.method?.toUpperCase()} ${
          response.config.url
        } - ${duration}ms`
      );
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 - Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (refreshToken) {
          const { data } = await axios.post(`${Config.apiUrl}/auth/refresh`, {
            refreshToken,
          });

          await AsyncStorage.setItem('accessToken', data.accessToken);
          await AsyncStorage.setItem('refreshToken', data.refreshToken);

          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        useStore.getState().logout();
        router.replace('/login');
      }
    }

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

// Typed API methods
export const apiClient = {
  get: <T = any>(url: string, config?: any) =>
    api.get<T>(url, config).then(res => res.data),

  post: <T = any>(url: string, data?: any, config?: any) =>
    api.post<T>(url, data, config).then(res => res.data),

  put: <T = any>(url: string, data?: any, config?: any) =>
    api.put<T>(url, data, config).then(res => res.data),

  patch: <T = any>(url: string, data?: any, config?: any) =>
    api.patch<T>(url, data, config).then(res => res.data),

  delete: <T = any>(url: string, config?: any) =>
    api.delete<T>(url, config).then(res => res.data),
};
```

---

## React Native SVG Implementation

### SVG Icon System

```typescript
// components/atoms/Icon.tsx
import React from "react";
import Svg, { Path, G, Circle, Rect, SvgProps } from "react-native-svg";
import { useTheme } from "@/providers/ThemeProvider";

// Icon type definitions
export type IconName =
  | "home"
  | "workout"
  | "timer"
  | "chart"
  | "user"
  | "settings"
  | "climbing"
  | "boulder"
  | "rope";

interface IconProps extends SvgProps {
  name: IconName;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  ...props
}) => {
  const { isDark } = useTheme();
  const defaultColor = color || (isDark ? "#FFFFFF" : "#000000");

  const icons: Record<IconName, React.ReactElement> = {
    home: (
      <G>
        <Path
          d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
          stroke={defaultColor}
          strokeWidth={2}
          fill="none"
        />
        <Path
          d="M9 22V12h6v10"
          stroke={defaultColor}
          strokeWidth={2}
          fill="none"
        />
      </G>
    ),
    climbing: (
      <G>
        <Circle cx="12" cy="5" r="2" fill={defaultColor} />
        <Path
          d="M12 7v6l-2 4v5m2-5l2 4v5m-2-9l3-3m-6 0l-3-3"
          stroke={defaultColor}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      </G>
    ),
    boulder: (
      <G>
        <Path
          d="M8 16L4 12L8 8L12 12L16 8L20 12L16 16L12 20L8 16Z"
          fill={defaultColor}
          opacity={0.8}
        />
        <Circle cx="12" cy="12" r="2" fill="white" />
      </G>
    ),
    // ... more icons
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
      {icons[name]}
    </Svg>
  );
};
```

### Custom SVG Charts

```typescript
// components/molecules/GradeChart.tsx
import React from "react";
import { View } from "react-native";
import Svg, { Rect, Text as SvgText, G } from "react-native-svg";
import { useTheme } from "@/providers/ThemeProvider";

interface GradeData {
  grade: string;
  attempts: number;
  sends: number;
}

interface GradeChartProps {
  data: GradeData[];
  width: number;
  height: number;
}

export const GradeChart: React.FC<GradeChartProps> = ({
  data,
  width,
  height,
}) => {
  const { isDark } = useTheme();
  const barWidth = width / data.length - 10;
  const maxValue = Math.max(...data.map((d) => d.attempts));

  return (
    <View>
      <Svg width={width} height={height}>
        {data.map((item, index) => {
          const barHeight = (item.attempts / maxValue) * (height - 40);
          const sendHeight = (item.sends / maxValue) * (height - 40);
          const x = index * (barWidth + 10) + 5;
          const y = height - barHeight - 20;

          return (
            <G key={item.grade}>
              {/* Attempts bar */}
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={isDark ? "#FF7B47" : "#FF6B35"}
                opacity={0.3}
                rx={4}
              />

              {/* Sends bar */}
              <Rect
                x={x}
                y={height - sendHeight - 20}
                width={barWidth}
                height={sendHeight}
                fill={isDark ? "#FF7B47" : "#FF6B35"}
                rx={4}
              />

              {/* Grade label */}
              <SvgText
                x={x + barWidth / 2}
                y={height - 5}
                fontSize="12"
                fill={isDark ? "#E5E5E5" : "#5A5A5A"}
                textAnchor="middle"
              >
                {item.grade}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
};
```

---

## Victory Native Charts

### Chart Configuration

```typescript
// components/organisms/ProgressChart.tsx
import React from "react";
import { View, useWindowDimensions } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryArea,
  VictoryScatter,
  VictoryContainer,
  VictoryLabel,
  VictoryTooltip,
} from "victory-native";
import { useTheme } from "@/providers/ThemeProvider";
import { text } from "@/lib/styles/variants";

interface DataPoint {
  date: Date;
  value: number;
  label?: string;
}

interface ProgressChartProps {
  data: DataPoint[];
  title: string;
  yLabel: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title,
  yLabel,
}) => {
  const { width } = useWindowDimensions();
  const { isDark } = useTheme();

  const chartTheme = {
    ...VictoryTheme.material,
    axis: {
      style: {
        axis: { stroke: isDark ? "#5A5A5A" : "#D4D4D4" },
        tickLabels: {
          fill: isDark ? "#E5E5E5" : "#5A5A5A",
          fontSize: 12,
        },
        grid: {
          stroke: isDark ? "#2A2A2A" : "#E5E5E5",
          strokeDasharray: "5,5",
        },
      },
    },
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>

      <VictoryChart
        theme={chartTheme}
        width={width - 32}
        height={250}
        padding={{ left: 60, top: 20, right: 40, bottom: 60 }}
        containerComponent={<VictoryContainer responsive={false} />}
      >
        <VictoryAxis
          dependentAxis
          label={yLabel}
          style={{
            axisLabel: {
              padding: 35,
              fontSize: 14,
              fill: isDark ? "#E5E5E5" : "#5A5A5A",
            },
          }}
        />

        <VictoryAxis
          fixLabelOverlap
          style={{
            axisLabel: {
              padding: 35,
              fontSize: 14,
              fill: isDark ? "#E5E5E5" : "#5A5A5A",
            },
          }}
        />

        <VictoryArea
          data={data}
          x="date"
          y="value"
          style={{
            data: {
              fill: isDark ? "#FF7B4740" : "#FF6B3540",
              stroke: isDark ? "#FF7B47" : "#FF6B35",
              strokeWidth: 2,
            },
          }}
          interpolation="catmullRom"
        />

        <VictoryScatter
          data={data}
          x="date"
          y="value"
          size={4}
          style={{
            data: { fill: isDark ? "#FF7B47" : "#FF6B35" },
          }}
          labelComponent={
            <VictoryTooltip
              renderInPortal={false}
              flyoutStyle={{
                fill: isDark ? "#1A1A1A" : "#FFFFFF",
                stroke: isDark ? "#2A2A2A" : "#E5E5E5",
              }}
              style={{
                fill: isDark ? "#E5E5E5" : "#5A5A5A",
              }}
            />
          }
          labels={({ datum }) => datum.label || `${datum.value}`}
        />
      </VictoryChart>
    </View>
  );
};
```

---

## Error Boundaries

### Global Error Boundary

```typescript
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import * as Sentry from "@sentry/react-native";
import { button, text, card } from "@/lib/styles/variants";
import { Icon } from "@/components/atoms/Icon";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to Sentry in production
    if (!__DEV__) {
      Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }

    // Log to console in development
    if (__DEV__) {
      console.error("Error Boundary caught:", error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <View style={styles.errorHeader}>
              <Icon name="error" size={64} color="#EF4444" />
              <Text style={styles.errorTitle}>
                Oops! Something went wrong
              </Text>
            </View>

            <Text style={styles.errorMessage}>
              We're sorry, but something unexpected happened. Please try
              refreshing the app or contact support if the problem persists.
            </Text>

            {__DEV__ && (
              <ScrollView style={styles.errorDetails}>
                <Text style={styles.errorDetailsText}>
                  {this.state.error?.toString()}
                </Text>
                <Text style={styles.errorDetailsText}>
                  {this.state.errorInfo?.componentStack}
                </Text>
              </ScrollView>
            )}

            <View style={styles.errorActions}>
              <Pressable
                onPress={this.handleReset}
                style={styles.retryButton}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </Pressable>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

// Hook for function components
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = () => setError(null);

  const captureError = (error: Error) => {
    setError(error);
  };

  if (error) {
    throw error;
  }

  return { captureError, resetError };
};
```

---

## Atomic Design Pattern

### Folder Structure

```
components/
├── atoms/                 # Basic building blocks
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Text.tsx
│   ├── Icon.tsx
│   ├── Badge.tsx
│   └── Avatar.tsx
├── molecules/            # Combinations of atoms
│   ├── Card.tsx
│   ├── ListItem.tsx
│   ├── FormField.tsx
│   ├── Timer.tsx
│   ├── SearchBar.tsx
│   └── TabBar.tsx
├── organisms/            # Complex components
│   ├── WorkoutCard.tsx
│   ├── ExerciseList.tsx
│   ├── UserProfile.tsx
│   ├── ProgressChart.tsx
│   ├── NavigationDrawer.tsx
│   └── ActivityFeed.tsx
├── templates/            # Page layouts
│   ├── AuthLayout.tsx
│   ├── TabLayout.tsx
│   ├── ScrollLayout.tsx
│   └── ModalLayout.tsx
└── pages/               # Complete screens
    ├── LoginPage.tsx
    ├── DashboardPage.tsx
    ├── WorkoutPage.tsx
    └── ProfilePage.tsx
```

### Atom Example

```typescript
// components/atoms/Button.tsx
import React from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  PressableProps,
} from "react-native";
import { button } from "@/lib/styles/variants";
// Component props types

type ButtonVariants = VariantProps<typeof button>;

interface ButtonProps extends PressableProps, ButtonVariants {
  children: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  color = "primary",
  size = "md",
  variant = "solid",
  disabled = false,
  fullWidth = false,
  style,
  ...props
}) => {
  return (
    <Pressable
      disabled={disabled || loading}
      style={[styles.button,
        color,
        size,
        variant,
        disabled,
        fullWidth,
        style,
      })}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : typeof children === "string" ? (
        <Text style={styles.buttonText}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};
```

### Molecule Example

```typescript
// components/molecules/WorkoutTimer.tsx
import React, { useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { useStore } from "@/store";
import { card, text } from "@/lib/styles/variants";

interface WorkoutTimerProps {
  duration: number;
  onComplete?: () => void;
}

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  duration,
  onComplete,
}) => {
  const { timer, startTimer, pauseTimer, resumeTimer } = useStore();

  useEffect(() => {
    startTimer(duration);
    return () => pauseTimer();
  }, [duration]);

  useEffect(() => {
    if (timer.remaining === 0 && timer.duration > 0) {
      onComplete?.();
    }
  }, [timer.remaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.centered}>
        <Text style={styles.heading}>
          {formatTime(timer.remaining)}
        </Text>

        <View style={styles.buttonRow}>
          {timer.isRunning ? (
            <Button onPress={pauseTimer} color="secondary" size="lg">
              <Icon name="pause" color="white" />
            </Button>
          ) : (
            <Button onPress={resumeTimer} color="primary" size="lg">
              <Icon name="play" color="white" />
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};
```

### Organism Example

```typescript
// components/organisms/WorkoutCard.tsx
import React from "react";
import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "@/components/atoms/Text";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { WorkoutTimer } from "@/components/molecules/WorkoutTimer";
import { card, text } from "@/lib/styles/variants";
import type { Workout } from "@/types";

interface WorkoutCardProps {
  workout: Workout;
  isActive?: boolean;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  isActive = false,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/workout/${workout.id}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: "success",
      intermediate: "warning",
      advanced: "error",
      elite: "tertiary",
    };
    return colors[difficulty] || "primary";
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.elevatedCard}>
        <View style={styles.headerRow}>
          <View style={styles.flex1}>
            <Text style={styles.title}>{workout.name}</Text>
            <Text style={styles.mutedCaption}>
              {workout.description}
            </Text>
          </View>

          <Badge color={getDifficultyColor(workout.difficulty)}>
            {workout.difficulty}
          </Badge>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Icon name="timer" size={16} />
            <Text style={styles.caption}>
              {workout.duration} min
            </Text>
          </View>

          <View style={styles.statItem}>
            <Icon name="workout" size={16} />
            <Text style={styles.caption}>
              {workout.exercises.length} exercises
            </Text>
          </View>

          {workout.rating && (
            <View style={styles.statItem}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.caption}>
                {workout.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {isActive && (
          <WorkoutTimer
            duration={workout.duration * 60}
            onComplete={() => console.log("Workout completed!")}
          />
        )}
      </View>
    </Pressable>
  );
};
```

### Template Example

```typescript
// components/templates/TabLayout.tsx
import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/providers/ThemeProvider";

interface TabLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  refreshControl?: React.ReactElement;
}

export const TabLayout: React.FC<TabLayoutProps> = ({
  children,
  scrollable = true,
  padded = true,
  refreshControl,
}) => {
  const { isDark } = useTheme();

  const content = (
    <View style={[styles.flex1, padded && styles.padded]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.flex1, isDark ? styles.darkBg : styles.lightBg]}>
      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};
```

---

## Integration Patterns

### Complete Page Example

```typescript
// app/(tabs)/training.tsx
import React from "react";
import { View, RefreshControl } from "react-native";
import { TabLayout } from "@/components/templates/TabLayout";
import { WorkoutCard } from "@/components/organisms/WorkoutCard";
import { SearchBar } from "@/components/molecules/SearchBar";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { useWorkouts } from "@/hooks/queries/useWorkouts";
import { useStore } from "@/store";
import { text } from "@/lib/styles/variants";

export default function TrainingPage() {
  const user = useStore((state) => state.user);
  const [searchQuery, setSearchQuery] = React.useState("");

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWorkouts({
    difficulty: user?.profile?.experience,
    search: searchQuery,
  });

  if (isError) {
    return (
      <TabLayout scrollable={false}>
        <View style={styles.errorCenter}>
          <Text style={styles.subheading}>Something went wrong</Text>
          <Button onPress={() => refetch()} style={styles.marginTop}>
            Retry
          </Button>
        </View>
      </TabLayout>
    );
  }

  return (
    <TabLayout
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <Text style={styles.heading}>Training</Text>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search workouts..."
        style={styles.marginVertical}
      />

      <View style={styles.spaced}>
        {data?.pages.flatMap((page) =>
          page.items.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))
        )}
      </View>

      {hasNextPage && (
        <Button
          onPress={() => fetchNextPage()}
          loading={isFetchingNextPage}
          variant="outline"
          fullWidth
          style={styles.marginTop}
        >
          Load More
        </Button>
      )}
    </TabLayout>
  );
}
```

### Data Flow Example

```typescript
// Complete flow: User Action → Formik → Axios → React Query → Zustand → UI

// 1. User submits form
const handleCreateWorkout = async (values: WorkoutFormValues) => {
  try {
    // 2. Validate with Yup (automatic via Formik)

    // 3. Send to API via Axios
    const { data } = await api.post('/workouts', values);

    // 4. Update React Query cache
    queryClient.invalidateQueries({ queryKey: ['workouts'] });

    // 5. Update Zustand state if needed
    useStore.getState().setActiveWorkout(data);

    // 6. Navigate to new workout
    router.push(`/workout/${data.id}`);
  } catch (error) {
    // Error boundary will catch unhandled errors
    throw error;
  }
};
```

---

## Best Practices & Guidelines

### Performance Optimization

1. Use `React.memo` for expensive components
2. Implement `FlashList` instead of `FlatList` for large lists
3. Use `Image.prefetch` for workout images
4. Lazy load heavy components with `React.lazy`
5. Use `InteractionManager` for expensive operations

### State Management Guidelines

- **React Query**: All server state (workouts, user data from API)
- **Zustand**: Client-only state (theme, active workout, UI state)
- **Formik**: Form state management
- **React State**: Component-specific ephemeral state

### Styling Guidelines

1. Always use StyleSheet.create() for all styling
2. Use style arrays for component variants
3. Test both light and dark modes
4. Never hardcode colors - use theme tokens
5. Maintain consistent spacing with standardized values

### Error Handling Strategy

1. Wrap app with global ErrorBoundary
2. Use try-catch in async functions
3. Show user-friendly error messages
4. Log errors to Sentry in production
5. Provide retry mechanisms for failed operations

### Testing Strategy

```typescript
// Example test with React Native Testing Library
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginForm } from "@/components/forms/LoginForm";

describe("LoginForm", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  it("validates email format", async () => {
    const { getByPlaceholderText, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <LoginForm />
      </QueryClientProvider>
    );

    const emailInput = getByPlaceholderText("your@email.com");
    fireEvent.changeText(emailInput, "invalid-email");
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(getByText("Invalid email address")).toBeTruthy();
    });
  });
});
```

This comprehensive documentation provides everything needed to build CruxClimb with a modern, scalable architecture using the Atomic Design pattern, React Native StyleSheet for styling, and all requested libraries properly integrated!
