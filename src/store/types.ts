import { AuthSlice } from './slices/auth.slice';
import { OnboardingSlice } from './slices/onboarding.slice';

export type RootState = AuthSlice & OnboardingSlice;
