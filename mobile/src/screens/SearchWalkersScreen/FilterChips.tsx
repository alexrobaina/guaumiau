import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Chip} from '@/components';

interface FilterChipsProps {
  filters: string[];
  selectedFilters: string[];
  onToggleFilter: (filter: string) => void;
}

export function FilterChips({filters, selectedFilters, onToggleFilter}: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {filters.map(filter => {
        const isSelected = selectedFilters.includes(filter);
        return (
          <View key={filter} style={styles.chipWrapper}>
            <Chip
              label={filter}
              variant={isSelected ? 'primary' : 'outlined'}
              onPress={() => onToggleFilter(filter)}
            />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  chipWrapper: {
    marginRight: 8,
  },
});
