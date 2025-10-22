import React from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {Layout} from '@/components/Layout';
import {Text, Spacer, Card} from '@/components';
import {theme} from '@/theme';

export function ScheduleScreen() {
  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text variant="h1">Schedule</Text>
        <Spacer size="lg" />
        <Card padding="medium">
          <Text variant="body" color="textSecondary">
            Your training schedule will appear here.
          </Text>
        </Card>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
});
