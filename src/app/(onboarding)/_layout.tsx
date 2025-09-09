import React from 'react';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Prevent swiping back during onboarding
      }}
    >
      <Stack.Screen name="experience" />
      <Stack.Screen name="grade" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="equipment" />
      <Stack.Screen name="availability" />
      <Stack.Screen name="injuries" />
      <Stack.Screen name="style" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}