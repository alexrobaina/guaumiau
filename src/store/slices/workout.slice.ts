import { StateCreator } from 'zustand';
import { Workout, WorkoutSession } from '@/types';
import { RootState } from '../types';

export interface WorkoutSlice {
  activeWorkout: Workout | null;
  currentSession: WorkoutSession | null;
  isWorkoutActive: boolean;
  timer: {
    isRunning: boolean;
    remaining: number;
    duration: number;
  };
  setActiveWorkout: (workout: Workout | null) => void;
  startWorkout: (workout: Workout) => void;
  endWorkout: () => void;
  startTimer: (duration: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
}

export const createWorkoutSlice: StateCreator<
  RootState,
  [['zustand/immer', never]],
  [],
  WorkoutSlice
> = (set, _get) => ({
  activeWorkout: null,
  currentSession: null,
  isWorkoutActive: false,
  timer: {
    isRunning: false,
    remaining: 0,
    duration: 0,
  },

  setActiveWorkout: workout =>
    set((state: RootState) => {
      state.activeWorkout = workout;
    }),

  startWorkout: workout =>
    set((state: RootState) => {
      state.activeWorkout = workout;
      state.isWorkoutActive = true;
      // Initialize session would be handled by the mutation
    }),

  endWorkout: () =>
    set((state: RootState) => {
      state.activeWorkout = null;
      state.currentSession = null;
      state.isWorkoutActive = false;
      state.timer = {
        isRunning: false,
        remaining: 0,
        duration: 0,
      };
    }),

  startTimer: duration =>
    set((state: RootState) => {
      state.timer = {
        isRunning: true,
        remaining: duration,
        duration,
      };
    }),

  pauseTimer: () =>
    set((state: RootState) => {
      state.timer.isRunning = false;
    }),

  resumeTimer: () =>
    set((state: RootState) => {
      state.timer.isRunning = true;
    }),

  resetTimer: () =>
    set((state: RootState) => {
      state.timer = {
        isRunning: false,
        remaining: 0,
        duration: 0,
      };
    }),
});
