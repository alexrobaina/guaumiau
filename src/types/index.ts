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
  preferredStyle: 'boulder' | 'sport' | 'trad' | 'all';
  currentGrade: {
    boulder: string;
    sport: string;
  };
  goals: string[];
  equipment: string[];
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

// Workout Types
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  category:
    | 'fingerboard'
    | 'campus'
    | 'system'
    | 'strength'
    | 'mobility'
    | 'endurance'
    | 'power';
  sets?: number;
  reps?: number;
  duration?: number; // in seconds
  rest?: number; // in seconds
  intensity?: 'light' | 'moderate' | 'hard' | 'maximal';
  equipment: Equipment[];
  videoUrl?: string;
  imageUrl?: string;
}

export interface Workout extends BaseEntity {
  name: string;
  description?: string;
  exercises: Exercise[];
  duration: number; // estimated duration in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  equipment: Equipment[];
  creator: User;
  rating?: number;
  tags: string[];
  public: boolean;
  completions: number;
}

export interface WorkoutSession extends BaseEntity {
  workout: Workout;
  user: User;
  completedAt: Date;
  duration: number; // actual duration in minutes
  exercises: CompletedExercise[];
  notes?: string;
  rpe: number; // Rate of Perceived Exertion (1-10)
  quality: 1 | 2 | 3 | 4 | 5; // 1-5 stars
}

export interface CompletedExercise {
  exercise: Exercise;
  sets: CompletedSet[];
  notes?: string;
  skipped?: boolean;
}

export interface CompletedSet {
  reps?: number;
  weight?: number;
  duration?: number;
  rest?: number;
  rpe?: number;
  completed: boolean;
}

// Climbing Log Types
export interface ClimbingLog extends BaseEntity {
  user: User;
  date: Date;
  type: 'boulder' | 'sport' | 'trad' | 'top-rope';
  location: Location;
  climbs: Climb[];
  sessionNotes?: string;
  conditions?: string;
  partnerNames?: string[];
}

export interface Climb {
  id: string;
  name?: string;
  grade: string;
  attempts: number;
  completed: boolean;
  style: 'flash' | 'onsight' | 'redpoint' | 'repeat';
  notes?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  photos?: string[];
  videos?: string[];
}

export interface Location {
  name: string;
  type: 'indoor' | 'outdoor';
  area?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
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
  | 'none';

// Subscription Types
export type SubscriptionTier = 'free' | 'premium' | 'pro';

// Filter Types
export interface WorkoutFilters {
  difficulty?: string[];
  equipment?: Equipment[];
  duration?: {
    min: number;
    max: number;
  };
  category?: string[];
  search?: string;
}

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

export interface WorkoutFormValues {
  name: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  duration: number;
  exercises: Exercise[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
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
  'workout/[id]': { id: string };
  'climb/[id]': { id: string };
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
