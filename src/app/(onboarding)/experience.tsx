import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { OnboardingScreen } from '@/components/organisms/OnboardingScreen';
import { SelectableCard } from '@/components/molecules/SelectableCard';
import { useStore } from '@/store';

const experienceOptions = [
  {
    id: 'beginner' as const,
    title: 'Beginner',
    description: 'New to climbing or less than 6 months experience',
  },
  {
    id: 'intermediate' as const,
    title: 'Intermediate',
    description: '6 months to 2 years of regular climbing',
  },
  {
    id: 'advanced' as const,
    title: 'Advanced',
    description: '2+ years with consistent training',
  },
  {
    id: 'elite' as const,
    title: 'Elite',
    description: 'Competitive level or professional climber',
  },
];

export default function ExperienceScreen() {
  const { data, currentStep, totalSteps, setExperience, nextStep } = useStore();
  const selectedExperience = data.experience;

  const handleSelectExperience = (experience: typeof selectedExperience) => {
    setExperience(experience);
  };

  const handleNext = () => {
    nextStep();
    router.push('/(onboarding)/grade');
  };

  const canProceed = selectedExperience !== null;

  return (
    <OnboardingScreen
      title="What's your climbing experience?"
      subtitle="This helps us create a training plan that matches your current level"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={canProceed ? handleNext : undefined}
      nextDisabled={!canProceed}
    >
      <View style={{ gap: 12 }}>
        {experienceOptions.map((option) => (
          <SelectableCard
            key={option.id}
            title={option.title}
            description={option.description}
            selected={selectedExperience === option.id}
            onSelect={() => handleSelectExperience(option.id)}
          />
        ))}
      </View>
    </OnboardingScreen>
  );
}