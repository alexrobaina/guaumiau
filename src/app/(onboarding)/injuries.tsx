import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { OnboardingScreen } from '@/components/organisms/OnboardingScreen';
import { SelectableCard } from '@/components/molecules/SelectableCard';
import { Text, Input } from '@/components/atoms';
import { useStore } from '@/store';
import { Colors } from '@/lib/colors';

const commonInjuries = [
  {
    id: 'finger-pulley',
    title: 'Finger Pulley Injury',
    description: 'A2/A3/A4 pulley strain or rupture',
  },
  {
    id: 'elbow-tendinopathy',
    title: 'Elbow Tendinopathy',
    description: 'Tennis elbow (lateral epicondylitis) or golfer\'s elbow',
  },
  {
    id: 'shoulder-impingement',
    title: 'Shoulder Impingement',
    description: 'Pain or restriction in shoulder movement',
  },
  {
    id: 'wrist-injury',
    title: 'Wrist Injury',
    description: 'TFCC, scaphoid, or general wrist pain',
  },
  {
    id: 'neck-strain',
    title: 'Neck Strain',
    description: 'Chronic tension or acute neck injury',
  },
  {
    id: 'back-injury',
    title: 'Back Injury',
    description: 'Lower back pain or disc issues',
  },
  {
    id: 'knee-injury',
    title: 'Knee Injury',
    description: 'Meniscus, ligament, or patella issues',
  },
  {
    id: 'ankle-injury',
    title: 'Ankle Injury',
    description: 'Chronic instability or acute sprains',
  },
];

export default function InjuriesScreen() {
  const { data, currentStep, totalSteps, setInjuries, nextStep, previousStep } = useStore();
  const selectedInjuries = data.injuries;
  const [customInjury, setCustomInjury] = useState('');

  const handleToggleInjury = (injuryId: string) => {
    const isSelected = selectedInjuries.includes(injuryId);
    if (isSelected) {
      setInjuries(selectedInjuries.filter(id => id !== injuryId));
    } else {
      setInjuries([...selectedInjuries, injuryId]);
    }
  };

  const handleAddCustomInjury = () => {
    if (customInjury.trim() && !selectedInjuries.includes(customInjury.trim())) {
      setInjuries([...selectedInjuries, customInjury.trim()]);
      setCustomInjury('');
    }
  };

  const handleNext = () => {
    nextStep();
    router.push('/(onboarding)/style');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  return (
    <OnboardingScreen
      title="Do you have any injuries or limitations?"
      subtitle="This helps us avoid exercises that might aggravate existing issues and include appropriate modifications"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={handlePrevious}
    >
      <View style={styles.container}>
        <View style={styles.noInjuryContainer}>
          <SelectableCard
            title="No Current Injuries"
            description="I don't have any injuries or limitations affecting my training"
            selected={selectedInjuries.length === 0 || selectedInjuries.includes('none')}
            onSelect={() => {
              if (selectedInjuries.includes('none') || selectedInjuries.length === 0) {
                setInjuries([]);
              } else {
                setInjuries(['none']);
              }
            }}
          />
        </View>

        {!selectedInjuries.includes('none') && (
          <>
            <View style={styles.injuriesContainer}>
              {commonInjuries.map((injury) => (
                <SelectableCard
                  key={injury.id}
                  title={injury.title}
                  description={injury.description}
                  selected={selectedInjuries.includes(injury.id)}
                  onSelect={() => handleToggleInjury(injury.id)}
                />
              ))}
            </View>

            <View style={styles.customInjurySection}>
              <Text style={styles.sectionTitle}>Other Injury or Limitation</Text>
              <View style={styles.customInjuryInput}>
                <Input
                  placeholder="Describe any other injuries or limitations..."
                  value={customInjury}
                  onChangeText={setCustomInjury}
                  onSubmitEditing={handleAddCustomInjury}
                  returnKeyType="done"
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>

            {selectedInjuries.some(injury => !commonInjuries.some(c => c.id === injury) && injury !== 'none') && (
              <View style={styles.customInjuriesDisplay}>
                <Text style={styles.sectionTitle}>Your Other Injuries/Limitations</Text>
                {selectedInjuries
                  .filter(injury => !commonInjuries.some(c => c.id === injury) && injury !== 'none')
                  .map((injury, index) => (
                    <View key={index} style={styles.customInjuryChip}>
                      <Text style={styles.customInjuryText}>{injury}</Text>
                      <Text 
                        style={styles.removeButton}
                        onPress={() => handleToggleInjury(injury)}
                      >
                        ✕
                      </Text>
                    </View>
                  ))
                }
              </View>
            )}
          </>
        )}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ This information is for training customization only. Always consult with a healthcare professional for injury management and before starting any new exercise program.
          </Text>
        </View>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noInjuryContainer: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  injuriesContainer: {
    marginBottom: 24,
  },
  customInjurySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 12,
  },
  customInjuryInput: {
    marginBottom: 16,
  },
  customInjuriesDisplay: {
    marginBottom: 24,
  },
  customInjuryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  customInjuryText: {
    color: Colors.primary[700],
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
    flexShrink: 1,
  },
  removeButton: {
    color: Colors.primary[500],
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  disclaimer: {
    backgroundColor: Colors.tertiary[50],
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.tertiary[400],
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.tertiary[800],
    lineHeight: 18,
  },
});