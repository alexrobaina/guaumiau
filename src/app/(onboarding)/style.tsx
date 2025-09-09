import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { OnboardingScreen } from '@/components/organisms/OnboardingScreen';
import { SelectableCard } from '@/components/molecules/SelectableCard';
import { Text } from '@/components/atoms';
import { useStore } from '@/store';
import { Colors } from '@/lib/colors';

const climbingStyles = [
  {
    id: 'boulder' as const,
    title: 'Bouldering',
    description: 'Short, powerful problems on walls up to 15 feet',
    emoji: '🪨',
  },
  {
    id: 'sport' as const,
    title: 'Sport Climbing',
    description: 'Longer routes with pre-placed bolts for protection',
    emoji: '🧗',
  },
  {
    id: 'trad' as const,
    title: 'Traditional Climbing',
    description: 'Routes where you place your own protection',
    emoji: '⚙️',
  },
  {
    id: 'all' as const,
    title: 'All Styles',
    description: 'I enjoy all types of climbing equally',
    emoji: '🌟',
  },
];

export default function StyleScreen() {
  const { data, currentStep, totalSteps, setPreferredStyle, nextStep, previousStep } = useStore();
  const selectedStyle = data.preferredStyle;

  const handleSelectStyle = (style: typeof selectedStyle) => {
    setPreferredStyle(style);
  };

  const handleNext = () => {
    nextStep();
    router.push('/(onboarding)/complete');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  const canProceed = selectedStyle !== null;

  return (
    <OnboardingScreen
      title="What's your preferred climbing style?"
      subtitle="This helps us focus your training on the movements and energy systems most relevant to your goals"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={canProceed ? handleNext : undefined}
      onPrevious={handlePrevious}
      nextDisabled={!canProceed}
      nextButtonText="Complete Setup"
    >
      <View style={styles.container}>
        {climbingStyles.map((style) => (
          <View key={style.id} style={styles.styleCard}>
            <SelectableCard
              title={style.title}
              description={style.description}
              selected={selectedStyle === style.id}
              onSelect={() => handleSelectStyle(style.id)}
              icon={
                <Text style={styles.emoji}>{style.emoji}</Text>
              }
            />
          </View>
        ))}

        <View style={styles.helpText}>
          <Text style={styles.helpTitle}>💡 Not sure?</Text>
          <Text style={styles.helpDescription}>
            Choose "All Styles" if you're just starting out or enjoy variety in your climbing. 
            You can always adjust this later in your profile settings.
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
  styleCard: {
    marginBottom: 12,
  },
  emoji: {
    fontSize: 24,
  },
  helpText: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.secondary[50],
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary[400],
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary[800],
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 13,
    color: Colors.secondary[700],
    lineHeight: 18,
  },
});