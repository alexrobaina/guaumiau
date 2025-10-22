import React, {memo} from 'react';
import {View, Text} from 'react-native';
import {styles} from './styles';

interface IBadgeProps {
  count?: number;
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  showZero?: boolean;
  maxCount?: number;
  testID?: string;
}

export const Badge = memo<IBadgeProps>(
  ({count, color = 'error', showZero = false, maxCount = 99, testID}) => {
    if (!showZero && (!count || count === 0)) {
      return null;
    }

    const displayCount = count && count > maxCount ? `${maxCount}+` : count;

    return (
      <View style={[styles.container, styles[color]]} testID={testID}>
        {count !== undefined && (
          <Text style={styles.text}>{displayCount}</Text>
        )}
      </View>
    );
  },
);
