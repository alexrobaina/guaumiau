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
import { useQuery } from '@tanstack/react-query';
import { TrainingPlanService } from '@/lib/services/trainingPlanService';
import { WorkoutSessionService } from '@/lib/services/workoutSessionService';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/atoms/Button';
import { Colors } from '@/lib/colors';
import { WorkoutSession, DayOfWeek } from '@/types/workout';
import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';

const DAYS_OF_WEEK: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function TrainingDashboard() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(() => {
    const today = new Date().getDay();
    return DAYS_OF_WEEK[today === 0 ? 6 : today - 1]; // Convert Sunday=0 to Saturday index
  });

  // Get training plan
  const { data: trainingPlan, isLoading: planLoading } = useQuery({
    queryKey: ['training-plan', planId],
    queryFn: async () => {
      if (!planId) throw new Error('Plan ID is required');
      return await TrainingPlanService.getTrainingPlan(planId);
    },
    enabled: !!planId,
  });

  // Get today's workout session
  const { data: todaysWorkout, isLoading: workoutLoading, refetch } = useQuery({
    queryKey: ['todays-workout', user?.uid, planId],
    queryFn: async () => {
      if (!user?.uid || !planId) return null;
      return await WorkoutSessionService.getTodaysWorkout(user.uid, planId);
    },
    enabled: !!user?.uid && !!planId,
  });

  // Get workout sessions for this plan
  const { data: workoutSessions = [] } = useQuery({
    queryKey: ['plan-workout-sessions', planId, user?.uid],
    queryFn: async () => {
      if (!planId || !user?.uid) return [];
      return await WorkoutSessionService.getPlanWorkoutSessions(planId, user.uid);
    },
    enabled: !!planId && !!user?.uid,
  });

  // Helper to check if training plan has valid structure
  const hasValidTrainingDays = (plan: any) => {
    return plan?.trainingDays && Array.isArray(plan.trainingDays) && plan.trainingDays.length > 0;
  };

  const getTodaysTrainingDay = () => {
    if (!hasValidTrainingDays(trainingPlan)) return null;
    const today = new Date().getDay();
    const dayName = DAYS_OF_WEEK[today === 0 ? 6 : today - 1];
    return trainingPlan.trainingDays?.find(day => day.day === dayName) || null;
  };

  const getSelectedTrainingDay = () => {
    if (!hasValidTrainingDays(trainingPlan)) return null;
    return trainingPlan.trainingDays?.find(day => day.day === selectedDay) || null;
  };

  const startTodaysWorkout = async () => {
    if (!trainingPlan || !user?.uid) return;

    try {
      const todaysTrainingDay = getTodaysTrainingDay();
      if (!todaysTrainingDay) {
        Alert.alert('No workout scheduled', 'There is no workout scheduled for today.');
        return;
      }

      if (todaysTrainingDay.isRestDay) {
        Alert.alert('Rest Day', 'Today is a rest day. Take some time to recover!');
        return;
      }

      let sessionId: string;

      if (todaysWorkout) {
        sessionId = todaysWorkout.id;
      } else {
        // Create new workout session
        const today = new Date().getDay();
        const dayName = DAYS_OF_WEEK[today === 0 ? 6 : today - 1];
        sessionId = await WorkoutSessionService.createWorkoutSession(
          planId!,
          user.uid,
          todaysTrainingDay,
          dayName
        );
      }

      // Start the workout session
      await WorkoutSessionService.startWorkoutSession(sessionId, user.uid);

      // Navigate to pre-workout screen
      router.push(`/workout-session?sessionId=${sessionId}`);
    } catch (error) {
      console.error('Error starting workout:', error);
      Alert.alert('Error', 'Failed to start workout. Please try again.');
    }
  };

  const startSelectedDayWorkout = async () => {
    if (!trainingPlan || !user?.uid) return;

    try {
      const selectedTrainingDay = getSelectedTrainingDay();
      if (!selectedTrainingDay) {
        Alert.alert('No workout', 'No workout found for the selected day.');
        return;
      }

      if (selectedTrainingDay.isRestDay) {
        Alert.alert('Rest Day', 'This is a rest day. Consider choosing a different day.');
        return;
      }

      // Create new workout session for selected day
      const sessionId = await WorkoutSessionService.createWorkoutSession(
        planId!,
        user.uid,
        selectedTrainingDay,
        selectedDay,
        new Date() // Use current date even if different day selected
      );

      // Start the workout session
      await WorkoutSessionService.startWorkoutSession(sessionId, user.uid);

      // Navigate to pre-workout screen
      router.push(`/workout-session?sessionId=${sessionId}`);
    } catch (error) {
      console.error('Error starting workout:', error);
      Alert.alert('Error', 'Failed to start workout. Please try again.');
    }
  };

  const getWeekProgress = () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return weekDays.map(date => {
      const dayName = DAYS_OF_WEEK[date.getDay() === 0 ? 6 : date.getDay() - 1];
      const trainingDay = trainingPlan?.trainingDays?.find(day => day.day === dayName);
      const hasWorkout = trainingDay && !trainingDay.isRestDay;

      // Check if there's a completed workout for this day
      const completedWorkout = workoutSessions.find(session =>
        isSameDay(session.actualDate.toDate(), date) && session.status === 'completed'
      );

      return {
        date,
        dayName,
        hasWorkout,
        isCompleted: !!completedWorkout,
        isToday: isToday(date),
        isRestDay: trainingDay?.isRestDay || false,
      };
    });
  };

  const calculateStreak = () => {
    let streak = 0;
    const sortedSessions = workoutSessions
      .filter(session => session.status === 'completed')
      .sort((a, b) => b.actualDate.toMillis() - a.actualDate.toMillis());

    if (sortedSessions.length > 0) {
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (const session of sortedSessions) {
        const sessionDate = session.actualDate.toDate();
        sessionDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === streak || (streak === 0 && daysDiff <= 1)) {
          streak++;
          currentDate = new Date(sessionDate);
        } else {
          break;
        }
      }
    }

    return streak;
  };

  if (planLoading || workoutLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
          <Text style={styles.loadingText}>Loading your training...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!trainingPlan) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color={Colors.error} />
          <Text style={styles.errorText}>Training plan not found</Text>
          <Button onPress={() => router.back()} variant="primary" size="lg">
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (!hasValidTrainingDays(trainingPlan)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="calendar-outline" size={48} color={Colors.warning} />
          <Text style={styles.errorText}>No Training Days Configured</Text>
          <Text style={styles.errorSubtext}>
            This training plan doesn't have any training days set up yet.
          </Text>
          <Button onPress={() => router.back()} variant="primary" size="lg">
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const todaysTrainingDay = getTodaysTrainingDay();
  const selectedTrainingDay = getSelectedTrainingDay();

  // Use selected day if different from today, otherwise use today's training day
  const currentDay = new Date().getDay();
  const todayDayName = DAYS_OF_WEEK[currentDay === 0 ? 6 : currentDay - 1];
  const isSelectedDayToday = selectedDay === todayDayName;
  const displayedTrainingDay = isSelectedDayToday ? todaysTrainingDay : selectedTrainingDay;
  const displayedDayName = isSelectedDayToday ? 'Today' : selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1);
  const weekProgress = getWeekProgress();
  const streak = calculateStreak();

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
          <Text style={styles.headerTitle}>{displayedDayName}'s Training</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.headerDate}>
          {isSelectedDayToday
            ? format(new Date(), 'EEEE, MMM d')
            : `${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} Training`
          }
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Workout Card */}
        <View style={styles.todaysWorkoutCard}>
          {displayedTrainingDay ? (
            displayedTrainingDay.isRestDay ? (
              <>
                <View style={styles.restDayIcon}>
                  <Ionicons name="moon-outline" size={48} color={Colors.primary[500]} />
                </View>
                <Text style={styles.restDayTitle}>Rest Day</Text>
                <Text style={styles.restDayDescription}>
                  Your muscles need time to recover. Take it easy today!
                </Text>
              </>
            ) : (
              <>
                <View style={styles.workoutIcon}>
                  <Ionicons name="fitness-outline" size={48} color={Colors.primary[500]} />
                </View>
                <Text style={styles.workoutTitle}>{displayedTrainingDay.name}</Text>
                <Text style={styles.workoutStats}>
                  {displayedTrainingDay.exercises?.length || 0} exercises • ~{Math.round((displayedTrainingDay.exercises?.length || 0) * 8)} min
                </Text>

                {/* Show continue/completed status only for today's workout */}
                {isSelectedDayToday && todaysWorkout && todaysWorkout.status === 'in_progress' ? (
                  <Button
                    onPress={() => router.push(`/workout-session?sessionId=${todaysWorkout.id}`)}
                    variant="secondary"
                    size="lg"
                    style={styles.workoutButton}
                  >
                    <Ionicons name="play-outline" size={20} color={Colors.white} />
                    Continue Workout
                  </Button>
                ) : isSelectedDayToday && todaysWorkout && todaysWorkout.status === 'completed' ? (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                    <Text style={styles.completedText}>Completed!</Text>
                  </View>
                ) : (
                  <Button
                    onPress={isSelectedDayToday ? startTodaysWorkout : startSelectedDayWorkout}
                    variant="primary"
                    size="lg"
                    style={styles.workoutButton}
                  >
                    <Ionicons name="play-outline" size={20} color={Colors.white} />
                    Start {displayedDayName}'s Workout
                  </Button>
                )}
              </>
            )
          ) : (
            <>
              <View style={styles.noWorkoutIcon}>
                <Ionicons name="calendar-outline" size={48} color={Colors.gray[400]} />
              </View>
              <Text style={styles.noWorkoutTitle}>No Workout Scheduled</Text>
              <Text style={styles.noWorkoutDescription}>
                There's no workout scheduled for {displayedDayName.toLowerCase()} in your plan.
              </Text>
            </>
          )}
        </View>

        {/* Alternative Day Selection */}
        <View style={styles.alternativeSection}>
          <Text style={styles.sectionTitle}>Or train a different day:</Text>

          <View style={styles.daySelector}>
            {DAYS_OF_WEEK.map((day) => {
              const trainingDay = trainingPlan?.trainingDays?.find(td => td.day === day);
              const isSelected = selectedDay === day;
              const hasWorkout = trainingDay && !trainingDay.isRestDay;

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    isSelected && styles.dayButtonSelected,
                    !hasWorkout && styles.dayButtonDisabled,
                  ]}
                  onPress={() => setSelectedDay(day)}
                  disabled={!hasWorkout}
                >
                  <Text style={[
                    styles.dayButtonText,
                    isSelected && styles.dayButtonTextSelected,
                    !hasWorkout && styles.dayButtonTextDisabled,
                  ]}>
                    {day.slice(0, 3).toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Hide this section since the main card now shows the selected day */}
          {false && selectedTrainingDay && !selectedTrainingDay.isRestDay && !isSelectedDayToday && (
            <View style={styles.selectedDayInfo}>
              <Text style={styles.selectedDayTitle}>{selectedTrainingDay.name}</Text>
              <Text style={styles.selectedDayStats}>
                {selectedTrainingDay.exercises?.length || 0} exercises
              </Text>
              <Button
                onPress={startSelectedDayWorkout}
                variant="outline"
                size="md"
                style={styles.startSelectedButton}
              >
                Start {selectedDay} Workout
              </Button>
            </View>
          )}
        </View>

        {/* Week Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>This Week's Progress</Text>

          <View style={styles.weekProgress}>
            {weekProgress.map((day, index) => (
              <View key={index} style={styles.progressDay}>
                <Text style={styles.progressDayLabel}>
                  {format(day.date, 'EEE').slice(0, 1)}
                </Text>
                <View style={[
                  styles.progressDayCircle,
                  day.isCompleted && styles.progressDayCompleted,
                  day.isToday && styles.progressDayToday,
                  day.isRestDay && styles.progressDayRest,
                ]}>
                  {day.isCompleted ? (
                    <Ionicons name="checkmark" size={12} color={Colors.white} />
                  ) : day.isRestDay ? (
                    <Ionicons name="moon" size={10} color={Colors.gray[400]} />
                  ) : day.hasWorkout ? (
                    <View style={styles.progressDayDot} />
                  ) : null}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={20} color={Colors.orange} />
            <Text style={styles.streakText}>Streak: {streak} days</Text>
          </View>

          {/* Training Plan Stats */}
          {trainingPlan?.progress && (
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name="trophy-outline" size={16} color={Colors.primary[500]} />
                  <Text style={styles.statTitle}>Plan Progress</Text>
                </View>
                <Text style={styles.statValue}>{Math.round(trainingPlan.progress.completionRate)}%</Text>
                <Text style={styles.statSubtitle}>
                  {trainingPlan.progress.completedDays} of {trainingPlan.progress.totalDays} days
                </Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name="flame-outline" size={16} color={Colors.secondary[500]} />
                  <Text style={styles.statTitle}>Streak</Text>
                </View>
                <Text style={styles.statValue}>{trainingPlan.progress.streakDays}</Text>
                <Text style={styles.statSubtitle}>days</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name="barbell-outline" size={16} color={Colors.tertiary[500]} />
                  <Text style={styles.statTitle}>Total Volume</Text>
                </View>
                <Text style={styles.statValue}>{(trainingPlan.progress.totalVolume / 1000).toFixed(1)}k</Text>
                <Text style={styles.statSubtitle}>kg lifted</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
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
    marginBottom: 8,
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
  headerDate: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: 24,
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
  todaysWorkoutCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  workoutIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  restDayIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.secondary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  noWorkoutIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  restDayTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  noWorkoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  workoutStats: {
    fontSize: 16,
    color: Colors.gray[600],
    marginBottom: 24,
    textAlign: 'center',
  },
  restDayDescription: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  noWorkoutDescription: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  workoutButton: {
    minWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.success + '20',
    borderRadius: 20,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success,
  },
  alternativeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 16,
  },
  daySelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: Colors.primary[500],
  },
  dayButtonDisabled: {
    backgroundColor: Colors.gray[50],
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray[600],
  },
  dayButtonTextSelected: {
    color: Colors.white,
  },
  dayButtonTextDisabled: {
    color: Colors.gray[400],
  },
  selectedDayInfo: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  selectedDayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  selectedDayStats: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 12,
  },
  startSelectedButton: {
    minWidth: 150,
  },
  progressSection: {
    marginBottom: 24,
  },
  weekProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressDay: {
    alignItems: 'center',
    gap: 8,
  },
  progressDayLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.gray[600],
  },
  progressDayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDayCompleted: {
    backgroundColor: Colors.success,
  },
  progressDayToday: {
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  progressDayRest: {
    backgroundColor: Colors.secondary[100],
  },
  progressDayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray[400],
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray[600],
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gray[900],
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: Colors.gray[500],
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});