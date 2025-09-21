import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useHomeScreenRouting } from '@/hooks/business/useHomeScreenRouting';
import { Colors } from '@/lib/colors';

export default function IndexScreen() {
  const { shouldShowLoading } = useHomeScreenRouting();

  // Show loading screen while determining routing
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
