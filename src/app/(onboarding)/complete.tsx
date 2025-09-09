import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { OnboardingScreen } from '@/components/organisms/OnboardingScreen';
import { Text } from '@/components/atoms';
import { useStore } from '@/store';
import { Colors } from '@/lib/colors';

export default function CompleteScreen() {
  const { data, currentStep, totalSteps, completeOnboarding } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Mark onboarding as complete (handles both local and Firebase saving)
      await completeOnboarding();
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Since we always complete locally, we can still navigate
      router.replace('/(tabs)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingScreen
      title="🎉 You're All Set!"
      subtitle="We've created a personalized training plan based on your preferences"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleComplete}
      nextButtonText={isLoading ? "Saving..." : "Start Training"}
      nextDisabled={isLoading}
      showProgress={false}
    >
      <View style={styles.container}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Profile Summary</Text>
          
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Experience Level:</Text>
            <Text style={styles.summaryValue}>
              {data.experience ? 
                data.experience.charAt(0).toUpperCase() + data.experience.slice(1) : 
                'Not set'}
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Current Grades:</Text>
            <Text style={styles.summaryValue}>
              {data.currentGrade.boulder && data.currentGrade.french ? 
                `${data.currentGrade.boulder} boulder, ${data.currentGrade.french} french` :
                data.currentGrade.boulder ? 
                `${data.currentGrade.boulder} boulder` :
                data.currentGrade.french ?
                `${data.currentGrade.french} french` :
                'Not set'}
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Primary Goals:</Text>
            <Text style={styles.summaryValue}>
              {data.goals.length > 0 ? 
                data.goals.slice(0, 3).join(', ') + (data.goals.length > 3 ? '...' : '') :
                'Not set'}
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Training Schedule:</Text>
            <Text style={styles.summaryValue}>
              {data.trainingAvailability.daysPerWeek} days/week, {' '}
              {data.trainingAvailability.hoursPerSession === 0.5 ? '30 min' : 
               `${data.trainingAvailability.hoursPerSession}h`} per session
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Equipment Available:</Text>
            <Text style={styles.summaryValue}>
              {data.equipment.length > 0 ? 
                `${data.equipment.length} items selected` :
                'Bodyweight only'}
            </Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Preferred Style:</Text>
            <Text style={styles.summaryValue}>
              {data.preferredStyle ? 
                data.preferredStyle === 'all' ? 'All Styles' :
                data.preferredStyle.charAt(0).toUpperCase() + data.preferredStyle.slice(1) :
                'Not set'}
            </Text>
          </View>
        </View>

        <View style={styles.nextSteps}>
          <Text style={styles.nextStepsTitle}>What's Next?</Text>
          <View style={styles.nextStepItem}>
            <Text style={styles.nextStepBullet}>•</Text>
            <Text style={styles.nextStepText}>
              Browse personalized workouts tailored to your goals
            </Text>
          </View>
          <View style={styles.nextStepItem}>
            <Text style={styles.nextStepBullet}>•</Text>
            <Text style={styles.nextStepText}>
              Start logging your training sessions and climbing
            </Text>
          </View>
          <View style={styles.nextStepItem}>
            <Text style={styles.nextStepBullet}>•</Text>
            <Text style={styles.nextStepText}>
              Track your progress and see improvements over time
            </Text>
          </View>
          <View style={styles.nextStepItem}>
            <Text style={styles.nextStepBullet}>•</Text>
            <Text style={styles.nextStepText}>
              Adjust your profile anytime in settings
            </Text>
          </View>
        </View>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.gray[900],
    marginBottom: 16,
    textAlign: 'center',
  },
  summarySection: {
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[600],
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.gray[900],
    lineHeight: 20,
  },
  nextSteps: {
    backgroundColor: Colors.primary[50],
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary[700],
    marginBottom: 16,
    textAlign: 'center',
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nextStepBullet: {
    fontSize: 16,
    color: Colors.primary[500],
    marginRight: 8,
    marginTop: 2,
  },
  nextStepText: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary[700],
    lineHeight: 20,
  },
});