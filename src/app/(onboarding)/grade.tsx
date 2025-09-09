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

const sportGrades = [
  '5.5', '5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d',
  '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b', '5.12c', '5.12d',
  '5.13a', '5.13b', '5.13c', '5.13d', '5.14+',
];

export default function GradeScreen() {
  const { data, currentStep, totalSteps, setCurrentGrade, nextStep, previousStep } = useStore();
  const { boulder, sport } = data.currentGrade;
  const [customBoulder, setCustomBoulder] = useState('');
  const [customSport, setCustomSport] = useState('');

  const handleSelectBoulder = (grade: string) => {
    setCurrentGrade({
      boulder: grade,
      sport,
    });
  };

  const handleSelectSport = (grade: string) => {
    setCurrentGrade({
      boulder,
      sport: grade,
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

  const canProceed = boulder && sport;

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
          <Text style={styles.sectionTitle}>Sport Grades (YDS)</Text>
          <View style={styles.gradeGrid}>
            {sportGrades.map((grade) => (
              <GradeButton
                key={grade}
                grade={grade}
                selected={sport === grade}
                onSelect={() => handleSelectSport(grade)}
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