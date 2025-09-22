import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TrainingPlanService, TrainingPlan, CustomExercise } from '@/lib/services/trainingPlanService';
import { useAuth } from '../useAuth';

// Training Plan Mutations
export const useCreateTrainingPlan = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (planData: Omit<TrainingPlan, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) =>
      TrainingPlanService.createTrainingPlan({
        ...planData,
        userId: user?.uid || '',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-plans'] });
      console.log('✅ Training plan created successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to create training plan:', error);
    },
  });
};

export const useUpdateTrainingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, updates }: { planId: string; updates: Partial<TrainingPlan> }) =>
      TrainingPlanService.updateTrainingPlan(planId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['training-plans'] });
      queryClient.invalidateQueries({ queryKey: ['training-plan', variables.planId] });
      console.log('✅ Training plan updated successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to update training plan:', error);
    },
  });
};

export const useDeleteTrainingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => TrainingPlanService.deleteTrainingPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-plans'] });
      console.log('✅ Training plan deleted successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to delete training plan:', error);
    },
  });
};

export const useDuplicateTrainingPlan = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ planId, newName }: { planId: string; newName?: string }) =>
      TrainingPlanService.duplicateTrainingPlan(planId, user?.uid || '', newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-plans'] });
      console.log('✅ Training plan duplicated successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to duplicate training plan:', error);
    },
  });
};

export const useActivateTrainingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => TrainingPlanService.activateTrainingPlan(planId),
    onSuccess: (_, planId) => {
      queryClient.invalidateQueries({ queryKey: ['training-plans'] });
      queryClient.invalidateQueries({ queryKey: ['training-plan', planId] });
      console.log('✅ Training plan activated successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to activate training plan:', error);
    },
  });
};

export const useCompleteTrainingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => TrainingPlanService.completeTrainingPlan(planId),
    onSuccess: (_, planId) => {
      queryClient.invalidateQueries({ queryKey: ['training-plans'] });
      queryClient.invalidateQueries({ queryKey: ['training-plan', planId] });
      console.log('✅ Training plan completed successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to complete training plan:', error);
    },
  });
};

export const useRepeatTrainingPlan = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (planId: string) => TrainingPlanService.repeatTrainingPlan(planId, user?.uid || ''),
    onSuccess: (newPlanId) => {
      queryClient.invalidateQueries({ queryKey: ['training-plans'] });
      queryClient.invalidateQueries({ queryKey: ['training-plan', newPlanId] });
      console.log('✅ Training plan repeated successfully with new ID:', newPlanId);
    },
    onError: (error) => {
      console.error('❌ Failed to repeat training plan:', error);
    },
  });
};

export const useResetTrainingPlan = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (planId: string) => TrainingPlanService.resetTrainingPlan(planId, user?.uid || ''),
    onSuccess: (_, planId) => {
      queryClient.invalidateQueries({ queryKey: ['training-plans'] });
      queryClient.invalidateQueries({ queryKey: ['training-plan', planId] });
      console.log('✅ Training plan reset successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to reset training plan:', error);
    },
  });
};

// Custom Exercise Mutations
export const useCreateCustomExercise = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (exerciseData: Omit<CustomExercise, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'isCustom'>) =>
      TrainingPlanService.createCustomExercise({
        ...exerciseData,
        userId: user?.uid || '',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-exercises'] });
      console.log('✅ Custom exercise created successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to create custom exercise:', error);
    },
  });
};

export const useUpdateCustomExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ exerciseId, updates }: { exerciseId: string; updates: Partial<CustomExercise> }) =>
      TrainingPlanService.updateCustomExercise(exerciseId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-exercises'] });
      console.log('✅ Custom exercise updated successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to update custom exercise:', error);
    },
  });
};

export const useDeleteCustomExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exerciseId: string) => TrainingPlanService.deleteCustomExercise(exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-exercises'] });
      console.log('✅ Custom exercise deleted successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to delete custom exercise:', error);
    },
  });
};