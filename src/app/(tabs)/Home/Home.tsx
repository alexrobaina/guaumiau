import React from 'react';
import { View as RNView } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '@/store';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { View } from '@/components/Themed';

import { HomeScreenProps } from './Home.types';
import { makeStyles } from './Home.styles';

export const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { user, isAuthenticated } = useStore();
  const styles = makeStyles();

  return (
    <View style={styles.container}>
      <Text variant="h1" style={styles.title}>
        Welcome to CruxClimb!
      </Text>

      <Text variant="body" style={styles.subtitle}>
        Your climbing training companion designed to help you reach new heights.
      </Text>

      <Text variant="body" style={styles.description}>
        CruxClimb is a personalized climbing training app that creates custom workout plans based on your experience level, climbing style, and goals. Track your progress, learn new techniques, and build strength systematically.
      </Text>

      <Text variant="body" style={styles.howToUse}>
        <Text style={{ fontWeight: 'bold' }}>How to use:</Text> Complete the quick setup to tell us about your climbing background, then access personalized training routines, track your sessions, and monitor your improvement over time.
      </Text>

      {user?.displayName && (
        <Text variant="body" style={styles.subtitle}>
          {user.displayName}
        </Text>
      )}

      <RNView style={styles.buttonContainer}>
        <Button onPress={() => router.push('/(onboarding)/experience')} variant="primary">
          Start Training
        </Button>
      </RNView>

      <RNView style={styles.statusContainer}>
        <Text variant="caption" style={styles.status}>
          Status: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
        </Text>
      </RNView>
    </View>
  );
};
