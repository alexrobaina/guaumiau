import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { useWorkoutSessions } from '@/hooks/queries/useWorkoutSessions';
import { useTrainingPlans } from '@/hooks/queries/useTrainingPlans';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/lib/colors';
import { WorkoutSession } from '@/types/workout';
import { WorkoutDetailModal } from '@/components/organisms/WorkoutDetailModal';
import { makeStyles } from './schedule-tab.styles';

interface ScheduleTabScreenProps {
  onToggleSidebar?: () => void;
}

export const ScheduleTabScreen: React.FC<ScheduleTabScreenProps> = ({ onToggleSidebar }) => {
  console.log('📅 ScheduleTabScreen component mounted');
  const { user } = useAuth();
  const { data: workoutSessions, isLoading } = useWorkoutSessions();
  const { data: trainingPlans } = useTrainingPlans();
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSession | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const styles = makeStyles();

  console.log('📅 Schedule data:', {
    hasUser: !!user,
    workoutSessionsCount: workoutSessions?.length || 0,
    isLoading,
    trainingPlansCount: trainingPlans?.length || 0
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the most recently created active plan if multiple exist
  const activePlan = trainingPlans?.filter(plan => plan.status === 'active')
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    })[0];

  // Get workout sessions for each day
  const getWorkoutForDay = (day: Date): WorkoutSession | undefined => {
    return workoutSessions?.find(session => {
      if (!session.actualDate || !session.actualDate.toDate) return false;
      return isSameDay(session.actualDate.toDate(), day) && session.status === 'completed';
    });
  };

  const handleWorkoutPress = (workout: WorkoutSession) => {
    setSelectedWorkout(workout);
    setIsModalVisible(true);
  };

  const renderCalendarDay = (day: Date) => {
    const workout = getWorkoutForDay(day);
    const isWorkoutDay = !!workout;
    const isTodayDate = isToday(day);

    return (
      <TouchableOpacity
        key={day.toISOString()}
        style={[
          styles.calendarDay,
          isWorkoutDay && styles.calendarDayWithWorkout,
          isTodayDate && styles.calendarDayToday,
        ]}
        onPress={() => workout && handleWorkoutPress(workout)}
        disabled={!workout}
      >
        <Text style={[
          styles.calendarDayText,
          isWorkoutDay && styles.calendarDayTextWithWorkout,
          isTodayDate && styles.calendarDayTextToday,
        ]}>
          {format(day, 'd')}
        </Text>
        {isWorkoutDay && (
          <View style={styles.workoutIndicator}>
            <Ionicons
              name="fitness"
              size={12}
              color={isTodayDate ? Colors.white : Colors.primary[600]}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderWorkoutHistory = () => {
    const completedWorkouts = workoutSessions?.filter(session => session.status === 'completed')
      .sort((a, b) => {
        const aTime = a.actualDate?.toMillis?.() || 0;
        const bTime = b.actualDate?.toMillis?.() || 0;
        return bTime - aTime;
      })
      .slice(0, 10) || [];

    return (
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        {completedWorkouts.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            style={styles.workoutHistoryItem}
            onPress={() => handleWorkoutPress(workout)}
          >
            <View style={styles.workoutHistoryHeader}>
              <Text style={styles.workoutHistoryDate}>
                {workout.actualDate?.toDate ? format(workout.actualDate.toDate(), 'MMM d, yyyy') : 'Unknown date'}
              </Text>
              <View style={styles.workoutHistoryStats}>
                <Text style={styles.workoutHistoryStat}>
                  {workout.exercises?.length || 0} exercises
                </Text>
                {workout.totalDuration && (
                  <Text style={styles.workoutHistoryStat}>
                    {workout.totalDuration}min
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.exerciseList}>
              {workout.exercises?.slice(0, 3).map((exercise, index) => (
                <Text key={index} style={styles.exerciseName}>
                  • {exercise.exerciseName}
                </Text>
              ))}
              {workout.exercises && workout.exercises.length > 3 && (
                <Text style={styles.exerciseMore}>
                  +{workout.exercises.length - 3} more
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
        {completedWorkouts.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="fitness-outline" size={48} color={Colors.gray[400]} />
            <Text style={styles.emptyStateText}>No completed workouts yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Complete your first workout to see it here!
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary[600]} />
        <Text style={styles.loadingText}>Loading schedule...</Text>
      </View>
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
          {onToggleSidebar && (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={onToggleSidebar}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={24} color={Colors.white} />
            </TouchableOpacity>
          )}
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Training Schedule</Text>
            {activePlan && (
              <Text style={styles.headerSubtitle}>{activePlan.name}</Text>
            )}
          </View>
        </View>

        <View style={styles.monthNavigation}>
          <TouchableOpacity
            style={styles.monthNavButton}
            onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <Ionicons name="chevron-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {format(currentMonth, 'MMMM yyyy')}
          </Text>
          <TouchableOpacity
            style={styles.monthNavButton}
            onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <Ionicons name="chevron-forward" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

      {/* Calendar View */}
      <View style={styles.calendarSection}>
        <Text style={styles.sectionTitle}>This Month</Text>

        {/* Week days header */}
        <View style={styles.weekDaysHeader}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <Text key={index} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.calendarGrid}>
          {daysInMonth.map(renderCalendarDay)}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendDotWorkout]} />
            <Text style={styles.legendText}>Workout completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendDotToday]} />
            <Text style={styles.legendText}>Today</Text>
          </View>
        </View>
      </View>

      {/* Workout History */}
      {renderWorkoutHistory()}

      {/* Workout Detail Modal */}
      </ScrollView>

      <WorkoutDetailModal
        visible={isModalVisible}
        workout={selectedWorkout}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedWorkout(null);
        }}
      />
    </SafeAreaView>
  );
};