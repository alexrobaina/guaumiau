import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUserProfile } from '@/hooks/queries/useUserProfile';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/lib/colors';

export default function TrainingGoalsScreen() {
  const { isAuthenticated } = useAuth();
  const { data: userProfile, isLoading, error } = useUserProfile();

  const InfoCard = ({
    icon,
    title,
    value,
    description
  }: {
    icon: string;
    title: string;
    value: string | string[] | number;
    description?: string;
  }) => (
    <View style={styles.infoCard}>
      <View style={styles.infoCardHeader}>
        <Ionicons name={icon as any} size={24} color={Colors.primary[500]} />
        <Text style={styles.infoCardTitle}>{title}</Text>
      </View>
      <View style={styles.infoCardContent}>
        {Array.isArray(value) ? (
          <View style={styles.tagsContainer}>
            {value.map((item, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
            {value.length === 0 && (
              <Text style={styles.emptyText}>Not set</Text>
            )}
          </View>
        ) : (
          <Text style={styles.infoCardValue}>
            {value || 'Not set'}
          </Text>
        )}
        {description && (
          <Text style={styles.infoCardDescription}>{description}</Text>
        )}
      </View>
    </View>
  );

  const formatEquipment = (equipment: string[]) => {
    if (!equipment || equipment.length === 0) return ['None'];

    return equipment.map(item => {
      switch (item) {
        case 'fingerboard': return 'Fingerboard';
        case 'campus-board': return 'Campus Board';
        case 'system-board': return 'System Board';
        case 'pull-up-bar': return 'Pull-up Bar';
        case 'rings': return 'Gymnastics Rings';
        case 'resistance-bands': return 'Resistance Bands';
        case 'dumbbells': return 'Dumbbells';
        case 'kettlebells': return 'Kettlebells';
        case 'foam-roller': return 'Foam Roller';
        case 'lacrosse-ball': return 'Lacrosse Ball';
        case 'yoga-mat': return 'Yoga Mat';
        case 'gym': return 'Gym Access';
        case 'none': return 'Bodyweight Only';
        default: return item;
      }
    });
  };

  const formatGrade = (currentGrade: any) => {
    if (!currentGrade) return 'Not set';
    const parts = [];
    if (currentGrade.boulder) parts.push(`${currentGrade.boulder} (boulder)`);
    if (currentGrade.sport) parts.push(`${currentGrade.sport} (sport)`);
    if (currentGrade.french) parts.push(`${currentGrade.french} (french)`);
    return parts.join(', ') || 'Not set';
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notLoggedIn}>
          <Ionicons name="person-outline" size={64} color={Colors.gray[400]} />
          <Text style={styles.notLoggedInText}>Please login to view your training goals</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <View style={styles.headerIconContainer}>
              <Ionicons name="trophy" size={28} color={Colors.white} />
            </View>
            <Text style={styles.headerTitle}>Training Goals</Text>
            <Text style={styles.headerSubtitle}>Track your climbing journey</Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/(onboarding)/experience')}
          >
            <Ionicons name="create-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary[500]} />
            <Text style={styles.loadingText}>Loading your training profile...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={48} color={Colors.error} />
            <Text style={styles.errorText}>Unable to load your training profile</Text>
            <Text style={styles.errorSubtext}>Please try again later</Text>
          </View>
        ) : userProfile ? (
          <>
            {/* Experience & Level */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience & Level</Text>

              <InfoCard
                icon="trending-up"
                title="Experience Level"
                value={userProfile.experience?.charAt(0).toUpperCase() + userProfile.experience?.slice(1) || 'Not set'}
                description="Your climbing experience level"
              />

              <InfoCard
                icon="trophy"
                title="Current Grades"
                value={formatGrade(userProfile.currentGrade)}
                description="Your current climbing grades"
              />

              <InfoCard
                icon="heart"
                title="Preferred Style"
                value={userProfile.preferredStyle ?
                  userProfile.preferredStyle === 'all' ? 'All Styles' :
                  userProfile.preferredStyle === 'gym' ? 'Gym & Fitness' :
                  userProfile.preferredStyle.charAt(0).toUpperCase() + userProfile.preferredStyle.slice(1)
                  : 'Not set'}
                description="Your preferred climbing style"
              />
            </View>

            {/* Goals */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Training Goals</Text>

              <InfoCard
                icon="target"
                title="Your Goals"
                value={userProfile.goals || []}
                description="What you want to achieve with your training"
              />
            </View>

            {/* Training Setup */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Training Setup</Text>

              <InfoCard
                icon="calendar"
                title="Training Schedule"
                value={userProfile.trainingAvailability ?
                  `${userProfile.trainingAvailability.daysPerWeek} days/week, ${userProfile.trainingAvailability.hoursPerSession}h per session`
                  : 'Not set'}
                description="How often you can train"
              />

              <InfoCard
                icon="barbell"
                title="Available Equipment"
                value={formatEquipment(userProfile.equipment)}
                description="Equipment you have access to"
              />

              {userProfile.injuries && userProfile.injuries.length > 0 && (
                <InfoCard
                  icon="medical"
                  title="Injuries/Limitations"
                  value={userProfile.injuries}
                  description="Current injuries or physical limitations"
                />
              )}
            </View>

            {/* Update Prompt */}
            <View style={styles.updateSection}>
              <View style={styles.updatePrompt}>
                <Ionicons name="information-circle" size={24} color={Colors.primary[500]} />
                <View style={styles.updateText}>
                  <Text style={styles.updateTitle}>Keep Your Goals Updated</Text>
                  <Text style={styles.updateDescription}>
                    Your training goals help us create better workouts for you. Update them anytime as you progress.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => router.push('/(onboarding)/experience')}
              >
                <Ionicons name="create" size={20} color={Colors.white} />
                <Text style={styles.updateButtonText}>Update Goals</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="clipboard-outline" size={48} color={Colors.gray[400]} />
            <Text style={styles.noDataText}>No training profile found</Text>
            <Text style={styles.noDataSubtext}>Complete your onboarding to set up your training goals</Text>
            <TouchableOpacity
              style={styles.onboardingButton}
              onPress={() => router.push('/(onboarding)/experience')}
            >
              <Text style={styles.onboardingButtonText}>Start Onboarding</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    paddingBottom: 32,
    paddingTop: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    fontWeight: '500',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray[600],
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginLeft: 8,
  },
  infoCardContent: {
    marginLeft: 32,
  },
  infoCardValue: {
    fontSize: 15,
    color: Colors.gray[700],
    lineHeight: 22,
  },
  infoCardDescription: {
    fontSize: 13,
    color: Colors.gray[500],
    marginTop: 4,
    fontStyle: 'italic',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    backgroundColor: Colors.primary[100],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: Colors.primary[700],
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.gray[400],
    fontStyle: 'italic',
  },
  updateSection: {
    marginBottom: 40,
  },
  updatePrompt: {
    backgroundColor: Colors.primary[50],
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary[400],
  },
  updateText: {
    flex: 1,
    marginLeft: 12,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[700],
    marginBottom: 4,
  },
  updateDescription: {
    fontSize: 14,
    color: Colors.primary[600],
    lineHeight: 20,
  },
  updateButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginLeft: 8,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  notLoggedInText: {
    fontSize: 18,
    color: Colors.gray[600],
    marginVertical: 24,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginTop: 16,
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  onboardingButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  onboardingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});