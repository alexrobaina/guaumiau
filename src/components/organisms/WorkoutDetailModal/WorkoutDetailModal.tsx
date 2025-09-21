import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { WorkoutSession } from '@/types/workout';
import { Colors } from '@/lib/colors';
import { makeStyles } from './WorkoutDetailModal.styles';

interface WorkoutDetailModalProps {
  visible: boolean;
  workout: WorkoutSession | null;
  onClose: () => void;
}

export const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  visible,
  workout,
  onClose,
}) => {
  const styles = makeStyles();

  if (!workout) return null;

  const renderExercise = (exercise: any, index: number) => {
    const completedSets = exercise.sets?.filter((set: any) => set.completed) || [];

    return (
      <View key={index} style={styles.exerciseCard}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
          <View style={styles.exerciseStats}>
            <Text style={styles.exerciseStat}>
              {completedSets.length}/{exercise.sets?.length || 0} sets
            </Text>
          </View>
        </View>

        <View style={styles.setsContainer}>
          {exercise.sets?.map((set: any, setIndex: number) => (
            <View key={setIndex} style={[
              styles.setItem,
              set.completed ? styles.setCompleted : styles.setIncomplete
            ]}>
              <Text style={styles.setNumber}>Set {set.setNumber}</Text>
              <View style={styles.setDetails}>
                {set.actualReps && (
                  <Text style={styles.setDetail}>{set.actualReps} reps</Text>
                )}
                {set.weight && (
                  <Text style={styles.setDetail}>{set.weight}kg</Text>
                )}
                {set.rpe && (
                  <Text style={styles.setDetail}>RPE {set.rpe}</Text>
                )}
              </View>
              <View style={[
                styles.setStatus,
                set.completed ? styles.setStatusCompleted : styles.setStatusIncomplete
              ]}>
                <Ionicons
                  name={set.completed ? 'checkmark' : 'close'}
                  size={12}
                  color={set.completed ? Colors.green[600] : Colors.gray[400]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Workout Details</Text>
            <Text style={styles.subtitle}>
              {format(workout.actualDate.toDate(), 'EEEE, MMM d, yyyy')}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.gray[600]} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Workout Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStatItem}>
                <Text style={styles.summaryStatValue}>
                  {workout.exercises?.length || 0}
                </Text>
                <Text style={styles.summaryStatLabel}>Exercises</Text>
              </View>
              {workout.totalDuration && (
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatValue}>
                    {workout.totalDuration}
                  </Text>
                  <Text style={styles.summaryStatLabel}>Minutes</Text>
                </View>
              )}
              {workout.totalVolume && (
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatValue}>
                    {workout.totalVolume.toFixed(0)}
                  </Text>
                  <Text style={styles.summaryStatLabel}>kg Volume</Text>
                </View>
              )}
              {workout.overallRPE && (
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatValue}>
                    {workout.overallRPE}
                  </Text>
                  <Text style={styles.summaryStatLabel}>RPE</Text>
                </View>
              )}
            </View>
          </View>

          {/* Exercises */}
          <View style={styles.exercisesSection}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            {workout.exercises?.map(renderExercise)}
          </View>

          {/* Notes */}
          {workout.sessionNotes && (
            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.notesText}>{workout.sessionNotes}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};