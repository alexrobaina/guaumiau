import { Exercise } from '@/lib/data/exerciseDatabase';

export interface ExerciseConfigData {
  dayOfWeek: string;
  sets?: number;
  reps?: string;
  duration?: string;
  distance?: string;
  weight?: string;
  restPeriod: number;
  rpe?: number;
  notes?: string;
}

export interface ExerciseConfigModalProps {
  isVisible: boolean;
  exercise: Exercise | null;
  onClose: () => void;
  onSave: (config: ExerciseConfigData) => void;
  availableDays: string[];
  selectedDay?: string;
}

export interface ExerciseWithConfig extends Exercise {
  config: ExerciseConfigData;
  id: string;
}