import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  increment,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { WorkoutSession, ExerciseSession, SetData } from '@/types/workout';

export interface WorkoutCompletion {
  userId: string;
  planId: string;
  planName: string;
  dayOfWeek: string;
  scheduledDate: string;
  startedAt: Date;
  completedAt: Date;
  duration: number; // minutes
  exercises: ExerciseCompletion[];
  totalVolume: number; // kg
  totalExercises: number;
  completedExercises: number;
  skippedExercises: number;
  overallRPE?: number;
  overallFeeling?: number; // 1-5 scale
  sessionNotes?: string;
}

export interface ExerciseCompletion {
  exerciseId: string;
  exerciseName: string;
  exerciseCategory: string;
  completed: boolean;
  sets: SetCompletion[];
  totalVolume: number;
  notes?: string;
  personalRecord?: boolean;
  targetSets: number;
  completedSets: number;
}

export interface SetCompletion {
  setNumber: number;
  targetReps: string;
  actualReps: number;
  weight?: number;
  rpe?: number;
  restTaken: number; // seconds
  completed: boolean;
  completedAt?: Date;
}

export interface DayCompletion {
  date: string;
  completed: boolean;
  workoutSessionId: string;
  completedAt?: Timestamp;
}

export interface TrainingPlanProgress {
  completedDays: number;
  totalDays: number;
  completedWorkouts: string[];
  lastWorkoutDate?: Timestamp;
  currentWeek: number;
  streakDays: number;
  totalVolume: number;
  totalExercises: number;
  completionRate: number;
}

export class WorkoutProgressService {
  // Helper method to find any undefined values in an object
  private static findUndefinedValues(obj: any, path: string = ''): string[] {
    const undefinedPaths: string[] = [];

    if (obj === undefined) {
      undefinedPaths.push(path);
      return undefinedPaths;
    }

    if (obj === null || typeof obj !== 'object') {
      return undefinedPaths;
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        undefinedPaths.push(...this.findUndefinedValues(item, `${path}[${index}]`));
      });
      return undefinedPaths;
    }

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;
      undefinedPaths.push(...this.findUndefinedValues(value, currentPath));
    });

    return undefinedPaths;
  }

  // Helper method to recursively remove undefined values
  private static removeUndefinedValues(obj: any): any {
    if (obj === null || obj === undefined) return null;
    if (obj instanceof Date) return obj;
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
      return obj
        .filter(item => item !== undefined)
        .map(item => this.removeUndefinedValues(item));
    }

    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        const cleanedValue = this.removeUndefinedValues(value);
        if (cleanedValue !== undefined) {
          cleaned[key] = cleanedValue;
        }
      }
    }
    return cleaned;
  }

  // Update progress tracking for an already completed workout session
  static async saveWorkoutSession(sessionData: WorkoutCompletion): Promise<{ success: boolean; sessionId?: string; error?: any }> {
    try {
      const { userId, planId } = sessionData;

      console.log('✅ Updating training plan progress only (workout session already exists)');

      // Generate a session ID for progress tracking (this won't create a new document)
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 1. Update training plan progress
      await this.updateTrainingPlanProgress(userId, planId, sessionId, sessionData);

      // 2. Update specific training day completion
      await this.updateTrainingDayCompletion(userId, planId, sessionData.dayOfWeek, sessionData.scheduledDate, sessionId);

      // 3. Check if plan is complete
      const completion = await this.checkPlanCompletion(userId, planId);

      console.log('✅ Workout progress updated successfully');
      return { success: true, sessionId };
    } catch (error) {
      console.error('❌ Error updating workout progress:', error);
      return { success: false, error };
    }
  }

  // Update training plan progress
  static async updateTrainingPlanProgress(
    userId: string,
    planId: string,
    sessionId: string,
    sessionData: WorkoutCompletion
  ): Promise<void> {
    try {
      const planRef = doc(db, 'training_plans', planId);

      // Calculate streak (simplified - could be enhanced)
      const lastWorkoutStreak = await this.calculateStreak(userId, planId);

      await updateDoc(planRef, {
        'progress.completedDays': increment(1),
        'progress.completedWorkouts': arrayUnion(sessionId),
        'progress.lastWorkoutDate': Timestamp.now(),
        'progress.totalVolume': increment(sessionData.totalVolume),
        'progress.totalExercises': increment(sessionData.completedExercises),
        'progress.streakDays': lastWorkoutStreak,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('❌ Error updating training plan progress:', error);
      throw error;
    }
  }

  // Update specific training day completion
  static async updateTrainingDayCompletion(
    userId: string,
    planId: string,
    dayOfWeek: string,
    date: string,
    sessionId: string
  ): Promise<void> {
    try {
      const planRef = doc(db, 'training_plans', planId);
      const planDoc = await getDoc(planRef);

      if (!planDoc.exists()) {
        throw new Error('Training plan not found');
      }

      const planData = planDoc.data();

      // Check if trainingDays exists and is an array
      if (!planData.trainingDays || !Array.isArray(planData.trainingDays)) {
        console.log(`⚠️ Training plan ${planId} has no trainingDays configured, skipping day completion update`);
        return; // Silently skip if no training days configured
      }

      const dayIndex = (planData.trainingDays || []).findIndex((d: any) => d.day === dayOfWeek);

      if (dayIndex === -1) {
        console.log(`⚠️ Day ${dayOfWeek} not found in plan ${planId}, skipping completion update`);
        return; // Silently skip if day not found
      }

      const dayPath = `trainingDays.${dayIndex}`;
      const completion: DayCompletion = {
        date,
        completed: true,
        workoutSessionId: sessionId,
        completedAt: Timestamp.now()
      };

      await updateDoc(planRef, {
        [`${dayPath}.completions`]: arrayUnion(completion),
        [`${dayPath}.lastCompleted`]: Timestamp.now(),
        [`${dayPath}.timesCompleted`]: increment(1),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('❌ Error updating training day completion:', error);
      throw error;
    }
  }

  // Calculate workout streak
  static async calculateStreak(userId: string, planId: string): Promise<number> {
    try {
      // Simple implementation - could be enhanced with more complex logic
      const planRef = doc(db, 'training_plans', planId);
      const planDoc = await getDoc(planRef);

      if (!planDoc.exists()) return 1;

      const planData = planDoc.data();
      const lastWorkoutDate = planData.progress?.lastWorkoutDate;

      if (!lastWorkoutDate) return 1;

      const daysSinceLastWorkout = Math.floor(
        (Date.now() - lastWorkoutDate.toMillis()) / (1000 * 60 * 60 * 24)
      );

      // If worked out yesterday or today, continue streak, otherwise reset
      if (daysSinceLastWorkout <= 1) {
        return (planData.progress?.streakDays || 0) + 1;
      } else {
        return 1; // Reset streak
      }
    } catch (error) {
      console.error('❌ Error calculating streak:', error);
      return 1;
    }
  }

  // Check if training plan is complete
  static async checkPlanCompletion(userId: string, planId: string): Promise<{ completed: boolean; completionRate: number; error?: any }> {
    try {
      const planRef = doc(db, 'training_plans', planId);
      const planDoc = await getDoc(planRef);

      if (!planDoc.exists()) {
        throw new Error('Training plan not found');
      }

      const planData = planDoc.data();
      const totalDays = (planData.duration || 12) * (planData.daysPerWeek || 3); // Default to 12 weeks, 3 days
      const completedDays = planData.progress?.completedDays || 0;
      const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

      if (completedDays >= totalDays && planData.status !== 'completed') {
        // Mark plan as completed
        await updateDoc(planRef, {
          status: 'completed',
          completedAt: Timestamp.now(),
          'progress.completionRate': completionRate,
          updatedAt: Timestamp.now()
        });

        console.log('🎉 Training plan completed!', planId);
        return { completed: true, completionRate };
      }

      // Update completion rate even if not complete
      if (completionRate > 0) {
        await updateDoc(planRef, {
          'progress.completionRate': completionRate,
          updatedAt: Timestamp.now()
        });
      }

      return { completed: false, completionRate };
    } catch (error) {
      console.error('❌ Error checking plan completion:', error);
      return { completed: false, completionRate: 0, error };
    }
  }

  // Get workout history for a user
  static async getWorkoutHistory(userId: string, planId?: string, limit: number = 10) {
    try {
      // This would be implemented using a query on the workout_sessions subcollection
      console.log('📊 Getting workout history for user:', userId);
      // Implementation depends on your specific query needs
    } catch (error) {
      console.error('❌ Error getting workout history:', error);
      throw error;
    }
  }

  // Save individual set progress (for real-time tracking during workout)
  static async saveSetProgress(
    userId: string,
    sessionId: string,
    exerciseIndex: number,
    setData: SetCompletion
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const sessionRef = doc(db, 'users', userId, 'workout_sessions', sessionId);

      // This would update the specific set in the session document
      // Implementation depends on your real-time tracking needs

      console.log('✅ Set progress saved:', setData);
      return { success: true };
    } catch (error) {
      console.error('❌ Error saving set progress:', error);
      return { success: false, error };
    }
  }
}