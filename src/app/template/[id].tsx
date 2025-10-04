import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrainingPlanService } from '@/lib/services/trainingPlanService';
import { AuthService } from '@/lib/firebase/auth';
import { Colors } from '@/lib/colors';

export default function TemplateDeepLinkScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleTemplateAccess();
  }, [id]);

  const handleTemplateAccess = async () => {
    try {
      if (!id) {
        Alert.alert('Error', 'Invalid template link');
        router.replace('/');
        return;
      }

      const currentUser = AuthService.getCurrentUser();
      if (!currentUser?.uid) {
        Alert.alert(
          'Login Required',
          'Please login to access this template',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => router.replace('/'),
            },
            {
              text: 'Login',
              onPress: () => router.replace('/(auth)/login'),
            },
          ]
        );
        return;
      }

      console.log('📱 Deep link accessed for template:', id);

      // Add user to the shared template
      await TrainingPlanService.addUserToSharedTemplate(id, currentUser.uid);

      Alert.alert(
        'Template Added!',
        'This template has been added to your library. Would you like to view it now?',
        [
          {
            text: 'Later',
            style: 'cancel',
            onPress: () => router.replace('/template-library'),
          },
          {
            text: 'View Template',
            onPress: () => {
              router.replace(`/training-plan-detail?planId=${id}&viewOnly=true`);
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Error accessing template:', error);
      Alert.alert(
        'Error',
        'Failed to access template. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/'),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
          <Text style={styles.loadingText}>Loading template...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray[600],
    marginTop: 16,
  },
});
