import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ExerciseConfigModalProps, ExerciseConfigData } from './ExerciseConfigModal.types';
import { makeStyles } from './ExerciseConfigModal.styles';
import { Colors } from '@/lib/colors';

const configSchema = Yup.object().shape({
  dayOfWeek: Yup.string().required('Day selection is required'),
  sets: Yup.number().min(1, 'Must have at least 1 set').max(20, 'Cannot exceed 20 sets'),
  reps: Yup.string().when('measurementType', {
    is: 'reps',
    then: (schema) => schema.required('Reps are required'),
    otherwise: (schema) => schema,
  }),
  duration: Yup.string().when('measurementType', {
    is: 'time',
    then: (schema) => schema.required('Duration is required'),
    otherwise: (schema) => schema,
  }),
  distance: Yup.string().when('measurementType', {
    is: 'distance',
    then: (schema) => schema.required('Distance is required'),
    otherwise: (schema) => schema,
  }),
  restPeriod: Yup.number()
    .min(0, 'Rest cannot be negative')
    .max(600, 'Rest cannot exceed 10 minutes')
    .required('Rest period is required'),
});

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const ExerciseConfigModal: React.FC<ExerciseConfigModalProps> = ({
  isVisible,
  exercise,
  onClose,
  onSave,
  availableDays,
  selectedDay,
}) => {
  const styles = makeStyles();
  const [rpeValue, setRpeValue] = useState(7);

  const initialValues: ExerciseConfigData = {
    dayOfWeek: selectedDay || '',
    sets: exercise?.defaultSets || 3,
    reps: exercise?.defaultReps || '',
    duration: exercise?.defaultDuration || '',
    distance: exercise?.defaultDistance || '',
    weight: '',
    restPeriod: exercise?.defaultRest || 60,
    rpe: 7,
    notes: '',
  };

  const handleSubmit = (values: ExerciseConfigData) => {
    const configData: ExerciseConfigData = {
      ...values,
      rpe: rpeValue,
    };
    onSave(configData);
    onClose();
  };

  const getMeasurementTypeInfo = (measurementType?: string) => {
    switch (measurementType) {
      case 'reps':
        return 'This exercise is measured by repetitions (e.g., 8-12 reps)';
      case 'time':
        return 'This exercise is measured by duration (e.g., 30s, 2min)';
      case 'distance':
        return 'This exercise is measured by distance (e.g., 100m, 5km)';
      case 'intervals':
        return 'This exercise uses interval training';
      case 'rounds':
        return 'This exercise is performed in rounds';
      default:
        return 'Configure how you want to perform this exercise';
    }
  };

  const renderMeasurementInputs = (values: any, handleChange: any, measurementType?: string) => {
    switch (measurementType) {
      case 'reps':
        return (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Repetitions *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 8-12, 10, max"
              value={values.reps}
              onChangeText={handleChange('reps')}
            />
          </View>
        );
      case 'time':
        return (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 30s, 2min, 1:30"
              value={values.duration}
              onChangeText={handleChange('duration')}
            />
          </View>
        );
      case 'distance':
        return (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Distance *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 100m, 5km, 0.5mi"
              value={values.distance}
              onChangeText={handleChange('distance')}
            />
          </View>
        );
      default:
        return (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Repetitions</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 8-12, 10, max"
              value={values.reps}
              onChangeText={handleChange('reps')}
            />
          </View>
        );
    }
  };

  if (!exercise) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>{exercise.name}</Text>
              <Text style={styles.subtitle}>Configure exercise parameters</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={Colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={configSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleSubmit, errors, touched, setFieldValue, isValid }) => (
              <>
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                  {/* Measurement Type Info */}
                  <View style={styles.measurementTypeInfo}>
                    <Text style={styles.measurementTypeText}>
                      {getMeasurementTypeInfo(exercise.measurementType)}
                    </Text>
                  </View>

                  {/* Day Selection */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Day of Week *</Text>
                    <View style={styles.daySelector}>
                      {DAYS_OF_WEEK.map((day) => {
                        const isAvailable = availableDays.includes(day);
                        const isSelected = values.dayOfWeek === day;

                        return (
                          <TouchableOpacity
                            key={day}
                            style={[
                              styles.dayButton,
                              isSelected && styles.dayButtonSelected,
                              !isAvailable && { opacity: 0.5 }
                            ]}
                            onPress={() => isAvailable && setFieldValue('dayOfWeek', day)}
                            disabled={!isAvailable}
                          >
                            <Text style={[
                              styles.dayButtonText,
                              isSelected && styles.dayButtonTextSelected
                            ]}>
                              {day.slice(0, 3)}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    {touched.dayOfWeek && errors.dayOfWeek && (
                      <Text style={{ color: Colors.error, fontSize: 12, marginTop: 4 }}>
                        {errors.dayOfWeek}
                      </Text>
                    )}
                  </View>

                  {/* Exercise Parameters */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Exercise Parameters</Text>

                    <View style={styles.inputRow}>
                      <View style={styles.inputGroupHalf}>
                        <Text style={styles.label}>Sets *</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="3"
                          value={values.sets?.toString()}
                          onChangeText={(text) => setFieldValue('sets', parseInt(text) || 0)}
                          keyboardType="numeric"
                        />
                      </View>

                      {renderMeasurementInputs(values, handleChange, exercise.measurementType)}
                    </View>

                    <View style={styles.inputRow}>
                      <View style={styles.inputGroupHalf}>
                        <Text style={styles.label}>Weight</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="e.g., 20kg, 45lbs"
                          value={values.weight}
                          onChangeText={handleChange('weight')}
                        />
                      </View>

                      <View style={styles.inputGroupHalf}>
                        <Text style={styles.label}>Rest (seconds) *</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="60"
                          value={values.restPeriod.toString()}
                          onChangeText={(text) => setFieldValue('restPeriod', parseInt(text) || 0)}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>

                  {/* RPE Scale */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Intensity (RPE Scale)</Text>
                    <View style={styles.rpeContainer}>
                      <Slider
                        style={styles.rpeSlider}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        value={rpeValue}
                        onValueChange={setRpeValue}
                        minimumTrackTintColor={Colors.primary[500]}
                        maximumTrackTintColor={Colors.gray[300]}
                        thumbStyle={{ backgroundColor: Colors.primary[500] }}
                      />
                      <View style={styles.rpeLabels}>
                        <Text style={styles.rpeLabel}>Very Easy</Text>
                        <Text style={styles.rpeLabel}>Moderate</Text>
                        <Text style={styles.rpeLabel}>Very Hard</Text>
                      </View>
                      <Text style={styles.rpeValue}>RPE: {rpeValue}/10</Text>
                    </View>
                  </View>

                  {/* Notes */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notes (Optional)</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Add any specific instructions, variations, or notes..."
                      value={values.notes}
                      onChangeText={handleChange('notes')}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </ScrollView>

                {/* Actions */}
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      !isValid && styles.saveButtonDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={!isValid}
                  >
                    <Text style={[
                      styles.saveButtonText,
                      !isValid && styles.saveButtonTextDisabled
                    ]}>
                      Add to Plan
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
};