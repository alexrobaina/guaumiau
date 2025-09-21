import { useQuery } from '@tanstack/react-query';
import { TrainingPlanService, TrainingPlan, CustomExercise } from '@/lib/services/trainingPlanService';
import { useAuth } from '../useAuth';

// Training Plan Queries
export const useTrainingPlan = (planId: string) => {
  return useQuery({
    queryKey: ['training-plan', planId],
    queryFn: () => TrainingPlanService.getTrainingPlan(planId),
    enabled: !!planId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useUserTrainingPlans = () => {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ['training-plans', user?.uid],
    queryFn: () => TrainingPlanService.getUserTrainingPlans(user?.uid || ''),
    enabled: isAuthenticated && !!user?.uid,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
};

export const useTrainingPlanTemplates = () => {
  return useQuery({
    queryKey: ['training-plan-templates'],
    queryFn: () => TrainingPlanService.getTrainingPlanTemplates(),
    staleTime: 1000 * 60 * 30, // 30 minutes (templates change less frequently)
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
};

// Custom Exercise Queries
export const useUserCustomExercises = () => {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ['custom-exercises', user?.uid],
    queryFn: () => TrainingPlanService.getUserCustomExercises(user?.uid || ''),
    enabled: isAuthenticated && !!user?.uid,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
};

// Combined hook for all exercises (database + custom)
export const useAllAvailableExercises = () => {
  const { data: customExercises, isLoading: customLoading, error: customError } = useUserCustomExercises();

  return {
    customExercises: customExercises || [],
    isLoading: customLoading,
    error: customError,
  };
};