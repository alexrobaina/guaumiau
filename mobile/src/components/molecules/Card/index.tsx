import React, {memo} from 'react';
import {View, TouchableOpacity, ViewStyle} from 'react-native';
import {styles} from './styles';

interface ICardProps {
  onPress?: () => void;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  borderColor?: string;
  borderWidth?: number;
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export const Card = memo<ICardProps>(
  ({
    onPress,
    padding = 'medium',
    shadow = 'medium',
    border = false,
    borderColor,
    borderWidth = 1,
    children,
    style,
    testID,
    accessibilityLabel,
  }) => {
    const cardStyle = [
      styles.base,
      styles[`padding_${padding}`],
      shadow !== 'none' && styles[`shadow_${shadow}`],
      border && {
        borderWidth,
        borderColor: borderColor || styles.border.borderColor,
      },
      style,
    ];

    if (onPress) {
      return (
        <TouchableOpacity
          style={cardStyle}
          onPress={onPress}
          activeOpacity={0.8}
          testID={testID}
          accessibilityLabel={accessibilityLabel}>
          {children}
        </TouchableOpacity>
      );
    }

    return (
      <View style={cardStyle} testID={testID} accessibilityLabel={accessibilityLabel}>
        {children}
      </View>
    );
  },
);
