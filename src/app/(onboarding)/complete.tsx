import React from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingScreen } from '@/components/organisms/OnboardingScreen';
import { Text } from '@/components/atoms';
import { useStore } from '@/store';
import { useCompleteOnboarding } from '@/hooks/mutations/useCompleteOnboarding';
import { Colors } from '@/lib/colors';

export default function CompleteScreen() {
  const { data, currentStep, totalSteps } = useStore();
  const { completeOnboarding, isCompleting } = useCompleteOnboarding();

  return (
    <OnboardingScreen
      title="🎉 Welcome to CruxClimb!"
      subtitle="Your climbing journey starts here. Let's create a personalized training plan based on your profile."
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={completeOnboarding}
      nextButtonText={isCompleting ? "Saving..." : "Create Your Plan"}
      nextDisabled={isCompleting}
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
            <Text style={styles.nextStepBullet}>🤖</Text>
            <Text style={styles.nextStepText}>
              AI will generate a personalized training plan based on your profile
            </Text>
          </View>
          <View style={styles.nextStepItem}>
            <Text style={styles.nextStepBullet}>📅</Text>
            <Text style={styles.nextStepText}>
              Get weekly workouts with progressive overload and auto-deload weeks
            </Text>
          </View>
          <View style={styles.nextStepItem}>
            <Text style={styles.nextStepBullet}>📈</Text>
            <Text style={styles.nextStepText}>
              Track your progress with RPE logging and session notes
            </Text>
          </View>
          <View style={styles.nextStepItem}>
            <Text style={styles.nextStepBullet}>🏆</Text>
            <Text style={styles.nextStepText}>
              Plan for competitions with peaking and taper strategies
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