import React, {memo} from 'react';
import {View} from 'react-native';
import {theme} from '@/theme';

interface ISpacerProps {
  size?: keyof typeof theme.spacing;
  horizontal?: boolean;
}

export const Spacer = memo<ISpacerProps>(
  ({size = 'md', horizontal = false}) => {
    const spacing = theme.spacing[size];

    return (
      <View
        style={{
          width: horizontal ? spacing : 0,
          height: horizontal ? 0 : spacing,
        }}
      />
    );
  },
);
