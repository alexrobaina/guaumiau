import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useTrainingPlans } from '@/hooks/queries/useTrainingPlans';
import { useInitializeProgress } from '@/hooks/mutations/useInitializeProgress';
import {
  useResetTrainingPlan,
  useArchiveTrainingPlan,
} from '@/hooks/mutations/useTrainingPlanMutations';
import { Button } from '@/components/atoms/Button';
import { Colors } from '@/lib/colors';
import { formatDistanceToNow } from 'date-fns';

interface TrainingPlanTabScreenProps {
  initialView?: 'current' | 'history' | 'create';
  onToggleSidebar?: () => void;
}

export const TrainingPlanTabScreen: React.FC<TrainingPlanTabScreenProps> = ({
  initialView,
  onToggleSidebar,
}) => {
  const { isAuthenticated } = useAuth();
  const { data: trainingPlans, isLoading, error } = useTrainingPlans();
  const initializeProgress = useInitializeProgress();
  const resetPlanMutation = useResetTrainingPlan();
  const archivePlanMutation = useArchiveTrainingPlan();
  const [selectedView, setSelectedView] = useState<
    'current' | 'history' | 'create'
  >(initialView || 'current');

  // Initialize progress data for plans that don't have it
  useEffect(() => {
    if (trainingPlans && trainingPlans.length > 0) {
      const plansWithoutProgress = trainingPlans.filter(plan => !plan.progress);
      if (plansWithoutProgress.length > 0) {
        console.log(
          '🔄 Found plans without progress data, initializing...',
          plansWithoutProgress.length
        );
        initializeProgress.mutate();
      }
    }
  }, [trainingPlans]);

  // Handle edit plan (only if plan not started)
  const handleEditPlan = (plan: any) => {
    router.push(`/training-plan-creator?planId=${plan.id}`);
  };

  // Handle reset plan
  const handleResetPlan = (plan: any) => {
    Alert.alert(
      'Reset Training Plan',
      `Are you sure you want to reset "${plan.name}"? This will remove all your progress and start the plan from the beginning.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetPlanMutation.mutate(plan.id, {
              onSuccess: () => {
                Alert.alert(
                  'Success',
                  'Training plan has been reset successfully.'
                );
              },
              onError: error => {
                Alert.alert(
                  'Error',
                  error.message ||
                    'Failed to reset training plan. Please try again.'
                );
              },
            });
          },
        },
      ]
    );
  };

  // Handle archive plan (instead of delete)
  const handleArchivePlan = (plan: any) => {
    Alert.alert(
      'Archive Training Plan',
      `Are you sure you want to archive "${plan.name}"? You can restore it later if needed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: () => {
            archivePlanMutation.mutate(plan.id, {
              onSuccess: () => {
                Alert.alert(
                  'Success',
                  'Training plan has been archived successfully.'
                );
              },
              onError: error => {
                Alert.alert(
                  'Error',
                  error.message ||
                    'Failed to archive training plan. Please try again.'
                );
              },
            });
          },
        },
      ]
    );
  };

  const ActionCard = ({
    icon,
    title,
    description,
    onPress,
    color = Colors.primary[500],
    badge,
  }: {
    icon: string;
    title: string;
    description: string;
    onPress: () => void;
    color?: string;
    badge?: string;
  }) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
    </TouchableOpacity>
  );

  const TrainingPlanCard = ({ plan }: { plan: any }) => {
    // Calculate completion from Firebase progress data
    const daysCompleted = plan.progress?.completedDays || 0;
    const totalDays =
      plan.progress?.totalDays || plan.duration * plan.daysPerWeek; // use progress total or calculate
    const completionPercentage =
      plan.progress?.completionRate ||
      Math.round(totalDays > 0 ? (daysCompleted / totalDays) * 100 : 0);

    // Determine if plan can be edited (only if draft or no progress)
    const canEdit = plan.status === 'draft' || completionPercentage === 0;

    return (
      <View style={styles.planCard}>
        <TouchableOpacity
          style={styles.planMainContent}
          onPress={() => router.push(`/training-plan-detail?planId=${plan.id}`)}
          activeOpacity={0.7}
        >
          <View style={styles.planHeader}>
            <View style={styles.planTitleContainer}>
              <Text style={styles.planTitle}>{plan.name}</Text>
              <Text style={styles.planSubtitle}>
                {plan.duration} week plan • {plan.daysPerWeek} days/week
              </Text>
            </View>
            <View
              style={[
                styles.planStatus,
                plan.status === 'active'
                  ? styles.planStatusActive
                  : plan.status === 'completed'
                    ? styles.planStatusCompleted
                    : styles.planStatusInactive,
              ]}
            >
              <Text
                style={[
                  styles.planStatusText,
                  plan.status === 'active'
                    ? styles.planStatusTextActive
                    : plan.status === 'completed'
                      ? styles.planStatusTextActive
                      : styles.planStatusTextInactive,
                ]}
              >
                {plan.status === 'active'
                  ? 'Active'
                  : plan.status === 'completed'
                    ? 'Completed'
                    : plan.status === 'draft'
                      ? 'Draft'
                      : 'Paused'}
              </Text>
            </View>
          </View>

          <View style={styles.planProgress}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${completionPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {completionPercentage}% complete
            </Text>
          </View>

          <View style={styles.planFooter}>
            <Text style={styles.planDate}>
              Created{' '}
              {plan.createdAt && plan.createdAt.toDate
                ? formatDistanceToNow(plan.createdAt.toDate()) + ' ago'
                : 'Unknown'}
            </Text>
            <Text style={styles.planType}>
              {plan.isTemplate ? 'Template' : 'Custom'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Action Buttons - Only show for current plans (active/draft) */}
        {(plan.status === 'active' || plan.status === 'draft') && (
          <View style={styles.planActions}>
            {canEdit && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditPlan(plan)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={Colors.primary[600]}
                />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleResetPlan(plan)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="refresh-outline"
                size={18}
                color={Colors.warning}
              />
              <Text
                style={[styles.actionButtonText, { color: Colors.warning }]}
              >
                Reset
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleArchivePlan(plan)}
              activeOpacity={0.7}
            >
              <Ionicons name="archive-outline" size={18} color={Colors.error} />
              <Text style={[styles.actionButtonText, { color: Colors.error }]}>
                Archive
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderCurrentPlans = () => {
    const currentPlans =
      trainingPlans?.filter(
        plan => plan.status === 'active' || plan.status === 'draft'
      ) || [];

    if (currentPlans.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="fitness-outline" size={64} color={Colors.gray[400]} />
          <Text style={styles.emptyStateTitle}>No Training Plans</Text>
          <Text style={styles.emptyStateDescription}>
            Create your first training plan to get started with your climbing
            journey.
          </Text>
          <Button
            onPress={() => router.push('/plan-generation')}
            variant="primary"
            size="lg"
            style={styles.createButton}
          >
            Create AI Training Plan
          </Button>

          <Text style={styles.debugInfo}>
            Debug: {trainingPlans?.length || 0} total plans found
          </Text>
        </View>
      );
    }

    return (
      <View>
        {currentPlans.map(plan => (
          <TrainingPlanCard key={plan.id} plan={plan} />
        ))}
        <Text style={styles.debugInfo}>
          Showing {currentPlans.length} current plans out of{' '}
          {trainingPlans?.length || 0} total
        </Text>
      </View>
    );
  };

  const renderHistory = () => {
    const completedPlans =
      trainingPlans?.filter(plan => plan.status === 'completed') || [];

    if (completedPlans.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={64} color={Colors.gray[400]} />
          <Text style={styles.emptyStateTitle}>No Training History</Text>
          <Text style={styles.emptyStateDescription}>
            Your completed training plans will appear here.
          </Text>
        </View>
      );
    }

    return (
      <View>
        {completedPlans.map(plan => (
          <TrainingPlanCard key={plan.id} plan={plan} />
        ))}
      </View>
    );
  };

  const renderCreateOptions = () => (
    <View>
      {/* <ActionCard
        icon="sparkles"
        title="AI-Generated Plan"
        description="Create a personalized plan using AI based on your goals"
        onPress={() => router.push('/plan-generation')}
        color={Colors.primary[500]}
      /> */}

      <ActionCard
        icon="create-outline"
        title="Custom Plan"
        description="Build your own training plan from scratch"
        onPress={() => router.push('/training-plan-creator')}
        color={Colors.secondary[500]}
      />

      <ActionCard
        icon="library-outline"
        title="Template Library"
        description="Choose from pre-made training templates"
        onPress={() => router.push('/template-library')}
        color={Colors.tertiary[500]}
      />
    </View>
  );

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notLoggedIn}>
          <Ionicons name="fitness-outline" size={64} color={Colors.gray[400]} />
          <Text style={styles.notLoggedInText}>
            Please login to access training plans
          </Text>
          <Button
            onPress={() => router.push('/(auth)/login')}
            variant="primary"
            size="lg"
          >
            Login
          </Button>
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
        <View style={styles.headerTop}>
          {onToggleSidebar && (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={onToggleSidebar}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={24} color={Colors.white} />
            </TouchableOpacity>
          )}
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Training Plans</Text>
            <Text style={styles.headerSubtitle}>
              Manage your climbing training
            </Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.tab, selectedView === 'current' && styles.tabActive]}
            onPress={() => setSelectedView('current')}
          >
            <Text
              style={[
                styles.tabText,
                selectedView === 'current' && styles.tabTextActive,
              ]}
            >
              Current
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedView === 'history' && styles.tabActive]}
            onPress={() => setSelectedView('history')}
          >
            <Text
              style={[
                styles.tabText,
                selectedView === 'history' && styles.tabTextActive,
              ]}
            >
              History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedView === 'create' && styles.tabActive]}
            onPress={() => setSelectedView('create')}
          >
            <Text
              style={[
                styles.tabText,
                selectedView === 'create' && styles.tabTextActive,
              ]}
            >
              Create
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedView === 'create' ? (
          renderCreateOptions()
        ) : isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary[500]} />
            <Text style={styles.loadingText}>Loading training plans...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={48} color={Colors.error} />
            <Text style={styles.errorText}>Unable to load training plans</Text>
            <Text style={styles.errorSubtext}>Please try again later</Text>
          </View>
        ) : (
          <>
            {selectedView === 'current' && renderCurrentPlans()}
            {selectedView === 'history' && renderHistory()}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    marginBottom: 12,
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  tabSelector: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.white,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  tabTextActive: {
    color: Colors.primary[600],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: Colors.gray[600],
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  createButton: {
    marginTop: 16,
  },
  actionCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  badge: {
    backgroundColor: Colors.primary[100],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary[700],
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  planMainContent: {
    padding: 16,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planTitleContainer: {
    flex: 1,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  planStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planStatusActive: {
    backgroundColor: Colors.success + '20',
  },
  planStatusCompleted: {
    backgroundColor: Colors.primary[100],
  },
  planStatusInactive: {
    backgroundColor: Colors.gray[200],
  },
  planStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  planStatusTextActive: {
    color: Colors.success,
  },
  planStatusTextInactive: {
    color: Colors.gray[600],
  },
  planProgress: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.gray[200],
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: Colors.gray[600],
    textAlign: 'right',
  },
  planFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planDate: {
    fontSize: 12,
    color: Colors.gray[500],
  },
  planType: {
    fontSize: 12,
    color: Colors.primary[600],
    fontWeight: '500',
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
  debugInfo: {
    fontSize: 12,
    color: Colors.gray[500],
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  planActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.gray[50],
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.white,
    gap: 6,
    minWidth: 70,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary[600],
  },
});

export default TrainingPlanTabScreen;
