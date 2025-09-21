import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FirestoreService } from '@/lib/firebase/firestore';
import { OnboardingData } from '@/store/slices/onboarding.slice';

export const useSaveOnboardingData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (onboardingData: OnboardingData) => {
      return await FirestoreService.saveOnboardingData(onboardingData);
    },
    onSuccess: (userData) => {
      console.log('✅ Onboarding data saved to Firebase');

      // Invalidate user profile queries
      queryClient.invalidateQueries({
        queryKey: ['user', 'profile', userData.userId]
      });
      queryClient.invalidateQueries({
        queryKey: ['onboarding']
      });
    },
    onError: (error) => {
      console.error('❌ Failed to save onboarding data to Firebase:', error);
    },
    retry: 1,
    retryDelay: 1000,
  });
};