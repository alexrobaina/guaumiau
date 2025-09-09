import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { OnboardingScreen } from '@/components/organisms/OnboardingScreen';
import { SelectableCard } from '@/components/molecules/SelectableCard';
import { Text, Input } from '@/components/atoms';
import { useStore } from '@/store';
import { Colors } from '@/lib/colors';

const predefinedGoals = [
  {
    id: 'strength',
    title: 'Build Strength',
    description: 'Improve overall climbing power and finger strength',
  },
  {
    id: 'endurance',
    title: 'Improve Endurance',
    description: 'Climb longer routes and sessions without getting pumped',
  },
  {
    id: 'technique',
    title: 'Better Technique',
    description: 'Focus on movement efficiency and climbing skills',
  },
  {
    id: 'grade-progression',
    title: 'Grade Progression',
    description: 'Systematically climb harder grades',
  },
  {
    id: 'competition',
    title: 'Competition Training',
    description: 'Prepare for climbing competitions',
  },
  {
    id: 'injury-prevention',
    title: 'Injury Prevention',
    description: 'Focus on mobility, stability, and antagonist training',
  },
  {
    id: 'general-fitness',
    title: 'General Fitness',
    description: 'Improve overall health and conditioning',
  },
];

export default function GoalsScreen() {
  const { data, currentStep, totalSteps, setGoals, nextStep, previousStep } = useStore();
  const selectedGoals = data.goals;
  const [customGoal, setCustomGoal] = useState('');

  const handleToggleGoal = (goalId: string) => {
    const isSelected = selectedGoals.includes(goalId);
    if (isSelected) {
      setGoals(selectedGoals.filter(id => id !== goalId));
    } else {
      setGoals([...selectedGoals, goalId]);
    }
  };

  const handleAddCustomGoal = () => {
    if (customGoal.trim() && !selectedGoals.includes(customGoal.trim())) {
      setGoals([...selectedGoals, customGoal.trim()]);
      setCustomGoal('');
    }
  };

  const handleNext = () => {
    nextStep();
    router.push('/(onboarding)/equipment');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const canProceed = selectedGoals.length > 0;

  return (
    <OnboardingScreen
      title="What are your climbing goals?"
      subtitle="Select all that apply. This helps us tailor your training plan."
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={canProceed ? handleNext : undefined}
      onPrevious={handlePrevious}
      nextDisabled={!canProceed}
    >
      <View style={styles.container}>
        <View style={styles.goalsContainer}>
          {predefinedGoals.map((goal) => (
            <SelectableCard
              key={goal.id}
              title={goal.title}
              description={goal.description}
              selected={selectedGoals.includes(goal.id)}
              onSelect={() => handleToggleGoal(goal.id)}
            />
          ))}
        </View>

        <View style={styles.customGoalSection}>
          <Text style={styles.sectionTitle}>Add Custom Goal</Text>
          <View style={styles.customGoalInput}>
            <Input
              placeholder="Enter your custom goal..."
              value={customGoal}
              onChangeText={setCustomGoal}
              onSubmitEditing={handleAddCustomGoal}
              returnKeyType="done"
            />
          </View>
        </View>

        {selectedGoals.some(goal => !predefinedGoals.some(p => p.id === goal)) && (
          <View style={styles.customGoalsDisplay}>
            <Text style={styles.sectionTitle}>Your Custom Goals</Text>
            {selectedGoals
              .filter(goal => !predefinedGoals.some(p => p.id === goal))
              .map((goal, index) => (
                <View key={index} style={styles.customGoalChip}>
                  <Text style={styles.customGoalText}>{goal}</Text>
                  <Text 
                    style={styles.removeButton}
                    onPress={() => handleToggleGoal(goal)}
                  >
                    ✕
                  </Text>
                </View>
              ))
            }
          </View>
        )}
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  goalsContainer: {
    marginBottom: 24,
  },
  customGoalSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 12,
  },
  customGoalInput: {
    marginBottom: 16,
  },
  customGoalsDisplay: {
    marginBottom: 24,
  },
  customGoalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  customGoalText: {
    color: Colors.primary[700],
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  removeButton: {
    color: Colors.primary[500],
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
});