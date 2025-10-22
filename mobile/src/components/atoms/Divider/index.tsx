import React, {memo} from 'react';
import {View} from 'react-native';
import {styles} from './styles';

interface IDividerProps {
  thickness?: number;
  color?: string;
}

export const Divider = memo<IDividerProps>(
  ({thickness = 1, color = '#C7C7CC'}) => {
    return <View style={[styles.divider, {height: thickness, backgroundColor: color}]} />;
  },
);
