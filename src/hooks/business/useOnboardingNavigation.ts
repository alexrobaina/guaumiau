import { useCallback } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../useAuth';

export const useOnboardingNavigation = () => {
  const { isAuthenticated } = useAuth();

  const navigateToLogin = useCallback(() => {
    console.log('🔐 Navigating to login from onboarding...');
    router.replace('/(auth)/login');
  }, []);

  const shouldShowLoginOption = !isAuthenticated;

  return {
    navigateToLogin,
    shouldShowLoginOption,
    isAuthenticated,
  };
};