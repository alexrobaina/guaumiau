import { useQuery } from '@tanstack/react-query';
import { WorkoutSessionService } from '@/lib/services/workoutSessionService';
import { useAuth } from '../useAuth';

export const useWorkoutSessions = () => {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ['workout-sessions', user?.uid],
    queryFn: async () => {
      if (!isAuthenticated || !user?.uid) {
        return [];
      }

      try {
        console.log('🔍 Fetching workout sessions for userId:', user.uid);
        const sessions = await WorkoutSessionService.getUserWorkoutSessions(user.uid);

        console.log('📋 Workout sessions data:', {
          count: sessions?.length || 0,
          sessions: sessions?.map(session => ({
            id: session.id,
            status: session.status,
            actualDate: session.actualDate,
            planId: session.planId,
          })),
        });

        return sessions || [];
      } catch (error) {
        console.error('❌ Error fetching workout sessions:', error);
        return [];
      }
    },
    enabled: isAuthenticated && !!user?.uid,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
};

export const usePlanWorkoutSessions = (planId?: string) => {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ['plan-workout-sessions', planId, user?.uid],
    queryFn: async () => {
      if (!planId || !isAuthenticated || !user?.uid) return [];

      try {
        console.log('🔍 Fetching workout sessions for planId:', planId);
        const sessions = await WorkoutSessionService.getPlanWorkoutSessions(planId, user.uid);
        console.log('📋 Plan workout sessions:', sessions.length);
        return sessions || [];
      } catch (error) {
        console.error('❌ Error fetching plan workout sessions:', error);
        return [];
      }
    },
    enabled: !!planId && isAuthenticated && !!user?.uid,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
};

export const useTodaysWorkout = (planId?: string) => {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ['todays-workout', user?.uid, planId],
    queryFn: async () => {
      if (!isAuthenticated || !user?.uid || !planId) {
        return null;
      }

      try {
        console.log('🔍 Fetching today\'s workout for userId:', user.uid, 'planId:', planId);
        const workout = await WorkoutSessionService.getTodaysWorkout(user.uid, planId);
        console.log('📋 Today\'s workout:', workout ? 'Found' : 'Not found');
        return workout;
      } catch (error) {
        console.error('❌ Error fetching today\'s workout:', error);
        return null;
      }
    },
    enabled: isAuthenticated && !!user?.uid && !!planId,
    staleTime: 1000 * 60 * 2, // 2 minutes (shorter for real-time updates)
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: true,
  });
};

export const useWorkoutSummary = (planId?: string) => {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ['workout-summary', user?.uid, planId],
    queryFn: async () => {
      if (!isAuthenticated || !user?.uid) {
        return null;
      }

      try {
        console.log('🔍 Fetching workout summary for userId:', user.uid, planId ? `planId: ${planId}` : '(all plans)');
        const summary = await WorkoutSessionService.getWorkoutSummary(user.uid, planId);
        console.log('📊 Workout summary:', summary);
        return summary;
      } catch (error) {
        console.error('❌ Error fetching workout summary:', error);
        return null;
      }
    },
    enabled: isAuthenticated && !!user?.uid,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  });
};