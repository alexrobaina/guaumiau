import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { TrainingPlanTabScreen } from './(tabs)/training-plan-tab';

export default function TrainingPlansScreen() {
  const { view } = useLocalSearchParams<{ view?: string }>();
  return <TrainingPlanTabScreen initialView={view as 'current' | 'history' | 'create'} />;
}