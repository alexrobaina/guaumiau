import { Exercise } from '@/lib/data/exerciseDatabase';
import { DayExercise } from '@/lib/services/trainingPlanService';

export interface ExerciseSelectorProps {
  onClose: () => void;
  onSelectExercise: (exercise: DayExercise) => void;
  onCreateCustom: () => void;
}

export interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
}

export interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export interface SubcategoryFilterProps {
  subcategories: string[];
  selectedSubcategory: string;
  onSelectSubcategory: (subcategory: string) => void;
}