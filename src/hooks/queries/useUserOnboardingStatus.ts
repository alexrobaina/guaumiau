import { useQuery } from '@tanstack/react-query';
import { FirestoreService } from '@/lib/firebase/firestore';
import { useAuth } from '../useAuth';

interface UserOnboardingStatus {
  hasCompletedOnboarding: boolean;
  userProfile: any | null;
}

export const useUserOnboardingStatus = () => {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ['user', 'onboarding-status', user?.uid],
    queryFn: async (): Promise<UserOnboardingStatus> => {
      if (!isAuthenticated || !user?.uid) {
        return {
          hasCompletedOnboarding: false,
          userProfile: null,
        };
      }

      try {
        console.log('🔍 Checking onboarding status for userId:', user.uid);

        // Check user profile and onboarding completion
        const userProfile = await FirestoreService.getUserProfile(user.uid);
        const hasCompletedOnboarding = userProfile?.completed === true;

        console.log('📋 User profile:', {
          exists: !!userProfile,
          completed: userProfile?.completed,
          userId: user.uid,
        });

        console.log('👤 Final onboarding status:', {
          hasCompletedOnboarding,
          userId: user.uid,
        });

        return {
          hasCompletedOnboarding,
          userProfile,
        };
      } catch (error) {
        console.error('❌ Error checking user onboarding status for userId:', user.uid, error);
        return {
          hasCompletedOnboarding: false,
          userProfile: null,
        };
      }
    },
    enabled: isAuthenticated && !!user?.uid,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });
};