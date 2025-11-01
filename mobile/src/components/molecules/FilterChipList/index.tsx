import React, {memo} from 'react';
import {ScrollView} from 'react-native';
import {Chip} from '@components/molecules/Chip';
import {styles} from './styles';

interface IFilterChipListProps {
  filters: string[];
  activeFilter: string;
  onFilterPress: (filter: string) => void;
  testID?: string;
}

export const FilterChipList = memo<IFilterChipListProps>(
  ({filters, activeFilter, onFilterPress, testID}) => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        testID={testID}>
        {filters.map(filter => (
          <Chip
            key={filter}
            label={filter}
            onPress={() => onFilterPress(filter)}
            variant={activeFilter === filter ? 'primary' : 'outlined'}
          />
        ))}
      </ScrollView>
    );
  },
);
