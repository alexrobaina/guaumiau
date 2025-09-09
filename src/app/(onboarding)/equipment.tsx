import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { OnboardingScreen } from '@/components/organisms/OnboardingScreen';
import { SelectableCard } from '@/components/molecules/SelectableCard';
import { Text } from '@/components/atoms';
import { useStore } from '@/store';
import { Equipment } from '@/types';
import { Colors } from '@/lib/colors';

const equipmentOptions: { id: Equipment; title: string; description: string }[] = [
  {
    id: 'fingerboard',
    title: 'Fingerboard/Hangboard',
    description: 'For finger strength training',
  },
  {
    id: 'campus-board',
    title: 'Campus Board',
    description: 'For power and dynamic movement training',
  },
  {
    id: 'system-board',
    title: 'System Board',
    description: 'For technique and strength endurance',
  },
  {
    id: 'pull-up-bar',
    title: 'Pull-up Bar',
    description: 'For general upper body strength',
  },
  {
    id: 'rings',
    title: 'Gymnastics Rings',
    description: 'For functional strength and stability',
  },
  {
    id: 'resistance-bands',
    title: 'Resistance Bands',
    description: 'For antagonist training and warm-ups',
  },
  {
    id: 'dumbbells',
    title: 'Dumbbells',
    description: 'For strength training and injury prevention',
  },
  {
    id: 'kettlebells',
    title: 'Kettlebells',
    description: 'For functional strength and conditioning',
  },
  {
    id: 'foam-roller',
    title: 'Foam Roller',
    description: 'For recovery and mobility work',
  },
  {
    id: 'lacrosse-ball',
    title: 'Lacrosse Ball',
    description: 'For trigger point therapy',
  },
  {
    id: 'yoga-mat',
    title: 'Yoga Mat',
    description: 'For stretching and mobility routines',
  },
];

export default function EquipmentScreen() {
  const { data, currentStep, totalSteps, setEquipment, nextStep, previousStep } = useStore();
  const selectedEquipment = data.equipment;

  const handleToggleEquipment = (equipment: Equipment) => {
    const isSelected = selectedEquipment.includes(equipment);
    if (isSelected) {
      setEquipment(selectedEquipment.filter(item => item !== equipment));
    } else {
      setEquipment([...selectedEquipment, equipment]);
    }
  };

  const handleNext = () => {
    nextStep();
    router.push('/(onboarding)/availability');
  };

  const handlePrevious = () => {
    previousStep();
    router.back();
  };

  return (
    <OnboardingScreen
      title="What equipment do you have access to?"
      subtitle="Select all equipment you can use for training. Don't worry if you don't have much - we'll create a plan that works for you!"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={handlePrevious}
    >
      <View style={styles.container}>
        <View style={styles.equipmentContainer}>
          {equipmentOptions.map((equipment) => (
            <SelectableCard
              key={equipment.id}
              title={equipment.title}
              description={equipment.description}
              selected={selectedEquipment.includes(equipment.id)}
              onSelect={() => handleToggleEquipment(equipment.id)}
            />
          ))}
        </View>

        <View style={styles.noEquipmentContainer}>
          <SelectableCard
            title="No Equipment / Bodyweight Only"
            description="I prefer bodyweight exercises and don't have access to equipment"
            selected={selectedEquipment.includes('none')}
            onSelect={() => handleToggleEquipment('none')}
          />
        </View>

        {selectedEquipment.length > 0 && (
          <View style={styles.selectedCount}>
            <Text style={styles.selectedCountText}>
              {selectedEquipment.length} item{selectedEquipment.length !== 1 ? 's' : ''} selected
            </Text>
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
  equipmentContainer: {
    marginBottom: 24,
  },
  noEquipmentContainer: {
    marginBottom: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  selectedCount: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  selectedCountText: {
    fontSize: 14,
    color: Colors.gray[600],
    fontStyle: 'italic',
  },
});