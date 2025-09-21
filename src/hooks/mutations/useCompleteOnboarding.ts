import { useState } from 'react';
import { router } from 'expo-router';
import { useStore } from '@/store';
import { useSaveOnboardingData } from './useSaveOnboardingData';
import { useFirebaseConfig } from '../useFirebaseConfig';
import { useAuth } from '../useAuth';

export const useCompleteOnboarding = () => {
  const { data, markOnboardingCompleted } = useStore();
  const [isCompleting, setIsCompleting] = useState(false);

  // Custom hooks for Firebase operations
  const saveOnboardingMutation = useSaveOnboardingData();
  const { isConfigured: isFirebaseConfigured } = useFirebaseConfig();
  const { isAuthenticated, user } = useAuth();

  const completeOnboarding = async () => {
    console.log('🎯 Starting onboarding completion...');
    setIsCompleting(true);

    try {
      // Always mark onboarding as completed locally first
      markOnboardingCompleted();

      // Try to save to Firebase if configured and user is authenticated
      if (isFirebaseConfigured && isAuthenticated && user) {
        try {
          console.log('💾 Saving onboarding data to Firebase...');
          await saveOnboardingMutation.mutateAsync({
            ...data,
            completed: true,
          });
          console.log('✅ Onboarding data saved to Firebase');
        } catch (firebaseError) {
          console.warn('⚠️ Failed to save to Firebase, but onboarding completed locally:', firebaseError);
        }
      } else {
        if (!isFirebaseConfigured) {
          console.log('ℹ️ Firebase not configured, data saved locally only');
        } else if (!isAuthenticated) {
          console.log('ℹ️ User not authenticated. Onboarding data saved locally only.');
          console.log('💡 Data will sync to Firebase when user logs in.');
        }
      }

      console.log('✅ Onboarding completed successfully');

      // Navigate based on authentication status
      if (isAuthenticated && user) {
        console.log('🚀 User authenticated, navigating to main app...');
        router.replace('/(tabs)');
      } else {
        console.log('🔐 User not authenticated, redirecting to login...');
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('❌ Error completing onboarding:', error);

      // Since we always complete locally first, we can still navigate based on auth status
      if (isAuthenticated && user) {
        console.log('ℹ️ Navigating to main app despite error (onboarding saved locally)');
        router.replace('/(tabs)');
      } else {
        console.log('ℹ️ Redirecting to login despite error (onboarding saved locally)');
        router.replace('/(auth)/login');
      }
    } finally {
      setIsCompleting(false);
    }
  };

  return {
    completeOnboarding,
    isCompleting: isCompleting || saveOnboardingMutation.isPending,
  };
};