// Base Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User Types
export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  experience: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  preferredStyle: 'boulder' | 'sport' | 'trad' | 'gym' | 'all';
  currentGrade: {
    boulder: string;
    sport: string;
    french?: string;
  };
  goals: string[];
  equipment: Equipment[];
  trainingAvailability: {
    daysPerWeek: number;
    hoursPerSession: number;
  };
  injuries: string[];
}

export interface User extends BaseEntity {
  profile: UserProfile;
  stats: UserStats;
  subscription: SubscriptionTier;
}

export interface UserStats {
  totalWorkouts: number;
  totalClimbs: number;
  currentStreak: number;
  longestStreak: number;
  averageGrade: string;
}

// Equipment Types
export type Equipment =
  | 'fingerboard'
  | 'campus-board'
  | 'system-board'
  | 'pull-up-bar'
  | 'rings'
  | 'resistance-bands'
  | 'dumbbells'
  | 'kettlebells'
  | 'foam-roller'
  | 'lacrosse-ball'
  | 'yoga-mat'
  | 'weight-belt'
  | 'pulley-system'
  | 'gym'
  | 'none';

// Subscription Types
export type SubscriptionTier = 'free' | 'premium' | 'pro';

// Form Types
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Navigation Types (for Expo Router)
export type RootStackParamList = {
  '(tabs)': undefined;
  'profile/[id]': { id: string };
  login: undefined;
  register: undefined;
  onboarding: undefined;
};

// Theme Types
export type ColorScheme = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}