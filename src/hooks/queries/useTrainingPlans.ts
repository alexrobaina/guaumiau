import { useQuery } from '@tanstack/react-query';
import { TrainingPlanService } from '@/lib/services/trainingPlanService';
import { useAuth } from '../useAuth';

export const useTrainingPlans = () => {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ['training-plans', user?.uid],
    queryFn: async () => {
      console.log('🎯 useTrainingPlans queryFn called', { isAuthenticated, userId: user?.uid });

      if (!isAuthenticated || !user?.uid) {
        console.log('❌ User not authenticated or no uid:', { isAuthenticated, uid: user?.uid });
        return [];
      }

      try {
        console.log('🔍 Fetching training plans for userId:', user.uid);
        const trainingPlans = await TrainingPlanService.getUserTrainingPlans(user.uid);

        console.log('📋 Training plans data:', {
          count: trainingPlans?.length || 0,
          plans: trainingPlans?.map(plan => ({
            id: plan.id,
            name: plan.name,
            status: plan.status,
            duration: plan.duration,
            createdAt: plan.createdAt,
          })),
        });

        return trainingPlans || [];
      } catch (error) {
        console.error('❌ Error fetching training plans:', error);
        // Don't throw, return empty array to prevent UI crash
        return [];
      }
    },
    enabled: isAuthenticated && !!user?.uid,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
};