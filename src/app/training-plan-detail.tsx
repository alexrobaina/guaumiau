import React, { useState } from 'react';
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
import { useAuth } from '@/hooks/useAuth';
import { TrainingPlanService } from '@/lib/services/trainingPlanService';
import { WorkoutSessionService } from '@/lib/services/workoutSessionService';
import { Button } from '@/components/atoms/Button';
import { Colors } from '@/lib/colors';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

// Constants
const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const WEEKDAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DEFAULT_SETS = 3;
const DEFAULT_REST = 90;
const DEFAULT_RPE = 6;
const DEFAULT_REPS = "8-12";
const MAX_RECENT_SESSIONS = 5;
const MAX_RECENT_PRS = 5;
const MAX_TOP_EXERCISES = 5;
const CONSISTENCY_CALCULATION_WEEKS = 4;
const DAYS_PER_WEEK_CALCULATION = 28; // 4 weeks

export default function TrainingPlanDetail() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedView, setSelectedView] = useState<'overview' | 'schedule' | 'progress'>('overview');

  // Helper function to get training days as array
  const getTrainingDaysArray = (trainingPlan: any) => {
    let trainingDaysArray = trainingPlan?.trainingDays;

    console.log('🔍 Analyzing trainingDays structure:', {
      type: typeof trainingDaysArray,
      isArray: Array.isArray(trainingDaysArray),
      keys: trainingDaysArray && typeof trainingDaysArray === 'object' ? Object.keys(trainingDaysArray) : 'N/A',
      raw: trainingDaysArray
    });

    // If trainingDays is not an array, it might be corrupted by progress tracking
    if (!Array.isArray(trainingDaysArray)) {
      if (trainingDaysArray && typeof trainingDaysArray === 'object') {
        // Check if this looks like corrupted progress data (has completion tracking)
        const keys = Object.keys(trainingDaysArray);
        const hasProgressData = keys.some(key => {
          const value = trainingDaysArray[key];
          return value && (value.completions || value.lastCompleted || value.timesCompleted);
        });

        if (hasProgressData) {
          console.warn('⚠️ trainingDays field appears to be corrupted with progress data');

          // Try to restore from known patterns or create a basic template
          console.log('🔧 Attempting to restore training days from corrupted data...');

          // Create a basic template based on the plan structure
          const planDaysPerWeek = trainingPlan?.daysPerWeek || 0;
          const equipment = trainingPlan?.equipment || [];
          const goals = trainingPlan?.goals || [];

          // Generate basic exercises based on plan info
          const generateBasicExercise = (exerciseName: string, category: string = 'general') => ({
            exercise: {
              category,
              defaultReps: DEFAULT_REPS,
              defaultRest: DEFAULT_REST,
              defaultSets: DEFAULT_SETS,
              difficulty: trainingPlan?.difficulty || "beginner",
              equipment: equipment.slice(0, 2), // Use first 2 pieces of equipment
              id: exerciseName.toLowerCase().replace(/\s+/g, '-'),
              measurementType: "reps",
              muscleGroups: [category],
              name: exerciseName,
              subcategory: category
            },
            exerciseId: exerciseName.toLowerCase().replace(/\s+/g, '-'),
            notes: `Generated from ${trainingPlan?.name || 'training plan'}`,
            reps: DEFAULT_REPS,
            rest: DEFAULT_REST,
            rpe: DEFAULT_RPE,
            sets: DEFAULT_SETS,
            weight: ""
          });

          // Create training days based on plan configuration
          return DAYS_OF_WEEK.map((day, index) => {
            const dayName = day.charAt(0).toUpperCase() + day.slice(1);
            const isTrainingDay = index < planDaysPerWeek;

            return {
              day,
              exercises: isTrainingDay ? [
                generateBasicExercise(
                  goals.includes('Strength Building') ? 'Strength Exercise' :
                  goals.includes('Flexibility') ? 'Flexibility Exercise' :
                  'Basic Exercise',
                  goals.includes('Flexibility') ? 'flexibility' : 'strength'
                )
              ] : [],
              isRestDay: !isTrainingDay,
              name: dayName,
              notes: isTrainingDay ? `Training day for ${trainingPlan?.name || 'plan'}` : "Rest day"
            };
          });
        }

        // For other corrupted plans, try to extract valid training days from the corrupted data
        console.warn('⚠️ Training plan is corrupted, attempting to extract training days...');
        const extractedDays: any[] = [];

        // Try to find valid training day objects within the corrupted structure
        keys.forEach(key => {
          const value = trainingDaysArray[key];
          if (value && typeof value === 'object' && value.day) {
            // This looks like a valid training day
            extractedDays.push(value);
          }
        });

        // If we extracted some valid days, return them
        if (extractedDays.length > 0) {
          console.log(`✅ Extracted ${extractedDays.length} training days from corrupted data`);
          return extractedDays;
        }

        // As a fallback, create a minimal working structure using plan data
        console.warn('⚠️ Could not extract training days, creating minimal fallback structure');
        const planDaysPerWeek = trainingPlan?.daysPerWeek || 0;

        return DAYS_OF_WEEK.slice(0, planDaysPerWeek).map((day, index) => ({
          day,
          exercises: [],
          isRestDay: false,
          name: `${day.charAt(0).toUpperCase() + day.slice(1)} Workout`,
          notes: `Restored training day for ${trainingPlan?.name || 'plan'} - please reconfigure exercises`
        }));

        // Try to extract valid training day objects
        const values = Object.values(trainingDaysArray);
        if (values.length > 0 && Array.isArray(values[0])) {
          trainingDaysArray = values[0];
        } else if (values.every(day => day && typeof day === 'object' && day.day)) {
          trainingDaysArray = values;
        }
      }
    }

    return Array.isArray(trainingDaysArray) ? trainingDaysArray : [];
  };

  const { data: trainingPlan, isLoading, error } = useQuery({
    queryKey: ['training-plan', planId],
    queryFn: async () => {
      if (!planId) throw new Error('Plan ID is required');
      return await TrainingPlanService.getTrainingPlan(planId);
    },
    enabled: !!planId,
  });

  // Query for workout sessions related to this plan
  const { data: workoutSessions = [] } = useQuery({
    queryKey: ['workout-sessions', planId, user?.uid],
    queryFn: async () => {
      if (!planId || !user?.uid) return [];
      return await WorkoutSessionService.getPlanWorkoutSessions(planId, user.uid);
    },
    enabled: !!planId && !!user?.uid,
  });

  // Query for comprehensive plan statistics
  const { data: planStats } = useQuery({
    queryKey: ['plan-stats', planId, user?.uid],
    queryFn: async () => {
      if (!planId || !user?.uid) return null;
      return await WorkoutSessionService.getPlanCompletionStats(planId, user.uid);
    },
    enabled: !!planId && !!user?.uid,
  });

  // Query for workout summary
  const { data: workoutSummary } = useQuery({
    queryKey: ['workout-summary', planId, user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      return await WorkoutSessionService.getWorkoutSummary(user.uid, planId);
    },
    enabled: !!user?.uid,
  });

  // Query for personal records
  const { data: personalRecords = [] } = useQuery({
    queryKey: ['personal-records', user?.uid, planId],
    queryFn: async () => {
      if (!user?.uid) return [];
      return await WorkoutSessionService.getPersonalRecords(user.uid, planId);
    },
    enabled: !!user?.uid,
  });

  // Query for exercise analytics
  const { data: exerciseAnalytics = [] } = useQuery({
    queryKey: ['exercise-analytics', user?.uid, planId],
    queryFn: async () => {
      if (!user?.uid) return [];
      return await WorkoutSessionService.getExerciseAnalytics(user.uid, planId);
    },
    enabled: !!user?.uid,
  });

  // Mutation to start training (create workout session)
  const startTrainingMutation = useMutation({
    mutationFn: async () => {
      console.log('🚀 Starting training mutation...');

      if (!trainingPlan || !planId || !user?.uid) {
        console.error('❌ Missing required data:', { trainingPlan: !!trainingPlan, planId, userId: user?.uid });
        throw new Error('Training plan, plan ID, and user are required');
      }

      console.log('📋 Training plan data:', {
        name: trainingPlan.name,
        trainingDays: trainingPlan.trainingDays?.length || 0,
        hasTrainingDays: Array.isArray(trainingPlan.trainingDays),
        trainingDaysRaw: trainingPlan.trainingDays,
        fullPlan: trainingPlan
      });

      // Get training days array using helper function
      const trainingDaysArray = getTrainingDaysArray(trainingPlan);

      // Validate that we have training days
      if (trainingDaysArray.length === 0) {
        console.error('❌ No valid training days found in plan');
        console.error('Raw trainingDays:', trainingPlan.trainingDays);


        throw new Error('This training plan has no training days configured. Please add exercises to the plan first.');
      }

      // Determine today's day of week for scheduling
      const today = new Date();
      const todaysDayName = WEEKDAY_NAMES[today.getDay()];

      // First, try to find today's training day
      let todaysTraining = trainingDaysArray.find(day =>
        day.day === todaysDayName && !day.isRestDay && day.exercises && day.exercises.length > 0
      );

      // If today is a rest day or has no exercises, find the next available training day
      if (!todaysTraining) {
        console.log('📅 Today is a rest day or has no exercises, finding next available training day...');
        todaysTraining = trainingDaysArray.find(day =>
          !day.isRestDay && day.exercises && day.exercises.length > 0
        );
      }

      // If still no training day found, show error
      if (!todaysTraining || !todaysTraining.exercises || todaysTraining.exercises.length === 0) {
        console.error('❌ No training days with exercises found in plan');
        throw new Error('This training plan has no training days with exercises configured. Please add exercises to at least one training day.');
      }

      console.log('🏋️ Creating workout session for:', todaysTraining.name || 'Training Day', 'with', todaysTraining.exercises.length, 'exercises');

      const dayOfWeek = todaysDayName as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

      const sessionId = await WorkoutSessionService.createWorkoutSession(
        planId,
        user.uid,
        todaysTraining,
        dayOfWeek,
        new Date()
      );

      console.log('✅ Workout session created with ID:', sessionId);
      return sessionId;
    },
    onSuccess: (sessionId) => {
      console.log('✅ Navigating to workout session:', sessionId);
      router.push(`/workout-session?sessionId=${sessionId}`);
    },
    onError: (error) => {
      console.error('❌ Error starting training:', error);
      Alert.alert('Error', error.message || 'Failed to start training session. Please try again.');
    },
  });

  // Mutation to restart a completed plan
  const restartPlanMutation = useMutation({
    mutationFn: async () => {
      if (!trainingPlan || !planId || !user?.uid) {
        throw new Error('Training plan, plan ID, and user are required');
      }

      console.log('🔄 Restarting training plan:', planId);
      return await TrainingPlanService.restartTrainingPlan(planId, user.uid);
    },
    onSuccess: (restartedPlanId) => {
      console.log('✅ Plan restarted successfully:', restartedPlanId);
      // Invalidate and refetch the plan data
      queryClient.invalidateQueries({ queryKey: ['training-plan', planId] });
      queryClient.invalidateQueries({ queryKey: ['training-plans', user?.uid] });

      Alert.alert(
        'Plan Restarted!',
        'Your training plan has been reset and is ready to start again. All your previous progress has been preserved.',
        [{ text: 'OK' }]
      );
    },
    onError: (error) => {
      console.error('❌ Error restarting plan:', error);
      Alert.alert('Error', error.message || 'Failed to restart training plan. Please try again.');
    },
  });

  const handleActivatePlan = async () => {
    if (!trainingPlan || !planId) return;

    Alert.alert(
      'Activate Training Plan',
      `Are you sure you want to activate "${trainingPlan.name}"? This will set it as your current active plan.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Activate',
          style: 'default',
          onPress: async () => {
            try {
              await TrainingPlanService.activateTrainingPlan(planId);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to activate training plan. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleRestartPlan = async () => {
    if (!trainingPlan || !planId) return;

    Alert.alert(
      'Restart Training Plan',
      `Are you sure you want to restart "${trainingPlan.name}"? This will reset your progress and start the plan from the beginning.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restart',
          style: 'destructive',
          onPress: () => restartPlanMutation.mutate(),
        },
      ]
    );
  };

  const ExerciseCard = ({ exercise }: { exercise: any }) => (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{exercise.exercise.name}</Text>
        <Text style={styles.exerciseCategory}>{exercise.exercise.category}</Text>
      </View>
      <View style={styles.exerciseDetails}>
        {exercise.sets && (
          <Text style={styles.exerciseDetail}>Sets: {exercise.sets}</Text>
        )}
        {exercise.reps && (
          <Text style={styles.exerciseDetail}>Reps: {exercise.reps}</Text>
        )}
        {exercise.duration && (
          <Text style={styles.exerciseDetail}>Duration: {exercise.duration}</Text>
        )}
        {exercise.rest && (
          <Text style={styles.exerciseDetail}>Rest: {exercise.rest}s</Text>
        )}
        {exercise.rpe && (
          <Text style={styles.exerciseDetail}>RPE: {exercise.rpe}/10</Text>
        )}
      </View>
      {exercise.notes && (
        <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
      )}
    </View>
  );

  const DayCard = ({ day }: { day: any }) => (
    <View style={styles.dayCard}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayName}>{day.name}</Text>
        <Text style={styles.dayType}>
          {day.isRestDay ? 'Rest Day' : `${day.exercises?.length || 0} exercises`}
        </Text>
      </View>
      {!day.isRestDay && day.exercises && (
        <View style={styles.exercisesList}>
          {day.exercises.map((exercise: any, index: number) => (
            <ExerciseCard key={index} exercise={exercise} />
          ))}
        </View>
      )}
      {day.notes && (
        <Text style={styles.dayNotes}>{day.notes}</Text>
      )}
    </View>
  );

  const renderOverview = () => {
    if (!trainingPlan) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plan Overview</Text>

        <View style={styles.overviewCard}>
          <View style={styles.overviewItem}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary[500]} />
            <Text style={styles.overviewLabel}>Duration</Text>
            <Text style={styles.overviewValue}>{trainingPlan.duration} weeks</Text>
          </View>

          <View style={styles.overviewItem}>
            <Ionicons name="fitness-outline" size={20} color={Colors.primary[500]} />
            <Text style={styles.overviewLabel}>Training Days</Text>
            <Text style={styles.overviewValue}>{trainingPlan.daysPerWeek} days/week</Text>
          </View>

          <View style={styles.overviewItem}>
            <Ionicons name="trophy-outline" size={20} color={Colors.primary[500]} />
            <Text style={styles.overviewLabel}>Difficulty</Text>
            <Text style={styles.overviewValue}>{trainingPlan.difficulty}</Text>
          </View>

          <View style={styles.overviewItem}>
            <Ionicons name="construct-outline" size={20} color={Colors.primary[500]} />
            <Text style={styles.overviewLabel}>Equipment</Text>
            <Text style={styles.overviewValue}>{trainingPlan.equipment?.join(', ') || 'None specified'}</Text>
          </View>
        </View>

        {trainingPlan.description && (
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{trainingPlan.description}</Text>
          </View>
        )}

        {trainingPlan.goals && trainingPlan.goals.length > 0 && (
          <View style={styles.goalsCard}>
            <Text style={styles.goalsTitle}>Training Goals</Text>
            <View style={styles.goalsList}>
              {trainingPlan.goals.map((goal, index) => (
                <View key={index} style={styles.goalChip}>
                  <Text style={styles.goalText}>{goal}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderSchedule = () => {
    const trainingDaysArray = getTrainingDaysArray(trainingPlan);

    if (trainingDaysArray.length === 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Schedule</Text>
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={Colors.gray[400]} />
            <Text style={styles.emptyStateText}>No training days configured</Text>
            <Text style={styles.emptyStateSubtext}>
              This training plan doesn't have any training days set up yet.
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Schedule</Text>
        {trainingDaysArray.map((day, index) => (
          <DayCard key={index} day={day} />
        ))}
      </View>
    );
  };

  const renderProgress = () => {
    // Use API data first, fallback to calculated values
    const daysCompleted = planStats?.completedWorkouts || trainingPlan?.progress?.completedDays || 0;
    const totalDays = planStats?.totalWorkouts || trainingPlan?.progress?.totalDays || ((trainingPlan?.duration || 0) * (trainingPlan?.daysPerWeek || 0));
    const completionPercentage = planStats?.completionRate || trainingPlan?.progress?.completionRate ||
      (totalDays > 0 ? Math.round((daysCompleted / totalDays) * 100) : 0);

    // Use API data for workout statistics
    const totalVolume = planStats?.totalVolume || workoutSummary?.totalVolume || 0;
    const averageDuration = workoutSummary?.totalDuration && workoutSummary?.completedWorkouts > 0
      ? Math.round(workoutSummary.totalDuration / workoutSummary.completedWorkouts)
      : 0;
    const streakDays = planStats?.streakDays || workoutSummary?.streakDays || trainingPlan?.progress?.streakDays || 0;
    const lastWorkoutDate = workoutSummary?.lastWorkout || trainingPlan?.progress?.lastWorkoutDate;

    // Process workout sessions data
    const completedSessions = workoutSessions.filter(session => session.status === 'completed');
    const inProgressSessions = workoutSessions.filter(session => session.status === 'in_progress');

    // Recent sessions for history
    const recentSessions = completedSessions
      .sort((a, b) => b.actualDate.toMillis() - a.actualDate.toMillis())
      .slice(0, MAX_RECENT_SESSIONS);

    // Weekly progress using API data or calculation
    const weeksData = planStats?.weeklyProgress || [];

    // If no API data, calculate manually
    if (weeksData.length === 0) {
      const weeks = trainingPlan?.duration || 0;
      const daysPerWeek = trainingPlan?.daysPerWeek || 0;

      for (let week = 1; week <= weeks; week++) {
        const weekSessions = completedSessions.filter(session => {
          // Simple approximation: divide completed days by days per week
          const sessionWeek = Math.ceil((completedSessions.indexOf(session) + 1) / daysPerWeek);
          return sessionWeek === week;
        });

        weeksData.push({
          week,
          completed: weekSessions.length,
          total: daysPerWeek
        });
      }
    }

    // Use API data for personal records and exercise analytics
    const recentPRs = personalRecords.slice(0, MAX_RECENT_PRS);
    const topExercises = exerciseAnalytics.slice(0, MAX_TOP_EXERCISES);

    // Consistency calculation (days per week over last 4 weeks)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - DAYS_PER_WEEK_CALCULATION);

    const recentSessionsForConsistency = completedSessions.filter(session =>
      session.actualDate.toDate() >= fourWeeksAgo
    );

    const consistencyRate = Math.round((recentSessionsForConsistency.length / CONSISTENCY_CALCULATION_WEEKS) * 10) / 10; // sessions per week

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress</Text>

        {/* Overall Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Overall Progress</Text>
            <Text style={styles.progressPercentage}>{completionPercentage}%</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
          </View>

          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatValue}>{daysCompleted}</Text>
              <Text style={styles.progressStatLabel}>Days Completed</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatValue}>{totalDays - daysCompleted}</Text>
              <Text style={styles.progressStatLabel}>Days Remaining</Text>
            </View>
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="flame-outline" size={24} color={Colors.warning} />
            <Text style={styles.statValue}>{streakDays}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="barbell-outline" size={24} color={Colors.primary[500]} />
            <Text style={styles.statValue}>{totalVolume.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total Volume (kg)</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color={Colors.info} />
            <Text style={styles.statValue}>{averageDuration}</Text>
            <Text style={styles.statLabel}>Avg Duration (min)</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color={Colors.success} />
            <Text style={styles.statValue}>{completedSessions.length}</Text>
            <Text style={styles.statLabel}>Sessions Done</Text>
          </View>
        </View>

        {/* Weekly Progress */}
        {weeksData.length > 0 && (
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Weekly Progress</Text>
            <View style={styles.weeklyProgress}>
              {weeksData.map((week) => (
                <View key={week.week} style={styles.weekItem}>
                  <Text style={styles.weekLabel}>Week {week.week}</Text>
                  <View style={styles.weekBar}>
                    <View style={[styles.weekFill, { width: `${Math.round((week.completed / (week.total || 1)) * 100)}%` }]} />
                  </View>
                  <Text style={styles.weekStats}>{week.completed}/{week.total}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Recent Sessions</Text>
            <View style={styles.sessionsList}>
              {recentSessions.map((session, index) => {
                const sessionDate = session.actualDate.toDate();
                const dateText = isToday(sessionDate)
                  ? 'Today'
                  : isYesterday(sessionDate)
                    ? 'Yesterday'
                    : format(sessionDate, 'MMM dd');

                return (
                  <View key={session.id} style={styles.sessionItem}>
                    <View style={styles.sessionIcon}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={Colors.success}
                      />
                    </View>
                    <View style={styles.sessionDetails}>
                      <Text style={styles.sessionDate}>{dateText}</Text>
                      <Text style={styles.sessionInfo}>
                        {session.exercises?.length || 0} exercises • {session.totalDuration || 0} min
                      </Text>
                    </View>
                    <View style={styles.sessionStats}>
                      {session.totalVolume && (
                        <Text style={styles.sessionVolume}>
                          {session.totalVolume.toFixed(0)}kg
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Personal Records */}
        {recentPRs.length > 0 && (
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Recent Personal Records 🏆</Text>
            <View style={styles.recordsList}>
              {recentPRs.map((pr, index) => (
                <View key={index} style={styles.recordItem}>
                  <View style={styles.recordIcon}>
                    <Ionicons
                      name={pr.type === 'weight' ? 'barbell-outline' : 'trending-up-outline'}
                      size={16}
                      color={Colors.warning}
                    />
                  </View>
                  <View style={styles.recordDetails}>
                    <Text style={styles.recordExercise}>{pr.exercise}</Text>
                    <Text style={styles.recordInfo}>
                      {pr.type === 'weight'
                        ? `${pr.value}kg × ${pr.reps} reps`
                        : `${pr.value.toFixed(0)}kg volume (${pr.weight}kg × ${pr.reps})`
                      }
                    </Text>
                  </View>
                  <Text style={styles.recordDate}>
                    {format(pr.date, 'MMM dd')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Top Exercises by Volume */}
        {topExercises.length > 0 && (
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Top Exercises by Volume</Text>
            <View style={styles.exerciseAnalytics}>
              {topExercises.map((exercise: any, index: number) => (
                <View key={index} style={styles.exerciseAnalyticsItem}>
                  <View style={styles.exerciseRank}>
                    <Text style={styles.exerciseRankNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.exerciseAnalyticsDetails}>
                    <Text style={styles.exerciseAnalyticsName}>{exercise.name}</Text>
                    <Text style={styles.exerciseAnalyticsStats}>
                      {exercise.totalVolume.toFixed(0)}kg total • {exercise.totalSets} sets
                    </Text>
                    <Text style={styles.exerciseAnalyticsRecord}>
                      Best: {exercise.maxWeight}kg
                    </Text>
                  </View>
                  <View style={styles.exerciseProgress}>
                    <View style={styles.exerciseProgressBar}>
                      <View
                        style={[
                          styles.exerciseProgressFill,
                          { width: `${Math.min((exercise.totalVolume / topExercises[0].totalVolume) * 100, 100)}%` }
                        ]}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Consistency Insights */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Training Consistency</Text>
          <View style={styles.consistencyMetrics}>
            <View style={styles.consistencyItem}>
              <Ionicons name="calendar-outline" size={24} color={Colors.info} />
              <Text style={styles.consistencyValue}>{consistencyRate}</Text>
              <Text style={styles.consistencyLabel}>sessions/week</Text>
              <Text style={styles.consistencySubtext}>Last 4 weeks</Text>
            </View>

            <View style={styles.consistencyItem}>
              <Ionicons name="trending-up-outline" size={24} color={Colors.success} />
              <Text style={styles.consistencyValue}>
                {Math.round((completedSessions.length / (trainingPlan?.duration || 1)) * 10) / 10}
              </Text>
              <Text style={styles.consistencyLabel}>sessions/week</Text>
              <Text style={styles.consistencySubtext}>Plan average</Text>
            </View>

            <View style={styles.consistencyItem}>
              <Ionicons
                name={consistencyRate >= (trainingPlan?.daysPerWeek || 0) ? "checkmark-circle-outline" : "time-outline"}
                size={24}
                color={consistencyRate >= (trainingPlan?.daysPerWeek || 0) ? Colors.success : Colors.warning}
              />
              <Text style={[
                styles.consistencyValue,
                { color: consistencyRate >= (trainingPlan?.daysPerWeek || 0) ? Colors.success : Colors.warning }
              ]}>
                {consistencyRate >= (trainingPlan?.daysPerWeek || 0) ? 'On Track' : 'Behind'}
              </Text>
              <Text style={styles.consistencyLabel}>vs target</Text>
              <Text style={styles.consistencySubtext}>
                Target: {trainingPlan?.daysPerWeek || 0}/week
              </Text>
            </View>
          </View>
        </View>

        {/* Last Workout Info */}
        {lastWorkoutDate && (
          <View style={styles.lastWorkoutCard}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary[500]} />
            <Text style={styles.lastWorkoutText}>
              Last workout: {formatDistanceToNow(lastWorkoutDate.toDate())} ago
            </Text>
          </View>
        )}

        {/* Empty State for No Sessions */}
        {completedSessions.length === 0 && (
          <View style={styles.emptyProgressState}>
            <Ionicons name="fitness-outline" size={48} color={Colors.gray[400]} />
            <Text style={styles.emptyProgressTitle}>No Workouts Yet</Text>
            <Text style={styles.emptyProgressText}>
              Complete your first workout to start tracking your progress!
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
          <Text style={styles.loadingText}>Loading training plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !trainingPlan) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color={Colors.error} />
          <Text style={styles.errorText}>Unable to load training plan</Text>
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
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{trainingPlan.name}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.headerInfo}>
          <View style={[
            styles.statusBadge,
            trainingPlan.status === 'active' ? styles.statusActive :
            trainingPlan.status === 'completed' ? styles.statusCompleted : styles.statusInactive
          ]}>
            <Text style={[
              styles.statusText,
              trainingPlan.status === 'active' ? styles.statusTextActive :
              trainingPlan.status === 'completed' ? styles.statusTextCompleted : styles.statusTextInactive
            ]}>
              {trainingPlan.status === 'active' ? 'Active' :
               trainingPlan.status === 'completed' ? 'Completed' :
               trainingPlan.status === 'draft' ? 'Draft' : 'Paused'}
            </Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Created {trainingPlan.createdAt && trainingPlan.createdAt.toDate
              ? formatDistanceToNow(trainingPlan.createdAt.toDate()) + ' ago'
              : 'Unknown'}
          </Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.tab, selectedView === 'overview' && styles.tabActive]}
            onPress={() => setSelectedView('overview')}
          >
            <Text style={[styles.tabText, selectedView === 'overview' && styles.tabTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedView === 'schedule' && styles.tabActive]}
            onPress={() => setSelectedView('schedule')}
          >
            <Text style={[styles.tabText, selectedView === 'schedule' && styles.tabTextActive]}>
              Schedule
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedView === 'progress' && styles.tabActive]}
            onPress={() => setSelectedView('progress')}
          >
            <Text style={[styles.tabText, selectedView === 'progress' && styles.tabTextActive]}>
              Progress
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedView === 'overview' && renderOverview()}
        {selectedView === 'schedule' && renderSchedule()}
        {selectedView === 'progress' && renderProgress()}
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionButtonContainer}>
        {trainingPlan.status === 'draft' ? (
          <Button
            onPress={handleActivatePlan}
            variant="primary"
            size="lg"
            style={styles.actionButton}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="play-outline" size={20} color={Colors.white} />
              <Text style={styles.buttonText}>Activate Plan</Text>
            </View>
          </Button>
        ) : trainingPlan.status === 'active' ? (
          <Button
            onPress={() => startTrainingMutation.mutate()}
            variant="primary"
            size="lg"
            style={styles.actionButton}
            loading={startTrainingMutation.isPending}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="fitness-outline" size={20} color={Colors.white} />
              <Text style={styles.buttonText}>Start Training</Text>
            </View>
          </Button>
        ) : trainingPlan.status === 'completed' ? (
          <View style={styles.completedActions}>
            <Text style={styles.completedMessage}>
              🎉 Congratulations! You've completed this training plan!
            </Text>
            <Button
              onPress={handleRestartPlan}
              variant="primary"
              size="lg"
              style={[styles.actionButton, styles.restartButton]}
              loading={restartPlanMutation.isPending}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="refresh-outline" size={20} color={Colors.white} />
                <Text style={styles.buttonText}>Restart Plan</Text>
              </View>
            </Button>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 16,
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
  headerInfo: {
    paddingHorizontal: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusActive: {
    backgroundColor: Colors.success + '20',
  },
  statusCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextActive: {
    color: Colors.success,
  },
  statusTextCompleted: {
    color: Colors.white,
  },
  statusTextInactive: {
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  tabSelector: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.white,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  tabTextActive: {
    color: Colors.primary[600],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 16,
  },
  overviewCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewLabel: {
    fontSize: 14,
    color: Colors.gray[600],
    marginLeft: 12,
    flex: 1,
  },
  overviewValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  descriptionCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.gray[600],
    lineHeight: 20,
  },
  goalsCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 12,
  },
  goalsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    backgroundColor: Colors.primary[100],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  goalText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary[700],
  },
  dayCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    textTransform: 'capitalize',
  },
  dayType: {
    fontSize: 12,
    color: Colors.gray[600],
  },
  exercisesList: {
    gap: 8,
  },
  exerciseCard: {
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    padding: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[900],
    flex: 1,
  },
  exerciseCategory: {
    fontSize: 12,
    color: Colors.primary[600],
    textTransform: 'capitalize',
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  exerciseDetail: {
    fontSize: 12,
    color: Colors.gray[600],
  },
  exerciseNotes: {
    fontSize: 12,
    color: Colors.gray[600],
    fontStyle: 'italic',
  },
  dayNotes: {
    fontSize: 12,
    color: Colors.gray[600],
    fontStyle: 'italic',
    marginTop: 8,
  },
  progressCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary[500],
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray[900],
  },
  progressStatLabel: {
    fontSize: 12,
    color: Colors.gray[600],
    marginTop: 4,
  },
  comingSoonCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginTop: 12,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButtonContainer: {
    padding: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[600],
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.gray[500],
    textAlign: 'center',
    lineHeight: 20,
  },
  completedActions: {
    alignItems: 'center',
    gap: 16,
  },
  completedMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  restartButton: {
    backgroundColor: Colors.primary[500],
  },
  // New styles for enhanced progress tab
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray[600],
    textAlign: 'center',
  },
  weeklyProgress: {
    marginTop: 16,
    gap: 12,
  },
  weekItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weekLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[900],
    width: 60,
  },
  weekBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: 4,
  },
  weekFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 4,
  },
  weekStats: {
    fontSize: 12,
    color: Colors.gray[600],
    width: 40,
    textAlign: 'right',
  },
  sessionsList: {
    marginTop: 16,
    gap: 12,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sessionIcon: {
    marginRight: 12,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 2,
  },
  sessionInfo: {
    fontSize: 12,
    color: Colors.gray[600],
  },
  sessionStats: {
    alignItems: 'flex-end',
  },
  sessionVolume: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary[600],
  },
  lastWorkoutCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lastWorkoutText: {
    fontSize: 14,
    color: Colors.gray[700],
    flex: 1,
  },
  emptyProgressState: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyProgressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginTop: 12,
    marginBottom: 8,
  },
  emptyProgressText: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 20,
  },
  // Personal Records styles
  recordsList: {
    marginTop: 16,
    gap: 12,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  recordIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recordDetails: {
    flex: 1,
  },
  recordExercise: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 2,
  },
  recordInfo: {
    fontSize: 12,
    color: Colors.gray[600],
  },
  recordDate: {
    fontSize: 12,
    color: Colors.primary[600],
    fontWeight: '500',
  },
  // Exercise Analytics styles
  exerciseAnalytics: {
    marginTop: 16,
    gap: 12,
  },
  exerciseAnalyticsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  exerciseRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseRankNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
  },
  exerciseAnalyticsDetails: {
    flex: 1,
  },
  exerciseAnalyticsName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 2,
  },
  exerciseAnalyticsStats: {
    fontSize: 12,
    color: Colors.gray[600],
    marginBottom: 2,
  },
  exerciseAnalyticsRecord: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '500',
  },
  exerciseProgress: {
    width: 60,
    alignItems: 'flex-end',
  },
  exerciseProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.gray[200],
    borderRadius: 2,
  },
  exerciseProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 2,
  },
  // Consistency styles
  consistencyMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  consistencyItem: {
    alignItems: 'center',
    flex: 1,
  },
  consistencyValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginTop: 8,
    marginBottom: 4,
  },
  consistencyLabel: {
    fontSize: 12,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 2,
  },
  consistencySubtext: {
    fontSize: 10,
    color: Colors.gray[500],
    textAlign: 'center',
  },
});