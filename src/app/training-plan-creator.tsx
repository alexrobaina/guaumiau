import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useCreateTrainingPlan } from '@/hooks/mutations/useTrainingPlanMutations';
import {
  TrainingPlan,
  TrainingDay,
  DayExercise,
} from '@/lib/services/trainingPlanService';
import { exerciseDatabase } from '@/lib/data/exerciseDatabase';
import { Button } from '@/components/atoms/Button';
import { Colors } from '@/lib/colors';
import { ExerciseSelector } from '@/components/organisms/ExerciseSelector';
import { CustomExerciseForm } from '@/components/organisms/CustomExerciseForm';
import {
  ExerciseConfigModal,
  ExerciseConfigData,
  ExerciseWithConfig,
} from '@/components/organisms/ExerciseConfigModal';
import { Exercise } from '@/lib/data/exerciseDatabase';
import { trainingPlansStatus } from '@/lib/types/trainingPlanStatus';

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

const trainingPlanSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Training plan name is required'),
  description: Yup.string().max(
    500,
    'Description must be less than 500 characters'
  ),
  duration: Yup.number()
    .min(1, 'Duration must be at least 1 week')
    .max(52, 'Duration must be less than 52 weeks')
    .required('Duration is required'),
  daysPerWeek: Yup.number()
    .min(1, 'Must train at least 1 day per week')
    .max(7, 'Cannot train more than 7 days per week')
    .required('Days per week is required'),
  goals: Yup.array().of(Yup.string()).min(1, 'At least one goal is required'),
  difficulty: Yup.string()
    .oneOf(['beginner', 'intermediate', 'advanced', 'elite'])
    .required('Difficulty level is required'),
  equipment: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one equipment type is required'),
});

interface TrainingPlanFormData {
  name: string;
  description: string;
  duration: number;
  daysPerWeek: number;
  goals: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  equipment: string[];
  trainingDays: TrainingDay[];
}

export default function TrainingPlanCreatorScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showCustomExerciseForm, setShowCustomExerciseForm] = useState(false);
  const [showExerciseConfig, setShowExerciseConfig] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [formData, setFormData] = useState<TrainingPlanFormData | null>(null);
  const formikRef = React.useRef<any>(null);

  const createTrainingPlan = useCreateTrainingPlan();

  // Sync formData with formik values when formData changes
  React.useEffect(() => {
    if (
      formData &&
      formikRef.current &&
      formData.trainingDays &&
      Array.isArray(formData.trainingDays) &&
      JSON.stringify(formData.trainingDays) !==
        JSON.stringify(formikRef.current.values.trainingDays)
    ) {
      formikRef.current.setFieldValue('trainingDays', formData.trainingDays);
    }
  }, [formData]);

  const initialValues: TrainingPlanFormData = {
    name: '',
    description: '',
    duration: 4,
    daysPerWeek: 3,
    goals: [],
    difficulty: 'beginner',
    equipment: [],
    trainingDays: daysOfWeek.map(day => ({
      day: day.key,
      name: day.label,
      exercises: [],
      isRestDay: true,
      notes: '',
    })),
  };

  const goalOptions = [
    'Strength Building',
    'Endurance',
    'Weight Loss',
    'Muscle Gain',
    'Flexibility',
    'Sport Specific',
    'General Fitness',
    'Rehabilitation',
  ];

  const equipmentOptions = [
    'Gym Access',
    'Home Equipment',
    'Bodyweight Only',
    'Dumbbells',
    'Barbell',
    'Resistance Bands',
    'Pull-up Bar',
    'Yoga Mat',
    'Climbing Wall',
    'Hangboard',
    'Campus Board',
  ];

  // Helper function to remove undefined values from objects
  const cleanFirebaseData = (obj: any): any => {
    if (obj === null || obj === undefined) {
      return null;
    }

    if (Array.isArray(obj)) {
      return obj.map(cleanFirebaseData);
    }

    if (typeof obj === 'object') {
      const cleaned: any = {};
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (value !== undefined) {
          cleaned[key] = cleanFirebaseData(value);
        }
      });
      return cleaned;
    }

    return obj;
  };

  const handleSubmit = async (values: TrainingPlanFormData) => {
    try {
      console.log('🚀 Creating training plan with data:', {
        name: values.name,
        duration: values.duration,
        daysPerWeek: values.daysPerWeek,
        goals: values.goals,
        equipment: values.equipment,
        totalExercises: (values.trainingDays || []).reduce(
          (total, day) => total + day.exercises.length,
          0
        ),
        trainingDays: (values.trainingDays || []).map(day => ({
          day: day.day,
          name: day.name,
          exerciseCount: day.exercises.length,
          isRestDay: day.isRestDay,
        })),
      });

      // Prepare training plan data for Firebase
      const rawPlanData: Omit<
        TrainingPlan,
        'id' | 'createdAt' | 'updatedAt' | 'userId'
      > = {
        name: values.name,
        description: values.description || '',
        duration: values.duration,
        daysPerWeek: values.daysPerWeek,
        trainingDays: values.trainingDays || [],
        goals: values.goals,
        targetLevel: values.difficulty,
        equipment: values.equipment,
        difficulty: values.difficulty,
        status: trainingPlansStatus.active,
        isTemplate: false,
        tags: [],
      };

      // Clean the data to remove undefined values
      const planData = cleanFirebaseData(rawPlanData);

      console.log('💾 Saving to Firebase...');
      const planId = await createTrainingPlan.mutateAsync(planData);
      console.log('✅ Training plan created with ID:', planId);

      Alert.alert(
        'Success! 🎉',
        `Your training plan "${values.name}" has been created successfully and saved to your account.`,
        [
          {
            text: 'View Plans',
            onPress: () => router.push('/(tabs)/training-plan-tab'),
          },
          {
            text: 'Create Another',
            onPress: () => {
              // Reset form
              setCurrentStep(1);
              setFormData(null);
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Error creating training plan:', error);
      Alert.alert(
        'Error',
        'Failed to create training plan. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const addExerciseToDay = (dayKey: string, exercise: DayExercise) => {
    if (!formData) return;

    const updatedDays = (formData.trainingDays || []).map(day => {
      if (day.day === dayKey) {
        return {
          ...day,
          exercises: [...day.exercises, exercise],
          isRestDay: false,
        };
      }
      return day;
    });

    const updatedFormData = {
      ...formData,
      trainingDays: updatedDays,
    };

    setFormData(updatedFormData);

    // Also update formik state if available
    if (formikRef.current) {
      formikRef.current.setFieldValue('trainingDays', updatedDays);
    }
  };

  const handleExerciseConfigSave = (config: ExerciseConfigData) => {
    if (!selectedExercise) return;

    const exerciseWithConfig: DayExercise = {
      exerciseId: selectedExercise.id,
      exercise: selectedExercise,
      sets: config.sets || selectedExercise.defaultSets || 3,
      reps: config.reps || selectedExercise.defaultReps,
      duration: config.duration || selectedExercise.defaultDuration,
      distance: config.distance || selectedExercise.defaultDistance,
      weight: config.weight,
      rest: config.restPeriod,
      rpe: config.rpe,
      notes: config.notes,
    };

    // Convert day label back to key for adding exercise
    const dayKey = daysOfWeek.find(day => day.label === config.dayOfWeek)?.key;
    if (dayKey) {
      addExerciseToDay(dayKey, exerciseWithConfig);
    }

    setShowExerciseConfig(false);
    setSelectedExercise(null);
    setSelectedDay(null);
  };

  // Smart suggestions and validation
  const getTrainingPlanValidation = (trainingDays: TrainingDay[]) => {
    const suggestions = [];
    const warnings = [];

    const workoutDays = trainingDays.filter(day => !day.isRestDay);
    const totalExercises = trainingDays.reduce(
      (total, day) => total + day.exercises.length,
      0
    );

    // Check if plan has enough variety
    if (workoutDays.length < 2) {
      warnings.push('Consider adding more training days for better results.');
    }

    if (totalExercises < 5) {
      suggestions.push(
        'Add more exercises to create a comprehensive training plan.'
      );
    }

    // Check for consecutive hard days
    let consecutiveHardDays = 0;
    for (let i = 0; i < trainingDays.length; i++) {
      const day = trainingDays[i];
      if (!day.isRestDay && day.exercises.length >= 4) {
        consecutiveHardDays++;
        if (consecutiveHardDays >= 3) {
          warnings.push(
            'Consider adding rest days between intense training sessions.'
          );
          break;
        }
      } else {
        consecutiveHardDays = 0;
      }
    }

    // Check muscle group balance
    const muscleGroups = new Set();
    trainingDays.forEach(day => {
      day.exercises.forEach(exercise => {
        exercise.exercise.muscleGroups.forEach(muscle =>
          muscleGroups.add(muscle)
        );
      });
    });

    if (muscleGroups.size < 3) {
      suggestions.push(
        'Consider adding exercises that target different muscle groups for balanced training.'
      );
    }

    // Check for recovery
    const hasRestDay = trainingDays.some(day => day.isRestDay);
    if (!hasRestDay) {
      warnings.push('Include at least one rest day for proper recovery.');
    }

    return { suggestions, warnings };
  };

  const removeExerciseFromDay = (dayKey: string, exerciseIndex: number) => {
    if (!formData) return;

    const updatedDays = (formData.trainingDays || []).map(day => {
      if (day.day === dayKey) {
        const updatedExercises = day.exercises.filter(
          (_, index) => index !== exerciseIndex
        );
        return {
          ...day,
          exercises: updatedExercises,
          isRestDay: updatedExercises.length === 0,
        };
      }
      return day;
    });

    const updatedFormData = {
      ...formData,
      trainingDays: updatedDays,
    };

    setFormData(updatedFormData);

    // Also update formik state if available
    if (formikRef.current) {
      formikRef.current.setFieldValue('trainingDays', updatedDays);
    }
  };

  const moveExercise = (dayKey: string, fromIndex: number, toIndex: number) => {
    if (!formData) return;

    const updatedDays = (formData.trainingDays || []).map(day => {
      if (day.day === dayKey) {
        const exercises = [...day.exercises];
        const [movedExercise] = exercises.splice(fromIndex, 1);
        exercises.splice(toIndex, 0, movedExercise);
        return {
          ...day,
          exercises,
        };
      }
      return day;
    });

    const updatedFormData = {
      ...formData,
      trainingDays: updatedDays,
    };

    setFormData(updatedFormData);

    // Also update formik state if available
    if (formikRef.current) {
      formikRef.current.setFieldValue('trainingDays', updatedDays);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map(step => (
        <View key={step} style={styles.stepContainer}>
          <View
            style={[
              styles.stepCircle,
              currentStep >= step
                ? styles.stepCircleActive
                : styles.stepCircleInactive,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                currentStep >= step
                  ? styles.stepNumberActive
                  : styles.stepNumberInactive,
              ]}
            >
              {step}
            </Text>
          </View>
          {step < 3 && (
            <View
              style={[
                styles.stepConnector,
                currentStep > step
                  ? styles.stepConnectorActive
                  : styles.stepConnectorInactive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderBasicInfoStep = (formik: any) => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Basic Information</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Plan Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 12-Week Strength Building"
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
        />
        {formik.touched.name && formik.errors.name && (
          <Text style={styles.errorText}>{formik.errors.name}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your training plan goals and approach"
          value={formik.values.description}
          onChangeText={formik.handleChange('description')}
          onBlur={formik.handleBlur('description')}
          multiline
          numberOfLines={4}
        />
        {formik.touched.description && formik.errors.description && (
          <Text style={styles.errorText}>{formik.errors.description}</Text>
        )}
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Duration (weeks) *</Text>
          <TextInput
            style={styles.input}
            placeholder="4"
            value={formik.values.duration.toString()}
            onChangeText={text =>
              formik.setFieldValue('duration', parseInt(text) || 0)
            }
            onBlur={formik.handleBlur('duration')}
            keyboardType="numeric"
          />
          {formik.touched.duration && formik.errors.duration && (
            <Text style={styles.errorText}>{formik.errors.duration}</Text>
          )}
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Days per week *</Text>
          <TextInput
            style={styles.input}
            placeholder="3"
            value={formik.values.daysPerWeek.toString()}
            onChangeText={text =>
              formik.setFieldValue('daysPerWeek', parseInt(text) || 0)
            }
            onBlur={formik.handleBlur('daysPerWeek')}
            keyboardType="numeric"
          />
          {formik.touched.daysPerWeek && formik.errors.daysPerWeek && (
            <Text style={styles.errorText}>{formik.errors.daysPerWeek}</Text>
          )}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Training Goals *</Text>
        <View style={styles.optionsGrid}>
          {goalOptions.map(goal => (
            <TouchableOpacity
              key={goal}
              style={[
                styles.optionCard,
                formik.values.goals.includes(goal) && styles.optionCardSelected,
              ]}
              onPress={() => {
                const currentGoals = formik.values.goals;
                if (currentGoals.includes(goal)) {
                  formik.setFieldValue(
                    'goals',
                    currentGoals.filter((g: string) => g !== goal)
                  );
                } else {
                  formik.setFieldValue('goals', [...currentGoals, goal]);
                }
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  formik.values.goals.includes(goal) &&
                    styles.optionTextSelected,
                ]}
              >
                {goal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {formik.touched.goals && formik.errors.goals && (
          <Text style={styles.errorText}>{formik.errors.goals}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Available Equipment *</Text>
        <View style={styles.optionsGrid}>
          {equipmentOptions.map(equipment => (
            <TouchableOpacity
              key={equipment}
              style={[
                styles.optionCard,
                formik.values.equipment.includes(equipment) &&
                  styles.optionCardSelected,
              ]}
              onPress={() => {
                const currentEquipment = formik.values.equipment;
                if (currentEquipment.includes(equipment)) {
                  formik.setFieldValue(
                    'equipment',
                    currentEquipment.filter((e: string) => e !== equipment)
                  );
                } else {
                  formik.setFieldValue('equipment', [
                    ...currentEquipment,
                    equipment,
                  ]);
                }
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  formik.values.equipment.includes(equipment) &&
                    styles.optionTextSelected,
                ]}
              >
                {equipment}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {formik.touched.equipment && formik.errors.equipment && (
          <Text style={styles.errorText}>{formik.errors.equipment}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Difficulty Level *</Text>
        <View style={styles.optionsGrid}>
          {['beginner', 'intermediate', 'advanced', 'elite'].map(level => (
            <TouchableOpacity
              key={level}
              style={[
                styles.optionCard,
                formik.values.difficulty === level && styles.optionCardSelected,
              ]}
              onPress={() => formik.setFieldValue('difficulty', level)}
            >
              <Text
                style={[
                  styles.optionText,
                  formik.values.difficulty === level &&
                    styles.optionTextSelected,
                ]}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderExerciseSelectionStep = (formik: any) => {
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Select Exercises</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Activity Type</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={styles.activitySelector}
              onPress={() => setShowExerciseSelector(true)}
            >
              <Text style={styles.activitySelectorText}>
                🏋️ Add Exercises to Your Plan
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.gray[500]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Week View */}
        <View style={styles.weekView}>
          <Text style={styles.weekViewTitle}>Your Training Week</Text>
          {daysOfWeek.map(day => {
            const dayExercises =
              (formik.values.trainingDays || []).find(
                (d: TrainingDay) => d.day === day.key
              )?.exercises || [];

            return (
              <View key={day.key} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayTitle}>{day.label}</Text>
                  <TouchableOpacity
                    style={styles.addExerciseButton}
                    onPress={() => {
                      console.log('Setting selected day:', day.key, day.label);
                      setSelectedDay(day.key);
                      setShowExerciseSelector(true);
                    }}
                  >
                    <Ionicons
                      name="add"
                      size={16}
                      color={Colors.primary[600]}
                    />
                    <Text style={styles.addExerciseText}>Add Exercise</Text>
                  </TouchableOpacity>
                </View>

                {dayExercises.length === 0 ? (
                  <Text style={styles.restDayText}>Rest Day 😴</Text>
                ) : (
                  <View style={styles.exercisesList}>
                    {dayExercises.map(
                      (exercise: DayExercise, index: number) => (
                        <View key={index} style={styles.exerciseItem}>
                          <View style={styles.exerciseReorderActions}>
                            <TouchableOpacity
                              style={[
                                styles.reorderButton,
                                index === 0 && styles.reorderButtonDisabled,
                              ]}
                              onPress={() =>
                                index > 0 &&
                                moveExercise(day.key, index, index - 1)
                              }
                              disabled={index === 0}
                            >
                              <Ionicons
                                name="chevron-up"
                                size={16}
                                color={
                                  index === 0
                                    ? Colors.gray[400]
                                    : Colors.gray[600]
                                }
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                styles.reorderButton,
                                index === dayExercises.length - 1 &&
                                  styles.reorderButtonDisabled,
                              ]}
                              onPress={() =>
                                index < dayExercises.length - 1 &&
                                moveExercise(day.key, index, index + 1)
                              }
                              disabled={index === dayExercises.length - 1}
                            >
                              <Ionicons
                                name="chevron-down"
                                size={16}
                                color={
                                  index === dayExercises.length - 1
                                    ? Colors.gray[400]
                                    : Colors.gray[600]
                                }
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.exerciseInfo}>
                            <Text style={styles.exerciseName}>
                              {exercise.exercise.name}
                            </Text>
                            <Text style={styles.exerciseDetails}>
                              {exercise.sets} sets ×{' '}
                              {exercise.reps ||
                                exercise.duration ||
                                exercise.distance}
                              , {exercise.rest}s rest
                              {exercise.rpe && ` • RPE ${exercise.rpe}`}
                            </Text>
                            {exercise.notes && (
                              <Text style={styles.exerciseNotes}>
                                {exercise.notes}
                              </Text>
                            )}
                          </View>
                          <TouchableOpacity
                            style={styles.removeExerciseButton}
                            onPress={() =>
                              removeExerciseFromDay(day.key, index)
                            }
                          >
                            <Ionicons
                              name="close"
                              size={16}
                              color={Colors.error}
                            />
                          </TouchableOpacity>
                        </View>
                      )
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.exerciseSummary}>
          <Text style={styles.summaryText}>
            Total:{' '}
            {(formik.values.trainingDays || []).reduce(
              (total: number, day: TrainingDay) => total + day.exercises.length,
              0
            )}{' '}
            exercises,{' '}
            {
              (formik.values.trainingDays || []).filter(
                (day: TrainingDay) => !day.isRestDay
              ).length
            }{' '}
            training days
          </Text>
        </View>

        {/* Smart Suggestions */}
        {(() => {
          const { suggestions, warnings } = getTrainingPlanValidation(
            formik.values.trainingDays
          );
          return (
            <>
              {warnings.length > 0 && (
                <View style={styles.validationContainer}>
                  <View style={styles.validationHeader}>
                    <Ionicons name="warning" size={16} color={Colors.warning} />
                    <Text style={styles.validationTitle}>Recommendations</Text>
                  </View>
                  {warnings.map((warning, index) => (
                    <Text key={index} style={styles.warningText}>
                      • {warning}
                    </Text>
                  ))}
                </View>
              )}

              {suggestions.length > 0 && (
                <View style={styles.validationContainer}>
                  <View style={styles.validationHeader}>
                    <Ionicons
                      name="bulb"
                      size={16}
                      color={Colors.primary[600]}
                    />
                    <Text style={styles.validationTitle}>Suggestions</Text>
                  </View>
                  {suggestions.map((suggestion, index) => (
                    <Text key={index} style={styles.suggestionText}>
                      • {suggestion}
                    </Text>
                  ))}
                </View>
              )}
            </>
          );
        })()}
      </View>
    );
  };

  const renderReviewStep = (formik: any) => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Review & Create</Text>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Plan Overview</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Name:</Text>
          <Text style={styles.reviewValue}>{formik.values.name}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Duration:</Text>
          <Text style={styles.reviewValue}>{formik.values.duration} weeks</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Days per week:</Text>
          <Text style={styles.reviewValue}>{formik.values.daysPerWeek}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Goals:</Text>
          <Text style={styles.reviewValue}>
            {formik.values.goals.join(', ')}
          </Text>
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Weekly Schedule</Text>
        {(formik.values.trainingDays || []).map((day: TrainingDay) => (
          <View key={day.day} style={styles.reviewDayCard}>
            <Text style={styles.reviewDayTitle}>{day.name}</Text>
            {day.isRestDay ? (
              <Text style={styles.reviewRestDay}>Rest Day</Text>
            ) : (
              <View>
                {day.exercises.map((exercise: DayExercise, index: number) => (
                  <Text key={index} style={styles.reviewExercise}>
                    • {exercise.exercise.name} ({exercise.sets} sets ×{' '}
                    {exercise.reps || exercise.duration || exercise.distance})
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );

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

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Create Training Plan</Text>
            <Text style={styles.headerSubtitle}>
              Design your perfect workout
            </Text>
          </View>

          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => console.log('Show help')}
          >
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>

        {renderStepIndicator()}
      </LinearGradient>

      <Formik
        initialValues={initialValues}
        validationSchema={trainingPlanSchema}
        onSubmit={handleSubmit}
      >
        {formik => {
          // Set formik reference for state synchronization
          formikRef.current = formik;

          return (
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {currentStep === 1 && renderBasicInfoStep(formik)}
              {currentStep === 2 && renderExerciseSelectionStep(formik)}
              {currentStep === 3 && renderReviewStep(formik)}

              {/* Navigation Buttons */}
              <View style={styles.navigationButtons}>
                {currentStep > 1 && (
                  <Button
                    onPress={() => setCurrentStep(currentStep - 1)}
                    variant="secondary"
                    buttonStyle="outline"
                    style={styles.navButton}
                  >
                    Previous
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button
                    onPress={() => {
                      // Validate current step before proceeding
                      if (currentStep === 1) {
                        // Basic validation for step 1
                        if (
                          !formik.values.name ||
                          formik.values.goals.length === 0 ||
                          formik.values.equipment.length === 0
                        ) {
                          Alert.alert(
                            'Incomplete Information',
                            'Please fill in all required fields before proceeding.'
                          );
                          return;
                        }
                        setFormData(formik.values);
                      } else if (currentStep === 2) {
                        // Validate that at least one exercise is added
                        const totalExercises =
                          (formik.values.trainingDays || []).reduce(
                            (total: number, day: TrainingDay) =>
                              total + day.exercises.length,
                            0
                          );
                        if (totalExercises === 0) {
                          Alert.alert(
                            'No Exercises Added',
                            'Please add at least one exercise to your training plan before proceeding.'
                          );
                          return;
                        }
                      }
                      setCurrentStep(currentStep + 1);
                    }}
                    variant="primary"
                    style={styles.navButton}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onPress={() => {
                      // Final validation before submitting
                      const totalExercises = (formik.values.trainingDays || []).reduce(
                        (total: number, day: TrainingDay) =>
                          total + day.exercises.length,
                        0
                      );
                      if (totalExercises === 0) {
                        Alert.alert(
                          'Cannot Create Empty Plan',
                          'Please add at least one exercise to your training plan.'
                        );
                        return;
                      }
                      formik.handleSubmit();
                    }}
                    variant="primary"
                    loading={createTrainingPlan.isPending}
                    style={styles.navButton}
                    disabled={createTrainingPlan.isPending}
                  >
                    {createTrainingPlan.isPending
                      ? 'Creating...'
                      : 'Create Plan'}
                  </Button>
                )}
              </View>
            </ScrollView>
          );
        }}
      </Formik>

      {/* Exercise Selector Modal */}
      <Modal
        visible={showExerciseSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ExerciseSelector
          onClose={() => {
            setShowExerciseSelector(false);
            setSelectedDay(null);
          }}
          onSelectExercise={exercise => {
            console.log(
              'Exercise selected:',
              exercise.exercise.name,
              'for day:',
              selectedDay
            );
            setSelectedExercise(exercise.exercise);
            setShowExerciseSelector(false);
            setShowExerciseConfig(true);
          }}
          onCreateCustom={() => {
            setShowExerciseSelector(false);
            setShowCustomExerciseForm(true);
          }}
        />
      </Modal>

      {/* Custom Exercise Form Modal */}
      <Modal
        visible={showCustomExerciseForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <CustomExerciseForm
          onClose={() => setShowCustomExerciseForm(false)}
          onSave={exercise => {
            setSelectedExercise(exercise);
            setShowCustomExerciseForm(false);
            setShowExerciseConfig(true);
          }}
        />
      </Modal>

      {/* Exercise Configuration Modal */}
      <ExerciseConfigModal
        isVisible={showExerciseConfig}
        exercise={selectedExercise}
        onClose={() => {
          setShowExerciseConfig(false);
          setSelectedExercise(null);
          setSelectedDay(null);
        }}
        onSave={handleExerciseConfigSave}
        availableDays={daysOfWeek.map(day => day.label)}
        selectedDay={
          selectedDay
            ? daysOfWeek.find(day => day.key === selectedDay)?.label
            : undefined
        }
      />
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: Colors.white,
  },
  stepCircleInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: Colors.primary[500],
  },
  stepNumberInactive: {
    color: Colors.white,
  },
  stepConnector: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  stepConnectorActive: {
    backgroundColor: Colors.white,
  },
  stepConnectorInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stepContent: {
    marginBottom: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.white,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.white,
  },
  optionCardSelected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[700],
  },
  optionTextSelected: {
    color: Colors.primary[700],
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: 4,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 40,
  },
  navButton: {
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 12,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  activitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activitySelectorText: {
    fontSize: 16,
    color: Colors.gray[700],
  },
  weekView: {
    marginTop: 24,
  },
  weekViewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 16,
  },
  dayCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  addExerciseText: {
    fontSize: 14,
    color: Colors.primary[600],
    fontWeight: '500',
    marginLeft: 4,
  },
  restDayText: {
    fontSize: 14,
    color: Colors.gray[500],
    fontStyle: 'italic',
  },
  exercisesList: {
    gap: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
  },
  exerciseReorderActions: {
    flexDirection: 'column',
    marginRight: 8,
  },
  reorderButton: {
    padding: 2,
    backgroundColor: Colors.white,
    borderRadius: 4,
    marginVertical: 1,
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  reorderButtonDisabled: {
    opacity: 0.3,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 2,
  },
  exerciseDetails: {
    fontSize: 12,
    color: Colors.gray[600],
    marginBottom: 2,
  },
  exerciseNotes: {
    fontSize: 11,
    color: Colors.gray[500],
    fontStyle: 'italic',
  },
  removeExerciseButton: {
    padding: 4,
  },
  exerciseSummary: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.primary[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  summaryText: {
    fontSize: 14,
    color: Colors.primary[700],
    textAlign: 'center',
    fontWeight: '500',
  },
  validationContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  validationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  validationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[900],
    marginLeft: 8,
  },
  warningText: {
    fontSize: 13,
    color: Colors.warning,
    marginBottom: 4,
    lineHeight: 18,
  },
  suggestionText: {
    fontSize: 13,
    color: Colors.primary[600],
    marginBottom: 4,
    lineHeight: 18,
  },
  reviewSection: {
    marginBottom: 24,
  },
  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 12,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[600],
    width: 120,
  },
  reviewValue: {
    fontSize: 14,
    color: Colors.gray[900],
    flex: 1,
  },
  reviewDayCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  reviewDayTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  reviewRestDay: {
    fontSize: 12,
    color: Colors.gray[500],
    fontStyle: 'italic',
  },
  reviewExercise: {
    fontSize: 12,
    color: Colors.gray[700],
    marginLeft: 8,
    marginBottom: 2,
  },
});
