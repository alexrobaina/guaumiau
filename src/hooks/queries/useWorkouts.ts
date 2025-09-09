import { useQuery } from '@tanstack/react-query';
// import { api } from '@/lib/api';

// Placeholder workout type
interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number;
}

// Mock API function - replace with actual API call
const fetchWorkouts = async (): Promise<Workout[]> => {
  // Replace this with actual API call
  // return api.get('/workouts');

  // Mock data for now
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    {
      id: '1',
      name: 'Beginner Climbing',
      description: 'Start your climbing journey',
      duration: 30,
    },
    {
      id: '2',
      name: 'Advanced Bouldering',
      description: 'Challenge yourself',
      duration: 45,
    },
  ];
};

export const useWorkouts = () => {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: fetchWorkouts,
  });
};
