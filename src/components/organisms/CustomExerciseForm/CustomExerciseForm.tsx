import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useCreateCustomExercise } from '@/hooks/mutations/useTrainingPlanMutations';
import { Exercise } from '@/lib/data/exerciseDatabase';
import { CustomExerciseFormProps, CustomExerciseFormData } from './CustomExerciseForm.types';
import { makeStyles } from './CustomExerciseForm.styles';
import { Colors } from '@/lib/colors';

const customExerciseSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Exercise name is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters'),
  equipment: Yup.array()
    .of(Yup.string())
    .min(0, 'Equipment list is optional'),
  muscleGroups: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one muscle group is required'),
  defaultSets: Yup.number()
    .min(1, 'Must have at least 1 set')
    .max(20, 'Cannot have more than 20 sets')
    .required('Number of sets is required'),
  defaultRest: Yup.number()
    .min(0, 'Rest time cannot be negative')
    .max(600, 'Rest time cannot exceed 10 minutes')
    .required('Rest time is required'),
});

const equipmentOptions = [
  'Dumbbells', 'Barbell', 'Kettlebells', 'Resistance Bands', 'Pull-up Bar',
  'Yoga Mat', 'Medicine Ball', 'Foam Roller', 'Suspension Trainer', 'Cable Machine',
  'Bench', 'Squat Rack', 'Leg Press Machine', 'Rowing Machine', 'Treadmill',
  'Stationary Bike', 'Elliptical', 'Hangboard', 'Campus Board', 'Climbing Wall',
  'Gymnastic Rings', 'Parallette Bars', 'Balance Ball', 'Lacrosse Ball', 'Pool'
];

const muscleGroupOptions = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Core', 'Abs',
  'Obliques', 'Lower Back', 'Glutes', 'Quads', 'Hamstrings', 'Calves', 'Hip Flexors',
  'Lats', 'Traps', 'Delts', 'Fingers', 'Cardiovascular', 'Full Body', 'Legs'
];

export const CustomExerciseForm: React.FC<CustomExerciseFormProps> = ({
  onClose,
  onSave,
  initialData,
  isEditing = false,
}) => {
  const styles = makeStyles();
  const [newEquipment, setNewEquipment] = useState('');
  const [newMuscleGroup, setNewMuscleGroup] = useState('');

  const createCustomExercise = useCreateCustomExercise();

  const initialValues: CustomExerciseFormData = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    equipment: initialData?.equipment || [],
    muscleGroups: initialData?.muscleGroups || [],
    measurementType: initialData?.measurementType || 'reps',
    defaultSets: initialData?.defaultSets || 3,
    defaultReps: initialData?.defaultReps || '',
    defaultDuration: initialData?.defaultDuration || '',
    defaultDistance: initialData?.defaultDistance || '',
    defaultRest: initialData?.defaultRest || 60,
    difficulty: initialData?.difficulty || 'beginner',
    notes: initialData?.notes || '',
  };

  const handleSubmit = async (values: CustomExerciseFormData) => {
    try {
      const exerciseData: Omit<Exercise, 'id'> = {
        name: values.name,
        description: values.description,
        equipment: values.equipment,
        muscleGroups: values.muscleGroups,
        measurementType: values.measurementType,
        defaultSets: values.defaultSets,
        defaultReps: values.defaultReps || undefined,
        defaultDuration: values.defaultDuration || undefined,
        defaultDistance: values.defaultDistance || undefined,
        defaultRest: values.defaultRest,
        difficulty: values.difficulty,
        notes: values.notes,
        isCustom: true,
      };

      if (isEditing) {
        // Handle edit case
        onSave(exerciseData as Exercise);
      } else {
        await createCustomExercise.mutateAsync(exerciseData);
        onSave(exerciseData as Exercise);
      }

      Alert.alert(
        'Success!',
        `Custom exercise ${isEditing ? 'updated' : 'created'} successfully.`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        `Failed to ${isEditing ? 'update' : 'create'} custom exercise. Please try again.`,
        [{ text: 'OK' }]
      );
    }
  };

  const addTag = (
    value: string,
    currentTags: string[],
    setFieldValue: (field: string, value: any) => void,
    fieldName: string,
    setValue: (value: string) => void
  ) => {
    if (value.trim() && !currentTags.includes(value.trim())) {
      setFieldValue(fieldName, [...currentTags, value.trim()]);
      setValue('');
    }
  };

  const removeTag = (
    index: number,
    currentTags: string[],
    setFieldValue: (field: string, value: any) => void,
    fieldName: string
  ) => {
    const updatedTags = currentTags.filter((_, i) => i !== index);
    setFieldValue(fieldName, updatedTags);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Exercise' : 'Create Custom Exercise'}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={20} color={Colors.gray[600]} />
          </TouchableOpacity>
        </View>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={customExerciseSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Exercise Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, styles.requiredLabel]}>Exercise Name *</Text>
              <TextInput
                style={[
                  styles.input,
                  formik.touched.name && formik.errors.name && styles.inputError
                ]}
                placeholder="e.g., Custom Push-ups"
                value={formik.values.name}
                onChangeText={formik.handleChange('name')}
                onBlur={formik.handleBlur('name')}
              />
              {formik.touched.name && formik.errors.name && (
                <Text style={styles.errorText}>{formik.errors.name}</Text>
              )}
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe how to perform this exercise..."
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

            {/* Equipment */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Equipment</Text>
              <View style={styles.tagsContainer}>
                {formik.values.equipment.map((item, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{item}</Text>
                    <TouchableOpacity
                      style={styles.removeTagButton}
                      onPress={() => removeTag(index, formik.values.equipment, formik.setFieldValue, 'equipment')}
                    >
                      <Ionicons name="close" size={14} color={Colors.primary[700]} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View style={styles.row}>
                <TextInput
                  style={styles.addTagInput}
                  placeholder="Add equipment..."
                  value={newEquipment}
                  onChangeText={setNewEquipment}
                />
                <TouchableOpacity
                  style={styles.addTagButton}
                  onPress={() => addTag(newEquipment, formik.values.equipment, formik.setFieldValue, 'equipment', setNewEquipment)}
                >
                  <Text style={styles.addTagButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Muscle Groups */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, styles.requiredLabel]}>Muscle Groups *</Text>
              <View style={styles.tagsContainer}>
                {formik.values.muscleGroups.map((item, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{item}</Text>
                    <TouchableOpacity
                      style={styles.removeTagButton}
                      onPress={() => removeTag(index, formik.values.muscleGroups, formik.setFieldValue, 'muscleGroups')}
                    >
                      <Ionicons name="close" size={14} color={Colors.primary[700]} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View style={styles.row}>
                <TextInput
                  style={styles.addTagInput}
                  placeholder="Add muscle group..."
                  value={newMuscleGroup}
                  onChangeText={setNewMuscleGroup}
                />
                <TouchableOpacity
                  style={styles.addTagButton}
                  onPress={() => addTag(newMuscleGroup, formik.values.muscleGroups, formik.setFieldValue, 'muscleGroups', setNewMuscleGroup)}
                >
                  <Text style={styles.addTagButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
              {formik.touched.muscleGroups && formik.errors.muscleGroups && (
                <Text style={styles.errorText}>{formik.errors.muscleGroups}</Text>
              )}
            </View>

            {/* Measurement Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Measurement Type</Text>
              <View style={styles.optionsGrid}>
                {[
                  { key: 'reps', label: 'Reps' },
                  { key: 'time', label: 'Time' },
                  { key: 'distance', label: 'Distance' },
                  { key: 'intervals', label: 'Intervals' },
                  { key: 'rounds', label: 'Rounds' },
                ].map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.optionCard,
                      formik.values.measurementType === type.key && styles.optionCardSelected
                    ]}
                    onPress={() => formik.setFieldValue('measurementType', type.key)}
                  >
                    <Text style={[
                      styles.optionText,
                      formik.values.measurementType === type.key && styles.optionTextSelected
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Measurement-specific inputs */}
              <View style={styles.measurementInputs}>
                {formik.values.measurementType === 'reps' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Default Reps</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 10-12 or max"
                      value={formik.values.defaultReps}
                      onChangeText={formik.handleChange('defaultReps')}
                    />
                  </View>
                )}

                {formik.values.measurementType === 'time' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Default Duration</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 30s or 2min"
                      value={formik.values.defaultDuration}
                      onChangeText={formik.handleChange('defaultDuration')}
                    />
                  </View>
                )}

                {formik.values.measurementType === 'distance' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Default Distance</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 100m or 5km"
                      value={formik.values.defaultDistance}
                      onChangeText={formik.handleChange('defaultDistance')}
                    />
                  </View>
                )}
              </View>
            </View>

            {/* Sets and Rest */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={[styles.label, styles.requiredLabel]}>Default Sets *</Text>
                <TextInput
                  style={[
                    styles.input,
                    formik.touched.defaultSets && formik.errors.defaultSets && styles.inputError
                  ]}
                  placeholder="3"
                  value={formik.values.defaultSets.toString()}
                  onChangeText={(text) => formik.setFieldValue('defaultSets', parseInt(text) || 0)}
                  onBlur={formik.handleBlur('defaultSets')}
                  keyboardType="numeric"
                />
                {formik.touched.defaultSets && formik.errors.defaultSets && (
                  <Text style={styles.errorText}>{formik.errors.defaultSets}</Text>
                )}
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={[styles.label, styles.requiredLabel]}>Rest (seconds) *</Text>
                <TextInput
                  style={[
                    styles.input,
                    formik.touched.defaultRest && formik.errors.defaultRest && styles.inputError
                  ]}
                  placeholder="60"
                  value={formik.values.defaultRest.toString()}
                  onChangeText={(text) => formik.setFieldValue('defaultRest', parseInt(text) || 0)}
                  onBlur={formik.handleBlur('defaultRest')}
                  keyboardType="numeric"
                />
                {formik.touched.defaultRest && formik.errors.defaultRest && (
                  <Text style={styles.errorText}>{formik.errors.defaultRest}</Text>
                )}
              </View>
            </View>

            {/* Difficulty */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Difficulty Level</Text>
              <View style={styles.optionsGrid}>
                {['beginner', 'intermediate', 'advanced', 'elite'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.optionCard,
                      formik.values.difficulty === level && styles.optionCardSelected
                    ]}
                    onPress={() => formik.setFieldValue('difficulty', level)}
                  >
                    <Text style={[
                      styles.optionText,
                      formik.values.difficulty === level && styles.optionTextSelected
                    ]}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any additional tips or variations..."
                value={formik.values.notes}
                onChangeText={formik.handleChange('notes')}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!formik.isValid || createCustomExercise.isPending) && styles.saveButtonDisabled
              ]}
              onPress={formik.handleSubmit}
              disabled={!formik.isValid || createCustomExercise.isPending}
            >
              <Text style={[
                styles.saveButtonText,
                (!formik.isValid || createCustomExercise.isPending) && styles.saveButtonTextDisabled
              ]}>
                {createCustomExercise.isPending
                  ? `${isEditing ? 'Updating' : 'Creating'}...`
                  : `${isEditing ? 'Update' : 'Create'} Exercise`
                }
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};