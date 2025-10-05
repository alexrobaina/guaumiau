import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  Image,
  Vibration,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkoutSessionService } from '@/lib/services/workoutSessionService';
import { TrainingPlanService } from '@/lib/services/trainingPlanService';
import { Button } from '@/components/atoms/Button';
import { Colors } from '@/lib/colors';
import { WorkoutSession, ExerciseSession, DayOfWeek } from '@/types/workout';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { Timestamp } from 'firebase/firestore';
import { exerciseDatabase } from '@/lib/data/exerciseDatabase';
import { Audio } from 'expo-av';

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

  // Form states for exercise completion
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);
  const [selectedRPE, setSelectedRPE] = useState<number | null>(null);
  const [customWeightModalVisible, setCustomWeightModalVisible] =
    useState(false);
  const [customWeightInput, setCustomWeightInput] = useState('');

  // Day selection state
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);
  const [currentExercises, setCurrentExercises] = useState<ExerciseSession[]>(
    []
  );

  // Get workout session
  const { data: workoutSession, isLoading } = useQuery({
    queryKey: ['workout-session', sessionId],
    queryFn: async () => {
      if (!sessionId || !user?.uid)
        throw new Error('Session ID and user are required');
      return await WorkoutSessionService.getWorkoutSession(sessionId, user.uid);
    },
    enabled: !!sessionId && !!user?.uid,
    refetchInterval: currentPhase !== 'pre-workout' ? 30000 : false, // Refresh during workout
  });

  // Get training plan to access all training days
  const { data: trainingPlan } = useQuery({
    queryKey: ['training-plan', workoutSession?.planId],
    queryFn: async () => {
      if (!workoutSession?.planId) throw new Error('Plan ID is required');
      return await TrainingPlanService.getTrainingPlan(workoutSession.planId);
    },
    enabled: !!workoutSession?.planId,
  });

  // Get completed days for this training plan
  const { data: completedDays = [] } = useQuery({
    queryKey: ['completed-days', workoutSession?.planId, user?.uid],
    queryFn: async () => {
      if (!workoutSession?.planId || !user?.uid)
        throw new Error('Plan ID and user required');
      return await WorkoutSessionService.getCompletedDays(
        workoutSession.planId,
        user.uid
      );
    },
    enabled: !!workoutSession?.planId && !!user?.uid,
  });

  // Start workout mutation
  const startWorkoutMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId || !user?.uid)
        throw new Error('Session ID and user required');
      await WorkoutSessionService.startWorkoutSession(sessionId, user.uid);
    },
    onSuccess: () => {
      setCurrentPhase('exercise');
      queryClient.invalidateQueries({
        queryKey: ['workout-session', sessionId],
      });
    },
  });

  // Complete set mutation
  const completeSetMutation = useMutation({
    mutationFn: async ({
      exerciseId,
      setNumber,
      setData,
    }: {
      exerciseId: string;
      setNumber: number;
      setData: any;
    }) => {
      if (!sessionId || !user?.uid)
        throw new Error('Session ID and user required');
      await WorkoutSessionService.completeSet(
        sessionId,
        user.uid,
        exerciseId,
        setNumber,
        setData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workout-session', sessionId],
      });
    },
  });

  // Complete workout mutation
  const completeWorkoutMutation = useMutation({
    mutationFn: async (sessionData?: any) => {
      if (!sessionId || !user?.uid)
        throw new Error('Session ID and user required');
      await WorkoutSessionService.completeWorkoutSession(
        sessionId,
        user.uid,
        sessionData
      );
    },
    onSuccess: () => {
      setCurrentPhase('complete');
      // Invalidate all related queries to refresh the UI
      queryClient.invalidateQueries({
        queryKey: ['workout-session', sessionId],
      });

      // Use planId from current workoutSession to invalidate plan-related queries
      const planId = workoutSession?.planId;

      if (planId) {
        console.log('🔄 Invalidating queries for plan:', planId);
        // Invalidate training plan data
        queryClient.invalidateQueries({ queryKey: ['training-plan', planId] });
        // Invalidate plan statistics
        queryClient.invalidateQueries({
          queryKey: ['plan-stats', planId, user?.uid],
        });
        // Invalidate workout sessions list
        queryClient.invalidateQueries({
          queryKey: ['workout-sessions', planId, user?.uid],
        });
        // Invalidate workout summary
        queryClient.invalidateQueries({
          queryKey: ['workout-summary', planId, user?.uid],
        });
        // Invalidate personal records
        queryClient.invalidateQueries({
          queryKey: ['personal-records', user?.uid, planId],
        });
        // Invalidate exercise analytics
        queryClient.invalidateQueries({
          queryKey: ['exercise-analytics', user?.uid, planId],
        });
        // Invalidate completed days
        queryClient.invalidateQueries({
          queryKey: ['completed-days', planId, user?.uid],
        });
        // Invalidate all training plans list
        queryClient.invalidateQueries({
          queryKey: ['training-plans', user?.uid],
        });
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

  // Initialize selected day with the original scheduled day
  useEffect(() => {
    if (workoutSession && !selectedDay) {
      setSelectedDay(workoutSession.scheduledDay);
      setCurrentExercises(workoutSession.exercises);
    }
  }, [workoutSession, selectedDay]);

  // Update exercises when day changes
  useEffect(() => {
    if (
      trainingPlan &&
      selectedDay &&
      selectedDay !== workoutSession?.scheduledDay
    ) {
      const dayData = trainingPlan?.trainingDays?.find?.(
        day => day.day === selectedDay
      );
      if (dayData && dayData.exercises) {
        // Convert training day exercises to exercise sessions
        const exerciseSessions: ExerciseSession[] = dayData.exercises.map(
          (exercise, index) => ({
            id: `${selectedDay}-${index}`,
            exerciseId: exercise.exerciseId || `${selectedDay}-${index}`,
            exerciseName: exercise.exercise?.name || 'Unknown Exercise',
            exerciseCategory: exercise.exercise?.equipment?.[0] || 'General',
            status: 'pending' as const,
            sets: Array.from({ length: exercise.sets }, (_, setIndex) => ({
              setNumber: setIndex + 1,
              targetReps: exercise.reps || '10',
              completed: false,
            })),
            targetSets: exercise.sets,
            targetReps: exercise.reps || '10',
            targetRest: exercise.rest || 90,
            targetRPE: exercise.rpe,
            actualRestTimes: [],
          })
        );
        setCurrentExercises(exerciseSessions);
      }
    } else if (workoutSession && selectedDay === workoutSession.scheduledDay) {
      setCurrentExercises(workoutSession.exercises);
    }
  }, [trainingPlan, selectedDay, workoutSession]);

  const playAlertSound = async () => {
    console.log('🔊 Playing alert sound...');
    try {
      // Configure audio mode for playback
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      console.log('🔊 Audio mode configured');

      // Create and play a beep sound using a data URL (simple 440Hz beep)
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
        { shouldPlay: true, volume: 1.0 }
      );

      console.log('🔊 Sound created and playing');

      // Unload sound after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          console.log('🔊 Sound finished playing, unloading');
          sound.unloadAsync();
        }
      });

      // Also vibrate the device (pattern: wait 0ms, vibrate 200ms, wait 100ms, vibrate 200ms)
      Vibration.vibrate([0, 200, 100, 200]);
      console.log('📳 Vibration triggered');
    } catch (error) {
      console.log('❌ Error playing alert sound:', error);
      // Fallback to vibration only if sound fails
      Vibration.vibrate([0, 200, 100, 200]);
      console.log('📳 Fallback vibration triggered');
    }
  };

  const playCountdownBeep = async () => {
    console.log('⏱️ Playing countdown beep...');
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg' },
        { shouldPlay: true, volume: 0.5 }
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });

      Vibration.vibrate(100);
      console.log('📳 Countdown beep vibration triggered');
    } catch (error) {
      console.log('❌ Error playing countdown beep:', error);
      Vibration.vibrate(100);
    }
  };

  const startRestTimer = (duration: number) => {
    console.log(`⏲️ Starting rest timer for ${duration} seconds`);
    setRestTimeRemaining(duration);
    setCurrentPhase('rest');

    const timer = setInterval(() => {
      setRestTimeRemaining(prev => {
        console.log(`⏲️ Rest time remaining: ${prev} seconds`);
        if (prev <= 1) {
          console.log('⏲️ Timer finished! Calling playAlertSound...');
          clearInterval(timer);
          playAlertSound(); // Play sound when timer finishes
          setCurrentPhase('exercise');
          return 0;
        }
        // Play countdown beeps for last 3 seconds
        if (prev <= 3 && prev > 1) {
          console.log(`⏲️ Countdown: ${prev} seconds`);
          playCountdownBeep();
        }
        return prev - 1;
      });
    }, 1000);

    setRestTimer(timer as unknown as NodeJS.Timeout);
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
    if (!currentExercises || currentExerciseIndex >= currentExercises.length) {
      return null;
    }
    return currentExercises[currentExerciseIndex];
  };

  const getExerciseImage = (exerciseId: string): string | number | null => {
    // Search through all categories and subcategories for the exercise
    for (const category of Object.values(exerciseDatabase.exerciseCategories)) {
      for (const subcategory of Object.values(category.subcategories)) {
        const exercise = subcategory.exercises.find(ex => ex.id === exerciseId);
        if (exercise && exercise.image) {
          return exercise.image;
        }
      }
    }
    return null;
  };

  const completeSet = async (reps: number) => {
    const currentExercise = getCurrentExercise();
    if (!currentExercise) return;

    // Check if this exercise typically requires weight
    const needsWeight =
      currentExercise.exerciseName.toLowerCase().includes('weight') ||
      currentExercise.exerciseName.toLowerCase().includes('press') ||
      currentExercise.exerciseName.toLowerCase().includes('curl') ||
      currentExercise.exerciseName.toLowerCase().includes('row') ||
      currentExercise.exerciseName.toLowerCase().includes('squat') ||
      currentExercise.exerciseName.toLowerCase().includes('deadlift') ||
      currentExercise.exerciseName.toLowerCase().includes('bench') ||
      currentExercise.exerciseName.toLowerCase().includes('dumbbell') ||
      currentExercise.exerciseName.toLowerCase().includes('barbell');

    // Validate that weight is selected if it's a weighted exercise
    if (needsWeight && !selectedWeight) {
      Alert.alert(
        'Weight Required',
        'Please select a weight for this exercise.'
      );
      return;
    }

    try {
      // If the day has been changed, we need to handle differently
      if (selectedDay !== workoutSession?.scheduledDay) {
        // For now, just update the local state and show success
        // In a real implementation, you might want to save this to a different collection
        // or create a new workout session for the selected day
        const updatedExercises = [...currentExercises];
        const exerciseIndex = currentExerciseIndex;

        if (updatedExercises[exerciseIndex]) {
          // Update the set as completed locally
          const setIndex = currentSet - 1;
          if (updatedExercises[exerciseIndex].sets[setIndex]) {
            updatedExercises[exerciseIndex].sets[setIndex] = {
              ...updatedExercises[exerciseIndex].sets[setIndex],
              actualReps: reps,
              weight: selectedWeight || undefined,
              rpe: selectedRPE || undefined,
              completed: true,
              completedAt: Timestamp.now(),
            };
          }

          setCurrentExercises(updatedExercises);

          // Alert user that this is being tracked locally
          Alert.alert(
            'Set Completed',
            `This workout is different from your scheduled day, so progress is being tracked locally for this session.`,
            [{ text: 'OK' }]
          );
        }
      } else {
        // Original day - use the normal flow
        await completeSetMutation.mutateAsync({
          exerciseId: currentExercise.id,
          setNumber: currentSet,
          setData: {
            actualReps: reps,
            weight: selectedWeight || undefined,
            rpe: selectedRPE || undefined,
          },
        });
      }

      // Reset form states for next set/exercise
      setSelectedWeight(null);
      setSelectedRPE(null);

      // Check if this was the last set of the exercise
      if (currentSet >= currentExercise.targetSets) {
        // Move to next exercise
        if (currentExerciseIndex < currentExercises.length - 1) {
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          setCurrentSet(1);
        } else {
          // Workout complete
          await completeWorkoutMutation.mutateAsync({});
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

  const handleCustomWeight = () => {
    const weight = parseFloat(customWeightInput);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight.');
      return;
    }
    setSelectedWeight(weight);
    setCustomWeightInput('');
    setCustomWeightModalVisible(false);
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
            if (currentExerciseIndex < currentExercises.length - 1) {
              setCurrentExerciseIndex(currentExerciseIndex + 1);
              setCurrentSet(1);
            } else {
              completeWorkoutMutation.mutate({});
            }
          },
        },
      ]
    );
  };

  const renderPreWorkout = () => {
    if (!workoutSession || !trainingPlan || !selectedDay) return null;

    // Check if trainingDays is valid (should be an array)
    if (!Array.isArray(trainingPlan?.trainingDays)) {
      console.warn('⚠️ Training plan has invalid trainingDays structure');
      return (
        <View style={styles.content}>
          <View style={styles.preWorkoutCard}>
            <Text style={styles.preWorkoutTitle}>
              Unable to load training days
            </Text>
            <Text style={styles.workoutDate}>
              This training plan has invalid data. Please contact support.
            </Text>
          </View>
        </View>
      );
    }

    const totalExercises = currentExercises.length;
    const estimatedTime = currentExercises.reduce((total, exercise) => {
      const exerciseTime =
        exercise.targetSets * 2 +
        (exercise.targetSets - 1) * (exercise.targetRest / 60);
      return total + exerciseTime;
    }, 0);

    const equipmentNeeded = Array.from(
      new Set(currentExercises.map(ex => ex.exerciseCategory))
    );

    const availableDays =
      trainingPlan?.trainingDays?.filter?.(
        day =>
          day && !day.isRestDay && day.exercises && day.exercises.length > 0
      ) || [];

    const dayNames = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
    };

    return (
      <ScrollView style={styles.content}>
        <View style={styles.preWorkoutCard}>
          <Text style={styles.preWorkoutTitle}>Ready to start?</Text>

          {/* Day Selection */}
          <View style={styles.daySelection}>
            <Text style={styles.daySelectionTitle}>Choose training day:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.dayScroll}
            >
              <View style={styles.dayButtons}>
                {availableDays.map(day => {
                  if (!day || !day.day) return null;
                  const isCompleted = completedDays.includes(
                    day.day as DayOfWeek
                  );
                  return (
                    <TouchableOpacity
                      key={day.day}
                      style={[
                        styles.dayButton,
                        selectedDay === day.day && styles.dayButtonSelected,
                        isCompleted && styles.dayButtonCompleted,
                      ]}
                      onPress={() => setSelectedDay(day.day as DayOfWeek)}
                    >
                      <View style={styles.dayButtonHeader}>
                        <Text
                          style={[
                            styles.dayButtonText,
                            selectedDay === day.day &&
                              styles.dayButtonTextSelected,
                            isCompleted && styles.dayButtonTextCompleted,
                          ]}
                        >
                          {dayNames[day.day as keyof typeof dayNames]}
                        </Text>
                        {isCompleted && (
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color={Colors.success}
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.dayButtonSubtext,
                          selectedDay === day.day &&
                            styles.dayButtonSubtextSelected,
                          isCompleted && styles.dayButtonSubtextCompleted,
                        ]}
                      >
                        {`${day.exercises?.length || 0} exercises${isCompleted ? ' • Completed' : ''}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          <Text style={styles.workoutDate}>
            {dayNames[selectedDay as keyof typeof dayNames]}'s Workout
            {selectedDay !== workoutSession.scheduledDay && (
              <Text style={styles.dayChangedIndicator}>
                {' '}
                (Changed from{' '}
                {dayNames[workoutSession.scheduledDay as keyof typeof dayNames]}
                )
              </Text>
            )}
          </Text>

          <View style={styles.workoutStats}>
            <View style={styles.statItem}>
              <Ionicons
                name="fitness-outline"
                size={24}
                color={Colors.primary[500]}
              />
              <Text style={styles.statValue}>{totalExercises}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="time-outline"
                size={24}
                color={Colors.primary[500]}
              />
              <Text style={styles.statValue}>{Math.round(estimatedTime)}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
          </View>

          <View style={styles.exercisesList}>
            <Text style={styles.exercisesTitle}>Today's Exercises:</Text>
            {currentExercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseItem}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>
                    {exercise.exerciseName}
                  </Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.targetSets} sets × {exercise.targetReps} reps
                  </Text>
                  {exercise.targetRPE && (
                    <Text style={styles.exerciseRpe}>
                      RPE: {exercise.targetRPE}/10
                    </Text>
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

    const completedSets = currentExercise.sets.filter(
      set => set.completed
    ).length;

    const exerciseImage = getExerciseImage(currentExercise.exerciseId);

    return (
      <ScrollView style={styles.content}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.progressText}>
            Exercise {currentExerciseIndex + 1} of {currentExercises.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentExerciseIndex + 1) / currentExercises.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.exerciseCard}>
          {exerciseImage && (
            <Image
              source={
                typeof exerciseImage === 'number'
                  ? exerciseImage
                  : { uri: exerciseImage }
              }
              style={styles.exerciseImage}
              resizeMode="contain"
            />
          )}

          <Text style={styles.exerciseTitle}>
            {currentExercise.exerciseName}
          </Text>

          <View style={styles.setProgress}>
            <Text style={styles.setProgressText}>
              Set {currentSet} of {currentExercise.targetSets}
            </Text>
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

          <Text style={styles.targetText}>
            Target: {currentExercise.targetReps} reps
          </Text>

          {/* Ready indicator */}
          <View style={styles.readyIndicator}>
            <View style={styles.indicatorRow}>
              <Ionicons
                name={selectedWeight ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={selectedWeight ? Colors.success : Colors.gray[400]}
              />
              <Text
                style={[
                  styles.indicatorText,
                  selectedWeight ? styles.indicatorTextReady : null,
                ]}
              >
                Weight{' '}
                {selectedWeight ? `(${selectedWeight}kg)` : 'not selected'}
              </Text>
            </View>
            <View style={styles.indicatorRow}>
              <Ionicons
                name={selectedRPE ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={selectedRPE ? Colors.success : Colors.gray[400]}
              />
              <Text
                style={[
                  styles.indicatorText,
                  selectedRPE ? styles.indicatorTextReady : null,
                ]}
              >
                RPE {selectedRPE ? `(${selectedRPE}/10)` : 'optional'}
              </Text>
            </View>
          </View>

          {/* Weight Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Weight (kg):</Text>
            {selectedWeight && (
              <Text style={styles.selectedValue}>
                Selected: {selectedWeight}kg
              </Text>
            )}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              <View style={styles.weightButtons}>
                {[
                  5, 10, 15, 20, 25, 30, 35, 40, 42.5, 45, 47.5, 50, 52.5, 55,
                  57.5, 60, 62.5, 65, 67.5, 70, 72.5, 75, 80, 85, 90, 95, 100,
                ].map(weight => (
                  <TouchableOpacity
                    key={weight}
                    style={[
                      styles.weightButton,
                      selectedWeight === weight && styles.weightButtonSelected,
                    ]}
                    onPress={() => setSelectedWeight(weight)}
                  >
                    <Text
                      style={[
                        styles.weightButtonText,
                        selectedWeight === weight &&
                          styles.weightButtonTextSelected,
                      ]}
                    >
                      {weight}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.customWeightButton}
                  onPress={() => setCustomWeightModalVisible(true)}
                >
                  <Ionicons name="add" size={16} color={Colors.primary[600]} />
                  <Text style={styles.customWeightText}>Custom</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* RPE Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>
              RPE (Rate of Perceived Exertion):
            </Text>
            {selectedRPE && (
              <Text style={styles.selectedValue}>
                Selected: {selectedRPE}/10
              </Text>
            )}
            <View style={styles.rpeButtons}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map(rpe => (
                <TouchableOpacity
                  key={rpe}
                  style={[
                    styles.rpeButton,
                    selectedRPE === rpe && styles.rpeButtonSelected,
                  ]}
                  onPress={() => setSelectedRPE(rpe)}
                >
                  <Text
                    style={[
                      styles.rpeButtonText,
                      selectedRPE === rpe && styles.rpeButtonTextSelected,
                    ]}
                  >
                    {rpe}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reps Counter */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Completed Reps:</Text>
            <View style={styles.repsCounter}>
              {Array.from({ length: 20 }, (_, i) => i + 1).map(rep => {
                const needsWeight =
                  currentExercise.exerciseName
                    .toLowerCase()
                    .includes('weight') ||
                  currentExercise.exerciseName
                    .toLowerCase()
                    .includes('press') ||
                  currentExercise.exerciseName.toLowerCase().includes('curl') ||
                  currentExercise.exerciseName.toLowerCase().includes('row') ||
                  currentExercise.exerciseName
                    .toLowerCase()
                    .includes('squat') ||
                  currentExercise.exerciseName
                    .toLowerCase()
                    .includes('deadlift') ||
                  currentExercise.exerciseName
                    .toLowerCase()
                    .includes('bench') ||
                  currentExercise.exerciseName
                    .toLowerCase()
                    .includes('dumbbell') ||
                  currentExercise.exerciseName
                    .toLowerCase()
                    .includes('barbell');

                return (
                  <TouchableOpacity
                    key={rep}
                    style={[
                      styles.repButton,
                      needsWeight &&
                        !selectedWeight &&
                        styles.repButtonDisabled,
                    ]}
                    onPress={() => completeSet(rep)}
                    disabled={needsWeight && !selectedWeight}
                  >
                    <Text
                      style={[
                        styles.repButtonText,
                        needsWeight &&
                          !selectedWeight &&
                          styles.repButtonTextDisabled,
                      ]}
                    >
                      {rep}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
                    Set {set.setNumber}: {set.actualReps} reps
                    {set.weight && ` @ ${set.weight}kg`}
                    {set.rpe && ` RPE ${set.rpe}`} ✓
                  </Text>
                ))}
            </View>
          )}

          <View style={styles.exerciseActions}>
            <Button
              onPress={skipExercise}
              variant="secondary"
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
              {
                width: `${(restTimeRemaining / currentExercise.targetRest) * 100}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.restMessage}>
          Great work on set {currentSet - 1}!
        </Text>
        <Text style={styles.nextSetText}>
          Next: Set {currentSet} of {currentExercise.targetSets}
        </Text>

        <View style={styles.restActions}>
          <Button onPress={skipRest} variant="secondary" size="md">
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
              {format(workoutSession.actualDate.toDate(), "EEEE's Training")}
            </Text>

            <View style={styles.summaryStats}>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatValue}>
                  {workoutSession.totalDuration || 0}
                </Text>
                <Text style={styles.summaryStatLabel}>Minutes</Text>
              </View>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatValue}>
                  {currentExercises.length}
                </Text>
                <Text style={styles.summaryStatLabel}>Exercises</Text>
              </View>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatValue}>
                  {workoutSession.totalVolume || 0}
                </Text>
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

      {/* Custom Weight Modal */}
      <Modal
        visible={customWeightModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCustomWeightModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Custom Weight</Text>
            <TextInput
              style={styles.customWeightInput}
              value={customWeightInput}
              onChangeText={setCustomWeightInput}
              placeholder="Enter weight (kg)"
              keyboardType="numeric"
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setCustomWeightModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleCustomWeight}
              >
                <Text style={styles.modalConfirmText}>Add Weight</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  daySelection: {
    marginBottom: 24,
  },
  daySelectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 12,
    textAlign: 'center',
  },
  dayScroll: {
    marginTop: 8,
  },
  dayButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  dayButton: {
    backgroundColor: Colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    maxWidth: 120,
    borderWidth: 2,
    borderColor: 'transparent',
    flex: 0,
  },
  dayButtonSelected: {
    backgroundColor: Colors.primary[100],
    borderColor: Colors.primary[500],
  },
  dayButtonCompleted: {
    backgroundColor: Colors.success + '10',
    borderColor: Colors.success + '40',
  },
  dayButtonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[700],
  },
  dayButtonTextSelected: {
    color: Colors.primary[700],
  },
  dayButtonTextCompleted: {
    color: Colors.success,
  },
  dayButtonSubtext: {
    fontSize: 12,
    color: Colors.gray[500],
    marginTop: 2,
  },
  dayButtonSubtextSelected: {
    color: Colors.primary[600],
  },
  dayButtonSubtextCompleted: {
    color: Colors.success,
  },
  dayChangedIndicator: {
    fontSize: 12,
    color: Colors.secondary[600],
    fontStyle: 'italic',
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
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: 280,
    marginBottom: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
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
    marginBottom: 16,
  },
  readyIndicator: {
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    gap: 8,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicatorText: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  indicatorTextReady: {
    color: Colors.gray[900],
    fontWeight: '600',
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
  horizontalScroll: {
    marginTop: 8,
  },
  weightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    gap: 8,
  },
  weightButton: {
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  weightButtonSelected: {
    backgroundColor: Colors.primary[100],
    borderColor: Colors.primary[500],
  },
  weightButtonText: {
    fontSize: 14,
    color: Colors.gray[700],
    fontWeight: '500',
  },
  weightButtonTextSelected: {
    color: Colors.primary[700],
    fontWeight: '600',
  },
  customWeightButton: {
    backgroundColor: Colors.primary[50],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  customWeightText: {
    fontSize: 12,
    color: Colors.primary[600],
    fontWeight: '600',
  },
  selectedValue: {
    fontSize: 14,
    color: Colors.primary[600],
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 8,
  },
  repsCounter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rpeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  rpeButton: {
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  rpeButtonSelected: {
    backgroundColor: Colors.secondary[100],
    borderColor: Colors.secondary[500],
  },
  rpeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[700],
  },
  rpeButtonTextSelected: {
    color: Colors.secondary[700],
    fontWeight: '600',
  },
  repButton: {
    backgroundColor: Colors.primary[100],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  repButtonDisabled: {
    backgroundColor: Colors.gray[100],
    opacity: 0.5,
  },
  repButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[700],
  },
  repButtonTextDisabled: {
    color: Colors.gray[500],
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

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    textAlign: 'center',
    marginBottom: 20,
  },
  customWeightInput: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[700],
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: Colors.primary[500],
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});
