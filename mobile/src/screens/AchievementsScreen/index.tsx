import React from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {Layout} from '@/components/Layout';
import {Text, Spacer, Card} from '@/components';
import {theme} from '@/theme';

export function AchievementsScreen() {
  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text variant="h1">Achievements</Text>
        <Spacer size="lg" />
        <Card padding="medium">
          <Text variant="body" color="textSecondary">
            Your achievements and progress will appear here.
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
