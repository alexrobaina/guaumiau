import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkoutSessionService } from '@/lib/services/workoutSessionService';
import { Button } from '@/components/atoms/Button';
import { Colors } from '@/lib/colors';
import { WorkoutSession, ExerciseSession } from '@/types/workout';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

type WorkoutPhase = 'pre-workout' | 'exercise' | 'rest' | 'complete';

export default function WorkoutSessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentPhase, setCurrentPhase] = useState<WorkoutPhase>('pre-workout');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [restTimer, setRestTimer] = useState<NodeJS.Timeout | null>(null);

  // Get workout session
  const { data: workoutSession, isLoading } = useQuery({
    queryKey: ['workout-session', sessionId],
    queryFn: async () => {
      if (!sessionId || !user?.uid) throw new Error('Session ID and user are required');
      return await WorkoutSessionService.getWorkoutSession(sessionId, user.uid);
    },
    enabled: !!sessionId && !!user?.uid,
    refetchInterval: currentPhase !== 'pre-workout' ? 30000 : false, // Refresh during workout
  });

  // Start workout mutation
  const startWorkoutMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId || !user?.uid) throw new Error('Session ID and user required');
      await WorkoutSessionService.startWorkoutSession(sessionId, user.uid);
    },
    onSuccess: () => {
      setCurrentPhase('exercise');
      queryClient.invalidateQueries({ queryKey: ['workout-session', sessionId] });
    },
  });

  // Complete set mutation
  const completeSetMutation = useMutation({
    mutationFn: async ({ exerciseId, setNumber, setData }: {
      exerciseId: string;
      setNumber: number;
      setData: any;
    }) => {
      if (!sessionId || !user?.uid) throw new Error('Session ID and user required');
      await WorkoutSessionService.completeSet(sessionId, user.uid, exerciseId, setNumber, setData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-session', sessionId] });
    },
  });

  // Complete workout mutation
  const completeWorkoutMutation = useMutation({
    mutationFn: async (sessionData?: any) => {
      if (!sessionId || !user?.uid) throw new Error('Session ID and user required');
      await WorkoutSessionService.completeWorkoutSession(sessionId, user.uid, sessionData);
    },
    onSuccess: () => {
      setCurrentPhase('complete');
      // Invalidate all related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['workout-session', sessionId] });

      // Use planId from current workoutSession to invalidate plan-related queries
      const planId = workoutSession?.planId;

      if (planId) {
        console.log('🔄 Invalidating queries for plan:', planId);
        // Invalidate training plan data
        queryClient.invalidateQueries({ queryKey: ['training-plan', planId] });
        // Invalidate plan statistics
        queryClient.invalidateQueries({ queryKey: ['plan-stats', planId, user?.uid] });
        // Invalidate workout sessions list
        queryClient.invalidateQueries({ queryKey: ['workout-sessions', planId, user?.uid] });
        // Invalidate workout summary
        queryClient.invalidateQueries({ queryKey: ['workout-summary', planId, user?.uid] });
        // Invalidate personal records
        queryClient.invalidateQueries({ queryKey: ['personal-records', user?.uid, planId] });
        // Invalidate exercise analytics
        queryClient.invalidateQueries({ queryKey: ['exercise-analytics', user?.uid, planId] });
        // Invalidate all training plans list
        queryClient.invalidateQueries({ queryKey: ['training-plans', user?.uid] });
        console.log('✅ All queries invalidated successfully');
      } else {
        console.warn('⚠️ No planId found, skipping query invalidations');
      }
    },
  });

  useEffect(() => {
    return () => {
      if (restTimer) {
        clearInterval(restTimer);
      }
    };
  }, [restTimer]);

  const startRestTimer = (duration: number) => {
    setRestTimeRemaining(duration);
    setCurrentPhase('rest');

    const timer = setInterval(() => {
      setRestTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCurrentPhase('exercise');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setRestTimer(timer);
  };

  const skipRest = () => {
    if (restTimer) {
      clearInterval(restTimer);
      setRestTimer(null);
    }
    setRestTimeRemaining(0);
    setCurrentPhase('exercise');
  };

  const getCurrentExercise = (): ExerciseSession | null => {
    if (!workoutSession || currentExerciseIndex >= workoutSession.exercises.length) {
      return null;
    }
    return workoutSession.exercises[currentExerciseIndex];
  };

  const completeSet = async (reps: number, weight?: number, rpe?: number) => {
    const currentExercise = getCurrentExercise();
    if (!currentExercise) return;

    try {
      await completeSetMutation.mutateAsync({
        exerciseId: currentExercise.id,
        setNumber: currentSet,
        setData: {
          actualReps: reps,
          weight,
          rpe,
        },
      });

      // Check if this was the last set of the exercise
      if (currentSet >= currentExercise.targetSets) {
        // Move to next exercise
        if (currentExerciseIndex < workoutSession!.exercises.length - 1) {
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          setCurrentSet(1);
        } else {
          // Workout complete
          await completeWorkoutMutation.mutateAsync();
          return;
        }
      } else {
        // Start rest timer for next set
        const restTime = currentExercise.targetRest || 90;
        setCurrentSet(currentSet + 1);
        startRestTimer(restTime);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save set. Please try again.');
    }
  };

  const skipExercise = () => {
    Alert.alert(
      'Skip Exercise',
      'Are you sure you want to skip this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: () => {
            if (currentExerciseIndex < workoutSession!.exercises.length - 1) {
              setCurrentExerciseIndex(currentExerciseIndex + 1);
              setCurrentSet(1);
            } else {
              completeWorkoutMutation.mutate();
            }
          },
        },
      ]
    );
  };

  const renderPreWorkout = () => {
    if (!workoutSession) return null;

    const totalExercises = workoutSession.exercises.length;
    const estimatedTime = workoutSession.exercises.reduce((total, exercise) => {
      const exerciseTime = exercise.targetSets * 2 + (exercise.targetSets - 1) * (exercise.targetRest / 60);
      return total + exerciseTime;
    }, 0);

    const equipmentNeeded = Array.from(
      new Set(workoutSession.exercises.map(ex => ex.exerciseCategory))
    );

    return (
      <ScrollView style={styles.content}>
        <View style={styles.preWorkoutCard}>
          <Text style={styles.preWorkoutTitle}>Ready to start?</Text>
          <Text style={styles.workoutDate}>
            {workoutSession.scheduledDay.charAt(0).toUpperCase() + workoutSession.scheduledDay.slice(1)}'s Workout
          </Text>

          <View style={styles.workoutStats}>
            <View style={styles.statItem}>
              <Ionicons name="fitness-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.statValue}>{totalExercises}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.statValue}>{Math.round(estimatedTime)}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
          </View>

          <View style={styles.exercisesList}>
            <Text style={styles.exercisesTitle}>Today's Exercises:</Text>
            {workoutSession.exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseItem}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.targetSets} sets × {exercise.targetReps} reps
                  </Text>
                  {exercise.targetRPE && (
                    <Text style={styles.exerciseRpe}>RPE: {exercise.targetRPE}/10</Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.equipmentSection}>
            <Text style={styles.equipmentTitle}>Equipment Needed:</Text>
            <View style={styles.equipmentList}>
              {equipmentNeeded.map((equipment, index) => (
                <View key={index} style={styles.equipmentChip}>
                  <Text style={styles.equipmentText}>{equipment}</Text>
                </View>
              ))}
            </View>
          </View>

          <Button
            onPress={() => startWorkoutMutation.mutate()}
            variant="primary"
            size="lg"
            style={styles.beginButton}
            loading={startWorkoutMutation.isPending}
          >
            <Ionicons name="play-outline" size={20} color={Colors.white} />
            Begin Workout
          </Button>
        </View>
      </ScrollView>
    );
  };

  const renderExercise = () => {
    const currentExercise = getCurrentExercise();
    if (!currentExercise) return null;

    const completedSets = currentExercise.sets.filter(set => set.completed).length;

    return (
      <ScrollView style={styles.content}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.progressText}>
            Exercise {currentExerciseIndex + 1} of {workoutSession!.exercises.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentExerciseIndex + 1) / workoutSession!.exercises.length) * 100}%` }
              ]}
            />
          </View>
        </View>

        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseTitle}>{currentExercise.exerciseName}</Text>

          <View style={styles.setProgress}>
            <Text style={styles.setProgressText}>Set {currentSet} of {currentExercise.targetSets}</Text>
            <View style={styles.setIndicators}>
              {Array.from({ length: currentExercise.targetSets }, (_, i) => (
                <View
                  key={i}
                  style={[
                    styles.setIndicator,
                    i < completedSets && styles.setIndicatorCompleted,
                    i === currentSet - 1 && styles.setIndicatorCurrent,
                  ]}
                />
              ))}
            </View>
          </View>

          <Text style={styles.targetText}>Target: {currentExercise.targetReps} reps</Text>

          {/* Weight Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Weight (kg):</Text>
            <View style={styles.weightButtons}>
              {[40, 50, 60, 70, 80, 90, 100].map(weight => (
                <TouchableOpacity key={weight} style={styles.weightButton}>
                  <Text style={styles.weightButtonText}>{weight}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reps Counter */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Completed Reps:</Text>
            <View style={styles.repsCounter}>
              {Array.from({ length: 15 }, (_, i) => i + 1).map(rep => (
                <TouchableOpacity
                  key={rep}
                  style={styles.repButton}
                  onPress={() => completeSet(rep, 60, 7)} // TODO: Use actual weight and RPE
                >
                  <Text style={styles.repButtonText}>{rep}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Previous Sets */}
          {completedSets > 0 && (
            <View style={styles.previousSets}>
              <Text style={styles.previousSetsTitle}>Previous Sets:</Text>
              {currentExercise.sets
                .filter(set => set.completed)
                .map((set, index) => (
                  <Text key={index} style={styles.previousSetText}>
                    Set {set.setNumber}: {set.actualReps} reps @ {set.weight || 0}kg ✓
                  </Text>
                ))
              }
            </View>
          )}

          <View style={styles.exerciseActions}>
            <Button
              onPress={skipExercise}
              variant="outline"
              size="md"
              style={styles.skipButton}
            >
              Skip Exercise
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderRest = () => {
    const currentExercise = getCurrentExercise();
    if (!currentExercise) return null;

    const minutes = Math.floor(restTimeRemaining / 60);
    const seconds = restTimeRemaining % 60;

    return (
      <View style={styles.restContainer}>
        <Text style={styles.restTitle}>Rest Period</Text>

        <View style={styles.restTimer}>
          <Text style={styles.restTimeText}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </Text>
        </View>

        <View style={styles.restProgress}>
          <View
            style={[
              styles.restProgressFill,
              { width: `${(restTimeRemaining / currentExercise.targetRest) * 100}%` }
            ]}
          />
        </View>

        <Text style={styles.restMessage}>Great work on set {currentSet - 1}!</Text>
        <Text style={styles.nextSetText}>
          Next: Set {currentSet} of {currentExercise.targetSets}
        </Text>

        <View style={styles.restActions}>
          <Button
            onPress={skipRest}
            variant="outline"
            size="md"
          >
            Skip Rest
          </Button>
          <Button
            onPress={() => setRestTimeRemaining(prev => prev + 30)}
            variant="secondary"
            size="md"
          >
            +30s
          </Button>
        </View>
      </View>
    );
  };

  const renderComplete = () => {
    if (!workoutSession) return null;

    return (
      <ScrollView style={styles.content}>
        <View style={styles.completeCard}>
          <View style={styles.completeIcon}>
            <Ionicons name="trophy-outline" size={64} color={Colors.success} />
          </View>

          <Text style={styles.completeTitle}>Workout Complete! 🎉</Text>

          <View style={styles.workoutSummary}>
            <Text style={styles.summaryTitle}>
              {format(workoutSession.actualDate.toDate(), 'EEEE\'s Training')}
            </Text>

            <View style={styles.summaryStats}>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatValue}>{workoutSession.totalDuration || 0}</Text>
                <Text style={styles.summaryStatLabel}>Minutes</Text>
              </View>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatValue}>{workoutSession.exercises.length}</Text>
                <Text style={styles.summaryStatLabel}>Exercises</Text>
              </View>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatValue}>{workoutSession.totalVolume || 0}</Text>
                <Text style={styles.summaryStatLabel}>kg Volume</Text>
              </View>
            </View>
          </View>

          <Button
            onPress={() => router.back()}
            variant="primary"
            size="lg"
            style={styles.finishButton}
          >
            <Ionicons name="checkmark-outline" size={20} color={Colors.white} />
            Complete Workout
          </Button>
        </View>
      </ScrollView>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!workoutSession) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color={Colors.error} />
          <Text style={styles.errorText}>Workout session not found</Text>
          <Button onPress={() => router.back()} variant="primary" size="lg">
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {currentPhase === 'pre-workout' && 'Pre-Workout'}
            {currentPhase === 'exercise' && 'Training Session'}
            {currentPhase === 'rest' && 'Rest Time'}
            {currentPhase === 'complete' && 'Complete!'}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      {currentPhase === 'pre-workout' && renderPreWorkout()}
      {currentPhase === 'exercise' && renderExercise()}
      {currentPhase === 'rest' && renderRest()}
      {currentPhase === 'complete' && renderComplete()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray[600],
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },

  // Pre-workout styles
  preWorkoutCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
  },
  preWorkoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.gray[900],
    textAlign: 'center',
    marginBottom: 8,
  },
  workoutDate: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 24,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 4,
  },
  exercisesList: {
    marginBottom: 24,
  },
  exercisesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  exerciseNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[700],
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  exerciseRpe: {
    fontSize: 12,
    color: Colors.primary[600],
    marginTop: 2,
  },
  equipmentSection: {
    marginBottom: 32,
  },
  equipmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 12,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentChip: {
    backgroundColor: Colors.gray[100],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  equipmentText: {
    fontSize: 12,
    color: Colors.gray[700],
  },
  beginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  // Exercise styles
  exerciseHeader: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.gray[200],
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 2,
  },
  exerciseCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.gray[900],
    textAlign: 'center',
    marginBottom: 24,
  },
  setProgress: {
    alignItems: 'center',
    marginBottom: 24,
  },
  setProgressText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 12,
  },
  setIndicators: {
    flexDirection: 'row',
    gap: 8,
  },
  setIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gray[300],
  },
  setIndicatorCompleted: {
    backgroundColor: Colors.success,
  },
  setIndicatorCurrent: {
    backgroundColor: Colors.primary[500],
  },
  targetText: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 12,
  },
  weightButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weightButton: {
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  weightButtonText: {
    fontSize: 14,
    color: Colors.gray[700],
  },
  repsCounter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  repButton: {
    backgroundColor: Colors.primary[100],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  repButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[700],
  },
  previousSets: {
    marginBottom: 24,
  },
  previousSetsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 8,
  },
  previousSetText: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 4,
  },
  exerciseActions: {
    alignItems: 'center',
  },
  skipButton: {
    minWidth: 120,
  },

  // Rest styles
  restContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  restTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 32,
  },
  restTimer: {
    marginBottom: 24,
  },
  restTimeText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: Colors.primary[500],
  },
  restProgress: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: 4,
    marginBottom: 32,
  },
  restProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 4,
  },
  restMessage: {
    fontSize: 18,
    color: Colors.gray[900],
    textAlign: 'center',
    marginBottom: 8,
  },
  nextSetText: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 32,
  },
  restActions: {
    flexDirection: 'row',
    gap: 16,
  },

  // Complete styles
  completeCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  completeIcon: {
    marginBottom: 24,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.gray[900],
    textAlign: 'center',
    marginBottom: 24,
  },
  workoutSummary: {
    width: '100%',
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    textAlign: 'center',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary[500],
  },
  summaryStatLabel: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 4,
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minWidth: 200,
  },
});