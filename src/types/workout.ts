import { Timestamp } from 'firebase/firestore';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type WorkoutStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';
export type ExerciseStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface SetData {
  setNumber: number;
  targetReps: string;
  actualReps?: number;
  weight?: number; // kg or lbs
  time?: number; // for time-based exercises (seconds)
  distance?: number; // for distance-based (meters)
  rpe?: number; // Rate of Perceived Exertion (1-10)
  completed: boolean;
  notes?: string;
  restTaken?: number; // actual rest in seconds
  completedAt?: Timestamp;
}

export interface ExerciseSession {
  id: string;
  exerciseId: string;
  exerciseName: string;
  exerciseCategory: string;
  status: ExerciseStatus;
  sets: SetData[];
  targetSets: number;
  targetReps: string;
  targetRest: number; // seconds
  targetRPE?: number;
  actualRestTimes: number[]; // actual rest between sets
  exerciseNotes?: string;
  exerciseRPE?: number; // overall exercise RPE
  startTime?: Timestamp;
  endTime?: Timestamp;
  skippedReason?: string;
  modifications?: {
    addedSets?: number;
    repsChanged?: boolean;
    weightChanged?: boolean;
    exerciseSwapped?: {
      from: string;
      to: string;
      reason: string;
    };
  };
}

export interface WorkoutSession {
  id: string;
  planId: string;
  userId: string;
  scheduledDay: DayOfWeek;
  actualDate: Timestamp;
  status: WorkoutStatus;
  exercises: ExerciseSession[];
  startTime?: Timestamp;
  endTime?: Timestamp;
  totalDuration?: number; // minutes
  totalVolume?: number; // kg
  totalReps?: number;
  overallRPE?: number; // 1-10
  overallFeeling?: 1 | 2 | 3 | 4 | 5; // mood rating
  notes?: string;
  personalRecords?: PersonalRecord[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  type: 'weight' | 'reps' | 'time' | 'volume';
  previousValue?: number;
  newValue: number;
  unit: string; // 'kg', 'lbs', 'reps', 'seconds', etc.
  achievedAt: Timestamp;
}

export interface WorkoutSummary {
  totalWorkouts: number;
  completedWorkouts: number;
  completionRate: number;
  totalVolume: number;
  totalDuration: number; // minutes
  averageRPE: number;
  personalRecords: PersonalRecord[];
  streakDays: number;
  lastWorkout?: Timestamp;
}

export interface RestTimer {
  targetRestTime: number; // seconds
  remainingTime: number;
  isActive: boolean;
  isPaused: boolean;
  startedAt?: Date;
  endTime?: Date;
}

export interface WorkoutPreferences {
  defaultRestTime: number; // seconds
  autoStartRest: boolean;
  playRestTimerSound: boolean;
  useHapticFeedback: boolean;
  defaultWeightUnit: 'kg' | 'lbs';
  showExerciseTips: boolean;
  enableVoiceCommands: boolean;
}