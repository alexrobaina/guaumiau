import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useTrainingPlanTemplates } from '@/hooks/queries/useTrainingPlans';
import { Colors } from '@/lib/colors';
import { TrainingPlan, TrainingPlanService } from '@/lib/services/trainingPlanService';
import { AuthService } from '@/lib/firebase/auth';
import ShareTemplateModal from '@/components/organisms/ShareTemplateModal';

export default function TemplateLibraryScreen() {
  const { data: templates, isLoading, error } = useTrainingPlanTemplates();
  const [creatingPlanId, setCreatingPlanId] = useState<string | null>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TrainingPlan | null>(null);
  const queryClient = useQueryClient();

  const handleAddTraining = async (template: TrainingPlan) => {
    if (!template.id) {
      Alert.alert('Error', 'Template ID not found');
      return;
    }

    try {
      setCreatingPlanId(template.id);

      const currentUser = AuthService.getCurrentUser();
      if (!currentUser?.uid) {
        Alert.alert('Error', 'You must be logged in to create a training plan');
        return;
      }

      console.log('📋 Creating training plan from template:', template.id);

      const newPlanId = await TrainingPlanService.createPlanFromTemplate(
        template.id,
        currentUser.uid
      );

      // Invalidate training plans cache to refetch the list
      await queryClient.invalidateQueries({ queryKey: ['training-plans'] });

      Alert.alert(
        'Success',
        'Training plan created successfully!',
        [
          {
            text: 'View Plan',
            onPress: () => {
              router.push(`/training-plan-detail?planId=${newPlanId}`);
            },
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('❌ Error creating plan from template:', error);
      Alert.alert('Error', 'Failed to create training plan from template');
    } finally {
      setCreatingPlanId(null);
    }
  };

  const handleViewTemplate = (template: TrainingPlan) => {
    if (template.id) {
      router.push(`/training-plan-detail?planId=${template.id}&viewOnly=true`);
    }
  };

  const handleShareTemplate = (template: TrainingPlan) => {
    setSelectedTemplate(template);
    setShareModalVisible(true);
  };

  const renderTemplateCard = (template: TrainingPlan) => {
    return (
      <View key={template.id} style={styles.templateCard}>
        <View style={styles.templateHeader}>
          <View style={styles.templateIcon}>
            <Ionicons name="document-text-outline" size={24} color={Colors.primary[500]} />
          </View>
          <View style={styles.templateInfo}>
            <Text style={styles.templateName}>{template.name}</Text>
            <Text style={styles.templateDescription} numberOfLines={2}>
              {template.description || 'No description'}
            </Text>
          </View>
        </View>

        <View style={styles.templateDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color={Colors.gray[600]} />
            <Text style={styles.detailText}>{template.duration} weeks</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="fitness-outline" size={16} color={Colors.gray[600]} />
            <Text style={styles.detailText}>{template.daysPerWeek} days/week</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="trending-up-outline" size={16} color={Colors.gray[600]} />
            <Text style={styles.detailText}>
              {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.templateTags}>
          {template.goals?.slice(0, 3).map((goal, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{goal}</Text>
            </View>
          ))}
        </View>

        <View style={styles.templateActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={() => handleAddTraining(template)}
            activeOpacity={0.7}
            disabled={creatingPlanId === template.id}
          >
            {creatingPlanId === template.id ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={20} color={Colors.white} />
                <Text style={styles.actionButtonText}>Add Training</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => handleViewTemplate(template)}
            activeOpacity={0.7}
          >
            <Ionicons name="eye-outline" size={18} color={Colors.primary[500]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={() => handleShareTemplate(template)}
            activeOpacity={0.7}
          >
            <Ionicons name="share-social-outline" size={18} color={Colors.gray[600]} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[Colors.primary[500], Colors.primary[600]]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Template Library</Text>
              <Text style={styles.headerSubtitle}>Choose from pre-made templates</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>
        </LinearGradient>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
          <Text style={styles.loadingText}>Loading templates...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[Colors.primary[500], Colors.primary[600]]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Template Library</Text>
              <Text style={styles.headerSubtitle}>Choose from pre-made templates</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>
        </LinearGradient>

        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.error[500]} />
          <Text style={styles.errorText}>Failed to load templates</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Template Library</Text>
            <Text style={styles.headerSubtitle}>
              {templates?.length || 0} templates available
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {templates && templates.length > 0 ? (
          <View style={styles.templateList}>
            {templates.map(template => renderTemplateCard(template))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="library-outline" size={64} color={Colors.gray[400]} />
            <Text style={styles.emptyText}>No templates available yet</Text>
            <Text style={styles.emptySubtext}>
              Create a training plan and mark it as a template to see it here
            </Text>
          </View>
        )}
      </ScrollView>

      <ShareTemplateModal
        visible={shareModalVisible}
        template={selectedTemplate}
        onClose={() => {
          setShareModalVisible(false);
          setSelectedTemplate(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  templateList: {
    padding: 16,
  },
  templateCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  templateIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: Colors.gray[600],
    lineHeight: 20,
  },
  templateDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: Colors.gray[700],
  },
  templateTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.primary[50],
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary[700],
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  addButton: {
    flex: 1,
    backgroundColor: Colors.primary[500],
  },
  viewButton: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary[500],
    paddingHorizontal: 12,
  },
  shareButton: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray[600],
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 8,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 8,
    textAlign: 'center',
  },
});
