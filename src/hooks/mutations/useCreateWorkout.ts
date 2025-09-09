import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { api } from '@/lib/api';

interface CreateWorkoutData {
  name: string;
  description: string;
  duration: number;
}

interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number;
}

// Mock API function - replace with actual API call
const createWorkout = async (data: CreateWorkoutData): Promise<Workout> => {
  // Replace this with actual API call
  // return api.post('/workouts', data);

  // Mock response for now
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: Date.now().toString(),
    ...data,
  };
};

export const useCreateWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkout,
    onSuccess: () => {
      // Invalidate and refetch workouts
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
};
