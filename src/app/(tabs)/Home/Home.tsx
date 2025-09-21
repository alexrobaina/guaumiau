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
        CruxClimb is your climbing training companion. Set up your profile to get started with your climbing journey.
      </Text>

      <Text variant="body" style={styles.howToUse}>
        <Text style={{ fontWeight: 'bold' }}>Getting started:</Text> Complete the onboarding to tell us about your climbing background and preferences.
      </Text>

      {user?.displayName && (
        <Text variant="body" style={styles.subtitle}>
          {user.displayName}
        </Text>
      )}

      <RNView style={styles.buttonContainer}>
        <Button onPress={() => router.push('/(onboarding)/experience')} variant="primary">
          Get Started
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
