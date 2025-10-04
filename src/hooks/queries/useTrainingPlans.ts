import { useQuery } from '@tanstack/react-query';
import { TrainingPlanService } from '@/lib/services/trainingPlanService';
import { AuthService } from '@/lib/firebase/auth';
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

export const useTrainingPlanTemplates = () => {
  const currentUser = AuthService.getCurrentUser();

  return useQuery({
    queryKey: ['training-plan-templates', currentUser?.uid],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching training plan templates');

        // Fetch both user's templates and shared templates
        const [userTemplates, sharedTemplates] = await Promise.all([
          TrainingPlanService.getTrainingPlanTemplates(),
          currentUser?.uid
            ? TrainingPlanService.getSharedTemplates(currentUser.uid)
            : Promise.resolve([])
        ]);

        // Combine and deduplicate templates
        const allTemplates = [...userTemplates, ...sharedTemplates];
        const uniqueTemplates = allTemplates.filter(
          (template, index, self) =>
            index === self.findIndex(t => t.id === template.id)
        );

        console.log('📚 Templates data:', {
          userTemplates: userTemplates?.length || 0,
          sharedTemplates: sharedTemplates?.length || 0,
          total: uniqueTemplates?.length || 0,
          templates: uniqueTemplates?.map(template => ({
            id: template.id,
            name: template.name,
            difficulty: template.difficulty,
            isShared: template.sharedWith?.includes(currentUser?.uid || '') || false,
          })),
        });

        return uniqueTemplates || [];
      } catch (error) {
        console.error('❌ Error fetching templates:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
    retry: 2,
    enabled: !!currentUser?.uid,
  });
};