import { useEffect, useState, useCallback } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../useAuth';
import { useUserOnboardingStatus } from '../queries/useUserOnboardingStatus';
import { useFirebaseConfig } from '../useFirebaseConfig';

interface HomeScreenRoutingState {
  isNavigating: boolean;
  hasNavigated: boolean;
  shouldShowLoading: boolean;
}

export const useHomeScreenRouting = () => {
  const [state, setState] = useState<HomeScreenRoutingState>({
    isNavigating: false,
    hasNavigated: false,
    shouldShowLoading: true,
  });

  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { isConfigured: isFirebaseConfigured, isLoading: configLoading } = useFirebaseConfig();

  // Only fetch onboarding status if user is authenticated
  const {
    data: onboardingStatus,
    isLoading: onboardingLoading
  } = useUserOnboardingStatus();

  const navigate = useCallback(async () => {
    console.log('🏠 HomeScreen: Starting navigation logic...');

    setState(prev => ({ ...prev, isNavigating: true }));

    try {
      // Case 1: User is not authenticated - show onboarding with login option
      if (!isAuthenticated || !user) {
        console.log('🔐 User not authenticated, navigating to onboarding...');
        router.replace('/(onboarding)/experience');
        return;
      }

      // Case 2: User is authenticated - check onboarding status
      console.log('✅ User authenticated, checking onboarding status...');

      if (onboardingStatus?.hasCompletedOnboarding) {
        console.log('📋 User completed onboarding, navigating to main app...');
        router.replace('/(tabs)');
      } else {
        console.log('📝 User needs to complete onboarding, navigating to onboarding...');
        router.replace('/(onboarding)/experience');
      }

    } catch (error) {
      console.error('❌ Error in home screen navigation:', error);
      // Fallback to onboarding on error
      router.replace('/(onboarding)/experience');
    } finally {
      setState(prev => ({
        ...prev,
        isNavigating: false,
        hasNavigated: true,
        shouldShowLoading: false
      }));
    }
  }, [isAuthenticated, user, onboardingStatus]);

  useEffect(() => {
    // Wait for all loading states to complete
    const isStillLoading = authLoading || configLoading || (isAuthenticated && onboardingLoading);

    if (isStillLoading || state.hasNavigated || state.isNavigating) {
      return;
    }

    console.log('🏠 HomeScreen: All data loaded, proceeding with navigation...', {
      isAuthenticated,
      hasUser: !!user,
      hasCompletedOnboarding: onboardingStatus?.hasCompletedOnboarding,
    });

    // Add small delay to prevent navigation loops
    const timeoutId = setTimeout(navigate, 100);
    return () => clearTimeout(timeoutId);

  }, [
    authLoading,
    configLoading,
    onboardingLoading,
    isAuthenticated,
    user,
    onboardingStatus,
    navigate,
    state.hasNavigated,
    state.isNavigating
  ]);

  return {
    shouldShowLoading: authLoading || configLoading || (isAuthenticated && onboardingLoading) || state.shouldShowLoading,
    isNavigating: state.isNavigating,
  };
};