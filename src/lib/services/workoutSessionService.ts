import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  limit,
  runTransaction,
  increment,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { WorkoutSession, ExerciseSession, SetData, DayOfWeek, WorkoutSummary } from '@/types/workout';
import { TrainingPlan, TrainingDay } from './trainingPlanService';
import { WorkoutProgressService, WorkoutCompletion, ExerciseCompletion, SetCompletion } from './workoutProgressService';

export class WorkoutSessionService {
  private static getWorkoutSessionsCollection(userId: string) {
    return collection(db, 'users', userId, 'workout_sessions');
  }

  // Create a new workout session from a training day
  static async createWorkoutSession(
    planId: string,
    userId: string,
    trainingDay: TrainingDay,
    scheduledDay: DayOfWeek,
    actualDate?: Date
  ): Promise<string> {
    try {
      console.log('🔄 Creating workout session...', {
        planId,
        userId,
        dayName: trainingDay.name,
        exerciseCount: trainingDay.exercises?.length || 0,
        scheduledDay
      });

      // Validate inputs
      if (!planId || !userId || !trainingDay) {
        throw new Error('Missing required parameters for workout session creation');
      }

      if (!trainingDay.exercises || !Array.isArray(trainingDay.exercises) || trainingDay.exercises.length === 0) {
        throw new Error('Training day must have at least one exercise');
      }

      const now = Timestamp.now();
      const workoutDate = actualDate ? Timestamp.fromDate(actualDate) : now;

      // Create exercise sessions from training day exercises with better validation
      const exercises: ExerciseSession[] = trainingDay.exercises.map((exercise, index) => {
        // Validate exercise data
        if (!exercise.exercise || !exercise.exercise.name) {
          console.warn('⚠️ Exercise missing data at index', index, exercise);
          throw new Error(`Exercise at position ${index + 1} is missing required data`);
        }

        // Handle different measurement types (reps, time, distance, etc.)
        const measurementType = exercise.exercise?.measurementType || 'reps';
        const targetValue = exercise.reps || exercise.duration || '8-12';

        return {
          id: `exercise_${index}`,
          exerciseId: exercise.exerciseId || exercise.exercise.id || `custom_${index}`,
          exerciseName: exercise.exercise.name,
          exerciseCategory: exercise.exercise?.category || 'general',
          status: 'pending',
          sets: Array.from({ length: exercise.sets || 3 }, (_, setIndex) => ({
            setNumber: setIndex + 1,
            targetReps: targetValue,
            completed: false,
            restTaken: exercise.rest || 90,
          } as SetData)),
          targetSets: exercise.sets || 3,
          targetReps: targetValue,
          targetRest: exercise.rest || 90,
          targetRPE: exercise.rpe,
          actualRestTimes: [],
          exerciseNotes: exercise.notes,
        };
      });

      const workoutSession: Omit<WorkoutSession, 'id'> = {
        planId,
        userId,
        scheduledDay,
        actualDate: workoutDate,
        status: 'not_started',
        exercises,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(this.getWorkoutSessionsCollection(userId), workoutSession);
      console.log('✅ Workout session created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating workout session:', error);
      throw error;
    }
  }

  // Get a workout session by ID
  static async getWorkoutSession(sessionId: string, userId: string): Promise<WorkoutSession | null> {
    try {
      console.log('🔍 Getting workout session:', { sessionId, userId });

      const docRef = doc(db, 'users', userId, 'workout_sessions', sessionId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('✅ Workout session found:', {
          id: docSnap.id,
          status: data.status,
          exerciseCount: data.exercises?.length || 0
        });
        return { id: docSnap.id, ...data } as WorkoutSession;
      } else {
        console.log('❌ No workout session found with ID:', sessionId, 'for user:', userId);
        console.log('📍 Document path:', docRef.path);
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting workout session:', error);
      throw error;
    }
  }

  // Get user's workout sessions
  static async getUserWorkoutSessions(userId: string): Promise<WorkoutSession[]> {
    try {
      const q = query(
        this.getWorkoutSessionsCollection(userId),
        orderBy('actualDate', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const sessions: WorkoutSession[] = [];

      querySnapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() } as WorkoutSession);
      });

      console.log('✅ Retrieved workout sessions for user:', userId, sessions.length);
      return sessions;
    } catch (error) {
      console.error('❌ Error getting user workout sessions:', error);
      return [];
    }
  }

  // Get workout sessions for a specific plan
  static async getPlanWorkoutSessions(planId: string, userId: string): Promise<WorkoutSession[]> {
    try {
      const q = query(
        this.getWorkoutSessionsCollection(userId),
        where('planId', '==', planId),
        orderBy('actualDate', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const sessions: WorkoutSession[] = [];

      querySnapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() } as WorkoutSession);
      });

      console.log('✅ Retrieved workout sessions for plan:', planId, sessions.length);
      return sessions;
    } catch (error) {
      console.error('❌ Error getting plan workout sessions:', error);
      return [];
    }
  }

  // Get today's workout session
  static async getTodaysWorkout(userId: string, planId?: string): Promise<WorkoutSession | null> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let q = query(
        this.getWorkoutSessionsCollection(userId),
        where('actualDate', '>=', Timestamp.fromDate(today)),
        where('actualDate', '<', Timestamp.fromDate(tomorrow)),
        limit(1)
      );

      if (planId) {
        q = query(
          this.getWorkoutSessionsCollection(userId),
          where('planId', '==', planId),
          where('actualDate', '>=', Timestamp.fromDate(today)),
          where('actualDate', '<', Timestamp.fromDate(tomorrow)),
          limit(1)
        );
      }

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as WorkoutSession;
      }

      return null;
    } catch (error) {
      console.error('❌ Error getting today\'s workout:', error);
      return null;
    }
  }

  // Start a workout session
  static async startWorkoutSession(sessionId: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'workout_sessions', sessionId);
      await updateDoc(docRef, {
        status: 'in_progress',
        startTime: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log('✅ Workout session started:', sessionId);
    } catch (error) {
      console.error('❌ Error starting workout session:', error);
      throw error;
    }
  }

  // Update exercise in workout session
  static async updateExerciseSession(
    sessionId: string,
    userId: string,
    exerciseId: string,
    updates: Partial<ExerciseSession>
  ): Promise<void> {
    try {
      const session = await this.getWorkoutSession(sessionId, userId);
      if (!session) throw new Error('Workout session not found');

      const exerciseIndex = session.exercises.findIndex(ex => ex.id === exerciseId);
      if (exerciseIndex === -1) throw new Error('Exercise not found in session');

      session.exercises[exerciseIndex] = {
        ...session.exercises[exerciseIndex],
        ...updates,
      };

      const docRef = doc(db, 'users', userId, 'workout_sessions', sessionId);
      await updateDoc(docRef, {
        exercises: session.exercises,
        updatedAt: Timestamp.now(),
      });

      console.log('✅ Exercise session updated:', exerciseId);
    } catch (error) {
      console.error('❌ Error updating exercise session:', error);
      throw error;
    }
  }

  // Complete a set
  static async completeSet(
    sessionId: string,
    userId: string,
    exerciseId: string,
    setNumber: number,
    setData: Partial<SetData>
  ): Promise<void> {
    try {
      const session = await this.getWorkoutSession(sessionId, userId);
      if (!session) throw new Error('Workout session not found');

      const exerciseIndex = session.exercises.findIndex(ex => ex.id === exerciseId);
      if (exerciseIndex === -1) throw new Error('Exercise not found in session');

      const exercise = session.exercises[exerciseIndex];
      const setIndex = exercise.sets.findIndex(set => set.setNumber === setNumber);
      if (setIndex === -1) throw new Error('Set not found');

      // Update the set
      exercise.sets[setIndex] = {
        ...exercise.sets[setIndex],
        ...setData,
        completed: true,
        completedAt: Timestamp.now(),
      };

      // Check if all sets are completed
      const allSetsCompleted = exercise.sets.every(set => set.completed);
      if (allSetsCompleted && exercise.status !== 'completed') {
        exercise.status = 'completed';
        exercise.endTime = Timestamp.now();
      }

      session.exercises[exerciseIndex] = exercise;

      const docRef = doc(db, 'users', userId, 'workout_sessions', sessionId);
      await updateDoc(docRef, {
        exercises: session.exercises,
        updatedAt: Timestamp.now(),
      });

      console.log('✅ Set completed:', setNumber, 'for exercise:', exerciseId);
    } catch (error) {
      console.error('❌ Error completing set:', error);
      throw error;
    }
  }

  // Complete workout session with comprehensive progress tracking
  static async completeWorkoutSession(
    sessionId: string,
    userId: string,
    sessionData?: Partial<WorkoutSession>
  ): Promise<void> {
    try {
      console.log('🏁 Starting workout completion for session:', sessionId);

      // Declare variables outside transaction scope
      let session: WorkoutSession;
      let startTime: Timestamp;
      let endTime: Timestamp;
      let duration: number;
      let totalVolume = 0;
      let completedExercisesCount = 0;
      let skippedExercisesCount = 0;
      let progressExercises: ExerciseCompletion[] = [];

      await runTransaction(db, async (transaction) => {
        // 1. FIRST: Get the workout session (READ)
        const sessionRef = doc(db, 'users', userId, 'workout_sessions', sessionId);
        const sessionDoc = await transaction.get(sessionRef);

        if (!sessionDoc.exists()) {
          throw new Error('Workout session not found');
        }

        session = { id: sessionDoc.id, ...sessionDoc.data() } as WorkoutSession;
        console.log('📋 Retrieved session data:', {
          planId: session.planId,
          status: session.status,
          exerciseCount: session.exercises?.length || 0
        });

        // 2. SECOND: Get the training plan (READ)
        const planRef = doc(db, 'training_plans', session.planId);
        const planDoc = await transaction.get(planRef);

        endTime = Timestamp.now();
        startTime = session.startTime || endTime;
        duration = Math.round((endTime.toMillis() - startTime.toMillis()) / (1000 * 60)); // minutes

        // Calculate metrics
        totalVolume = 0;
        let totalReps = 0;
        completedExercisesCount = 0;
        skippedExercisesCount = 0;

        // Convert exercises to progress tracking format
        progressExercises = session.exercises.map(exercise => {
          let exerciseVolume = 0;
          let completedSets = 0;

          const progressSets: SetCompletion[] = exercise.sets.map(set => {
            if (set.completed && set.actualReps && set.weight) {
              exerciseVolume += set.actualReps * set.weight;
              totalVolume += set.actualReps * set.weight;
              totalReps += set.actualReps;
              completedSets++;
            }

            return {
              setNumber: set.setNumber,
              targetReps: set.targetReps,
              actualReps: set.actualReps || 0,
              weight: set.weight,
              rpe: set.rpe,
              restTaken: set.restTaken || 0,
              completed: set.completed,
              completedAt: set.completedAt?.toDate()
            };
          });

          const isExerciseCompleted = exercise.status === 'completed';
          if (isExerciseCompleted) {
            completedExercisesCount++;
          } else {
            skippedExercisesCount++;
          }

          return {
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
            exerciseCategory: exercise.exerciseCategory,
            completed: isExerciseCompleted,
            sets: progressSets,
            totalVolume: exerciseVolume,
            notes: exercise.exerciseNotes,
            personalRecord: false, // TODO: Enhance to detect PRs
            targetSets: exercise.targetSets,
            completedSets
          };
        });

        // 3. THIRD: Update the workout session document (WRITE)
        const cleanSessionData = sessionData ? Object.fromEntries(
          Object.entries(sessionData).filter(([_, value]) => value !== undefined)
        ) : {};

        transaction.update(sessionRef, {
          status: 'completed',
          endTime,
          totalDuration: duration,
          totalVolume,
          totalReps,
          ...cleanSessionData,
          updatedAt: Timestamp.now(),
        });

        // 4. FOURTH: Update training plan progress (WRITE)

        if (planDoc.exists()) {
          const planData = planDoc.data();
          const currentProgress = planData.progress || {};

          // Calculate new progress metrics
          const totalWorkoutsInPlan = planData.duration * planData.daysPerWeek;
          const newCompletedDays = (currentProgress.completedDays || 0) + 1;
          const newCompletionRate = Math.round((newCompletedDays / totalWorkoutsInPlan) * 100);

          // Calculate streak
          const lastWorkoutDate = currentProgress.lastWorkoutDate?.toDate();
          const today = new Date();
          const daysSinceLastWorkout = lastWorkoutDate
            ? Math.floor((today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24))
            : 0;

          const newStreak = daysSinceLastWorkout <= 1
            ? (currentProgress.streakDays || 0) + 1
            : 1;

          // Determine current week based on completions
          const currentWeek = Math.ceil(newCompletedDays / planData.daysPerWeek);

          console.log('📊 Updating plan progress:', {
            completedDays: newCompletedDays,
            totalDays: totalWorkoutsInPlan,
            completionRate: newCompletionRate,
            currentWeek: currentWeek,
            streak: newStreak
          });

          // Update plan progress
          transaction.update(planRef, {
            'progress.completedDays': newCompletedDays,
            'progress.completedWorkouts': arrayUnion(sessionId),
            'progress.completionRate': newCompletionRate,
            'progress.currentWeek': Math.min(currentWeek, planData.duration),
            'progress.streakDays': newStreak,
            'progress.totalVolume': (currentProgress.totalVolume || 0) + totalVolume,
            'progress.totalExercises': (currentProgress.totalExercises || 0) + completedExercisesCount,
            'progress.lastWorkoutDate': endTime,
            updatedAt: Timestamp.now()
          });

          // 4. Check if plan is completed
          if (newCompletionRate >= 100) {
            console.log('🎉 Training plan completed!');
            transaction.update(planRef, {
              status: 'completed',
              completedAt: endTime,
              'progress.completionRate': 100
            });
          }
        } else {
          console.warn('⚠️ Training plan not found:', session.planId);
        }

        console.log('✅ Transaction completed successfully');
      });

      // All progress tracking is now handled directly in the transaction above

      // Save progress tracking data - DISABLED to prevent trainingDays corruption
      console.log('⚠️ WorkoutProgressService disabled to prevent data corruption');
      console.log('Progress tracking is now handled directly in the transaction above');
      // The WorkoutProgressService.saveWorkoutSession was corrupting the trainingDays field
      // All progress tracking is now handled in the transaction above

      console.log('✅ Workout session completed:', sessionId);

    } catch (error) {
      console.error('❌ Error completing workout session:', error);
      throw error;
    }
  }

  // Get workout summary for a user
  static async getWorkoutSummary(userId: string, planId?: string): Promise<WorkoutSummary> {
    try {
      let sessions = await this.getUserWorkoutSessions(userId);

      if (planId) {
        sessions = sessions.filter(session => session.planId === planId);
      }

      const completedSessions = sessions.filter(session => session.status === 'completed');

      const totalVolume = completedSessions.reduce((sum, session) => sum + (session.totalVolume || 0), 0);
      const totalDuration = completedSessions.reduce((sum, session) => sum + (session.totalDuration || 0), 0);
      const averageRPE = completedSessions.length > 0
        ? completedSessions.reduce((sum, session) => sum + (session.overallRPE || 0), 0) / completedSessions.length
        : 0;

      // Calculate streak (simplified - consecutive days with workouts)
      let streakDays = 0;
      const sortedSessions = completedSessions.sort((a, b) => b.actualDate.toMillis() - a.actualDate.toMillis());

      if (sortedSessions.length > 0) {
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (const session of sortedSessions) {
          const sessionDate = session.actualDate.toDate();
          sessionDate.setHours(0, 0, 0, 0);

          const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDiff === streakDays || (streakDays === 0 && daysDiff <= 1)) {
            streakDays++;
            currentDate = new Date(sessionDate);
          } else {
            break;
          }
        }
      }

      // Collect personal records
      const personalRecords = completedSessions.flatMap(session => session.personalRecords || []);

      return {
        totalWorkouts: sessions.length,
        completedWorkouts: completedSessions.length,
        completionRate: sessions.length > 0 ? (completedSessions.length / sessions.length) * 100 : 0,
        totalVolume,
        totalDuration,
        averageRPE,
        personalRecords,
        streakDays,
        lastWorkout: sortedSessions[0]?.actualDate,
      };
    } catch (error) {
      console.error('❌ Error getting workout summary:', error);
      return {
        totalWorkouts: 0,
        completedWorkouts: 0,
        completionRate: 0,
        totalVolume: 0,
        totalDuration: 0,
        averageRPE: 0,
        personalRecords: [],
        streakDays: 0,
      };
    }
  }

  // Delete a workout session
  static async deleteWorkoutSession(sessionId: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'workout_sessions', sessionId);
      await deleteDoc(docRef);
      console.log('✅ Workout session deleted:', sessionId);
    } catch (error) {
      console.error('❌ Error deleting workout session:', error);
      throw error;
    }
  }

  // Check if training plan is completed after workout
  static async checkPlanCompletion(planId: string): Promise<{ isCompleted: boolean; completionRate: number; }> {
    try {
      const planRef = doc(db, 'training_plans', planId);
      const planDoc = await getDoc(planRef);

      if (!planDoc.exists()) {
        throw new Error('Training plan not found');
      }

      const planData = planDoc.data();
      const progress = planData.progress || {};
      const totalWorkouts = planData.duration * planData.daysPerWeek;
      const completedWorkouts = progress.completedDays || 0;
      const completionRate = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;

      return {
        isCompleted: completionRate >= 100,
        completionRate
      };
    } catch (error) {
      console.error('❌ Error checking plan completion:', error);
      throw error;
    }
  }

  // Get plan completion statistics
  static async getPlanCompletionStats(planId: string, userId: string): Promise<{
    totalWorkouts: number;
    completedWorkouts: number;
    completionRate: number;
    totalVolume: number;
    averageRPE: number;
    streakDays: number;
    weeklyProgress: { week: number; completed: number; total: number; }[];
  }> {
    try {
      const sessions = await this.getPlanWorkoutSessions(planId, userId);
      const completedSessions = sessions.filter(s => s.status === 'completed');

      const planRef = doc(db, 'training_plans', planId);
      const planDoc = await getDoc(planRef);

      if (!planDoc.exists()) {
        throw new Error('Training plan not found');
      }

      const planData = planDoc.data();
      const totalWorkouts = planData.duration * planData.daysPerWeek;
      const progress = planData.progress || {};

      // Calculate total volume
      const totalVolume = completedSessions.reduce((sum, session) => sum + (session.totalVolume || 0), 0);

      // Calculate average RPE
      const rpeValues = completedSessions.filter(s => s.overallRPE).map(s => s.overallRPE!);
      const averageRPE = rpeValues.length > 0 ? rpeValues.reduce((sum, rpe) => sum + rpe, 0) / rpeValues.length : 0;

      // Calculate weekly progress
      const weeklyProgress: { week: number; completed: number; total: number; }[] = [];
      const workoutsPerWeek = planData.daysPerWeek;

      for (let week = 1; week <= planData.duration; week++) {
        const weekSessions = completedSessions.filter(session => {
          const weekNumber = Math.ceil((progress.completedDays || 0) / workoutsPerWeek);
          return weekNumber === week;
        });

        weeklyProgress.push({
          week,
          completed: weekSessions.length,
          total: workoutsPerWeek
        });
      }

      return {
        totalWorkouts,
        completedWorkouts: completedSessions.length,
        completionRate: totalWorkouts > 0 ? Math.round((completedSessions.length / totalWorkouts) * 100) : 0,
        totalVolume,
        averageRPE,
        streakDays: progress.streakDays || 0,
        weeklyProgress
      };
    } catch (error) {
      console.error('❌ Error getting plan completion stats:', error);
      throw error;
    }
  }

  // Get personal records for a user (optionally filtered by plan)
  static async getPersonalRecords(userId: string, planId?: string): Promise<any[]> {
    try {
      const sessionsRef = this.getWorkoutSessionsCollection(userId);
      let q = query(
        sessionsRef,
        where('status', '==', 'completed')
      );

      if (planId) {
        q = query(
          sessionsRef,
          where('planId', '==', planId),
          where('status', '==', 'completed')
        );
      }

      const snapshot = await getDocs(q);
      const personalRecords: any[] = [];
      const exerciseRecords = new Map<string, any>();

      snapshot.docs.forEach(sessionDoc => {
        const session = sessionDoc.data() as WorkoutSession;
        session.exercises?.forEach(exercise => {
          const exerciseKey = exercise.exercise?.name || 'Unknown Exercise';

          exercise.sets?.forEach(set => {
            if (set.actualWeight && set.actualReps) {
              const volume = set.actualWeight * set.actualReps;
              const currentRecord = exerciseRecords.get(exerciseKey);

              // Check for new weight PR
              if (!currentRecord?.maxWeight || set.actualWeight > currentRecord.maxWeight) {
                exerciseRecords.set(exerciseKey, {
                  ...currentRecord,
                  maxWeight: set.actualWeight,
                  maxWeightReps: set.actualReps,
                  maxWeightDate: session.completedAt
                });

                personalRecords.push({
                  exercise: exerciseKey,
                  type: 'weight',
                  value: set.actualWeight,
                  reps: set.actualReps,
                  date: session.completedAt?.toDate() || new Date()
                });
              }

              // Check for new volume PR
              if (!currentRecord?.maxVolume || volume > currentRecord.maxVolume) {
                exerciseRecords.set(exerciseKey, {
                  ...exerciseRecords.get(exerciseKey),
                  maxVolume: volume,
                  maxVolumeDate: session.completedAt
                });

                personalRecords.push({
                  exercise: exerciseKey,
                  type: 'volume',
                  value: volume,
                  weight: set.actualWeight,
                  reps: set.actualReps,
                  date: session.completedAt?.toDate() || new Date()
                });
              }
            }
          });
        });
      });

      // Sort by date (most recent first) and return top 10
      return personalRecords
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 10);

    } catch (error) {
      console.error('❌ Error getting personal records:', error);
      throw error;
    }
  }

  // Get exercise analytics for a user (optionally filtered by plan)
  static async getExerciseAnalytics(userId: string, planId?: string): Promise<any[]> {
    try {
      const sessionsRef = this.getWorkoutSessionsCollection(userId);
      let q = query(
        sessionsRef,
        where('status', '==', 'completed')
      );

      if (planId) {
        q = query(
          sessionsRef,
          where('planId', '==', planId),
          where('status', '==', 'completed')
        );
      }

      const snapshot = await getDocs(q);
      const exerciseData = new Map<string, any>();

      snapshot.docs.forEach(sessionDoc => {
        const session = sessionDoc.data() as WorkoutSession;
        session.exercises?.forEach(exercise => {
          const exerciseKey = exercise.exercise?.name || 'Unknown Exercise';

          if (!exerciseData.has(exerciseKey)) {
            exerciseData.set(exerciseKey, {
              name: exerciseKey,
              totalVolume: 0,
              totalSets: 0,
              maxWeight: 0,
              sessionCount: 0
            });
          }

          const data = exerciseData.get(exerciseKey);
          data.sessionCount++;

          exercise.sets?.forEach(set => {
            data.totalSets++;
            if (set.actualWeight && set.actualReps) {
              data.totalVolume += set.actualWeight * set.actualReps;
              if (set.actualWeight > data.maxWeight) {
                data.maxWeight = set.actualWeight;
              }
            }
          });

          exerciseData.set(exerciseKey, data);
        });
      });

      // Convert to array, sort by total volume, and return top 10
      return Array.from(exerciseData.values())
        .sort((a, b) => b.totalVolume - a.totalVolume)
        .slice(0, 10);

    } catch (error) {
      console.error('❌ Error getting exercise analytics:', error);
      throw error;
    }
  }
}