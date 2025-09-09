import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { OnboardingScreen } from '@/components/organisms/OnboardingScreen';
import { Text } from '@/components/atoms';
import { useStore } from '@/store';
import { Colors } from '@/lib/colors';

export default function AvailabilityScreen() {
  const { data, currentStep, totalSteps, setTrainingAvailability, nextStep, previousStep } = useStore();
  const { daysPerWeek, hoursPerSession } = data.trainingAvailability;

  const handleSetDays = (days: number) => {
    setTrainingAvailability({
      ...data.trainingAvailability,
      daysPerWeek: days,
    });
  };

  const handleSetHours = (hours: number) => {
    setTrainingAvailability({
      ...data.trainingAvailability,
      hoursPerSession: hours,
    });
  };

  const handleNext = () => {
    nextStep();
    router.push('/(onboarding)/injuries');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  return (
    <OnboardingScreen
      title="How much time can you dedicate to training?"
      subtitle="This helps us create a realistic training schedule that fits your lifestyle"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={handlePrevious}
    >
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Training Days Per Week</Text>
          <Text style={styles.currentValue}>{daysPerWeek} day{daysPerWeek !== 1 ? 's' : ''}</Text>
          
          <View style={styles.buttonGrid}>
            {[1, 2, 3, 4, 5, 6, 7].map((days) => (
              <NumberButton
                key={days}
                value={days}
                selected={daysPerWeek === days}
                onSelect={() => handleSetDays(days)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hours Per Training Session</Text>
          <Text style={styles.currentValue}>
            {hoursPerSession === 0.5 ? '30 minutes' : 
             hoursPerSession === 1 ? '1 hour' : 
             hoursPerSession === 1.5 ? '1.5 hours' : 
             hoursPerSession === 2 ? '2 hours' : 
             hoursPerSession === 2.5 ? '2.5 hours' : 
             '3+ hours'}
          </Text>
          
          <View style={styles.buttonGrid}>
            {[0.5, 1, 1.5, 2, 2.5, 3].map((hours) => (
              <NumberButton
                key={hours}
                value={hours === 0.5 ? '30m' : hours === 3 ? '3h+' : `${hours}h`}
                selected={hoursPerSession === hours}
                onSelect={() => handleSetHours(hours)}
              />
            ))}
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Your Training Schedule</Text>
          <Text style={styles.summaryText}>
            {daysPerWeek} training session{daysPerWeek !== 1 ? 's' : ''} per week, {' '}
            {hoursPerSession === 0.5 ? '30 minutes' : 
             hoursPerSession === 1 ? '1 hour' : 
             hoursPerSession === 1.5 ? '1.5 hours' : 
             hoursPerSession === 2 ? '2 hours' : 
             hoursPerSession === 2.5 ? '2.5 hours' : 
             '3+ hours'} each
          </Text>
          <Text style={styles.weeklyTotal}>
            Total: {daysPerWeek * hoursPerSession} hours per week
          </Text>
        </View>
      </View>
    </OnboardingScreen>
  );
}

interface NumberButtonProps {
  value: string | number;
  selected: boolean;
  onSelect: () => void;
}

function NumberButton({ value, selected, onSelect }: NumberButtonProps) {
  return (
    <Text
      style={[
        styles.numberButton,
        selected && styles.numberButtonSelected,
      ]}
      onPress={onSelect}
    >
      {value}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  currentValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary[500],
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  numberButton: {
    minWidth: 60,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[700],
    textAlign: 'center',
    overflow: 'hidden',
  },
  numberButtonSelected: {
    backgroundColor: Colors.primary[500],
    color: Colors.white,
  },
  summary: {
    backgroundColor: Colors.gray[50],
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 20,
  },
  weeklyTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[600],
    marginTop: 8,
  },
});