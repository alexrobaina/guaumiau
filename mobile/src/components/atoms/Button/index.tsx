import React, {memo} from 'react';
import {TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import {styles} from './styles';

interface IButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export const Button = memo<IButtonProps>(
  ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    fullWidth = false,
    testID,
    accessibilityLabel,
  }) => {
    return (
      <TouchableOpacity
        style={[
          styles.base,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        activeOpacity={0.7}>
        {loading ? (
          <ActivityIndicator
            color={
              variant === 'outline' || variant === 'ghost' ? '#007AFF' : '#FFF'
            }
          />
        ) : (
          <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  },
);
