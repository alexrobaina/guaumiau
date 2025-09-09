import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { OnboardingScreen } from '@/components/organisms/OnboardingScreen';
import { Text, Input } from '@/components/atoms';
import { useStore } from '@/store';
import { Colors } from '@/lib/colors';

const boulderGrades = [
  'VB', 'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10+',
];

const frenchGrades = [
  '3', '4', '5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+',
  '7a', '7a+', '7b', '7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+',
  '9a', '9a+', '9b', '9b+', '9c', '9c+',
];

export default function GradeScreen() {
  const { data, currentStep, totalSteps, setCurrentGrade, nextStep, previousStep } = useStore();
  const { boulder, french } = data.currentGrade;
  const [customBoulder, setCustomBoulder] = useState('');
  const [customFrench, setCustomFrench] = useState('');

  const handleSelectBoulder = (grade: string) => {
    setCurrentGrade({
      boulder: grade,
      french,
    });
  };

  const handleSelectFrench = (grade: string) => {
    setCurrentGrade({
      boulder,
      french: grade,
    });
  };

  const handleNext = () => {
    nextStep();
    router.push('/(onboarding)/goals');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const canProceed = boulder && french;

  return (
    <OnboardingScreen
      title="What grades do you currently climb?"
      subtitle="Select your current comfort level for each style"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={canProceed ? handleNext : undefined}
      onPrevious={handlePrevious}
      nextDisabled={!canProceed}
    >
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Boulder Grades (V-Scale)</Text>
          <View style={styles.gradeGrid}>
            {boulderGrades.map((grade) => (
              <GradeButton
                key={grade}
                grade={grade}
                selected={boulder === grade}
                onSelect={() => handleSelectBoulder(grade)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>French Grades</Text>
          <View style={styles.gradeGrid}>
            {frenchGrades.map((grade) => (
              <GradeButton
                key={grade}
                grade={grade}
                selected={french === grade}
                onSelect={() => handleSelectFrench(grade)}
              />
            ))}
          </View>
        </View>
      </View>
    </OnboardingScreen>
  );
}

interface GradeButtonProps {
  grade: string;
  selected: boolean;
  onSelect: () => void;
}

function GradeButton({ grade, selected, onSelect }: GradeButtonProps) {
  return (
    <Text
      style={[
        styles.gradeButton,
        selected && styles.gradeButtonSelected,
      ]}
      onPress={onSelect}
    >
      {grade}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 16,
  },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gradeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.gray[100],
    borderRadius: 20,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[700],
    textAlign: 'center',
    overflow: 'hidden',
  },
  gradeButtonSelected: {
    backgroundColor: Colors.primary[500],
    color: Colors.white,
  },
});