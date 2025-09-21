import { useQuery } from '@tanstack/react-query';
import { FirestoreService } from '@/lib/firebase/firestore';
import { useAuth } from '../useAuth';

export const useUserProfile = () => {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ['user', 'profile', user?.uid],
    queryFn: async () => {
      if (!isAuthenticated || !user?.uid) {
        return null;
      }

      try {
        console.log('🔍 Fetching user profile for userId:', user.uid);
        const userProfile = await FirestoreService.getUserProfile(user.uid);

        console.log('👤 User profile data:', {
          exists: !!userProfile,
          completed: userProfile?.completed,
          experience: userProfile?.experience,
          goals: userProfile?.goals?.length,
        });

        return userProfile;
      } catch (error) {
        console.error('❌ Error fetching user profile:', error);
        throw error;
      }
    },
    enabled: isAuthenticated && !!user?.uid,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
};