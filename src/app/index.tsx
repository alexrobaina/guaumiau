import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '@/store';
import { Colors } from '@/lib/colors';

export default function IndexScreen() {
  const { isAuthenticated, isInitialized, onboarding } = useStore();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (!isInitialized || hasNavigated) {
      return; // Wait for auth to initialize or prevent re-navigation
    }

    // Navigate based on onboarding and authentication status
    const navigate = async () => {
      setHasNavigated(true);
      
      // Check if user has completed onboarding first
      if (!onboarding.data.completed) {
        // User hasn't completed onboarding - start onboarding flow
        router.replace('/(onboarding)/experience');
      } else if (isAuthenticated) {
        // User completed onboarding and is authenticated - go to main app
        router.replace('/(tabs)');
      } else {
        // User completed onboarding but not authenticated - ask to login
        router.replace('/(auth)/login');
      }
    };

    // Add a small delay to prevent immediate navigation loops
    const timeoutId = setTimeout(navigate, 100);
    
    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, isInitialized, hasNavigated, onboarding.data.completed]);

  // Show loading screen while determining auth state
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.primary[500]
    }}>
      <ActivityIndicator size="large" color={Colors.white} />
    </View>
  );
}
