import { Exercise } from '@/lib/data/exerciseDatabase';

export interface CustomExerciseFormProps {
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
  initialData?: Partial<Exercise>;
  isEditing?: boolean;
}

export interface CustomExerciseFormData {
  name: string;
  description: string;
  equipment: string[];
  muscleGroups: string[];
  measurementType: 'reps' | 'time' | 'distance' | 'intervals' | 'rounds';
  defaultSets: number;
  defaultReps: string;
  defaultDuration: string;
  defaultDistance: string;
  defaultRest: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  notes: string;
}