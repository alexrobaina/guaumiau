import { AuthSlice } from './slices/auth.slice';
import { UISlice } from './slices/ui.slice';
import { WorkoutSlice } from './slices/workout.slice';
import { ThemeSlice } from './slices/theme.slice';
import { OnboardingSlice } from './slices/onboarding.slice';

export type RootState = AuthSlice & UISlice & WorkoutSlice & ThemeSlice & OnboardingSlice;
