import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TrainingPlanService } from '@/lib/services/trainingPlanService';
import { useAuth } from '../useAuth';

export const useInitializeProgress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      await TrainingPlanService.initializeProgressForAllPlans(user.uid);
    },
    onSuccess: () => {
      console.log('✅ Progress data initialized successfully');
      // Invalidate and refetch training plans
      queryClient.invalidateQueries({ queryKey: ['training-plans', user?.uid] });
    },
    onError: (error) => {
      console.error('❌ Error initializing progress data:', error);
    },
  });
};