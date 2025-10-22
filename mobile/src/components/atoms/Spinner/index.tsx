import React, {memo} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {styles} from './styles';
import {theme} from '@/theme';

interface ISpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  testID?: string;
}

const sizeMap = {
  small: 'small' as const,
  medium: 'large' as const,
  large: 'large' as const,
};

export const Spinner = memo<ISpinnerProps>(
  ({size = 'medium', color = theme.colors.primary, testID}) => {
    return (
      <View style={[styles.container, styles[size]]} testID={testID}>
        <ActivityIndicator size={sizeMap[size]} color={color} />
      </View>
    );
  },
);
