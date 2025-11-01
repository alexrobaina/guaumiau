import React, {memo} from 'react';
import {TouchableOpacity, Text, ActivityIndicator, ViewStyle, StyleProp} from 'react-native';
import {styles} from './styles';

interface IButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  isLoading?: boolean; // Alias for loading
  fullWidth?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const Button = memo<IButtonProps>(
  ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    isLoading = false,
    fullWidth = false,
    testID,
    accessibilityLabel,
    style,
    children,
  }) => {
    const isButtonLoading = loading || isLoading;

    return (
      <TouchableOpacity
        style={[
          styles.base,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || isButtonLoading}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        activeOpacity={0.7}>
        {isButtonLoading ? (
          <ActivityIndicator
            color={
              variant === 'outline' || variant === 'ghost' ? '#007AFF' : '#FFF'
            }
          />
        ) : children ? (
          <Text style={[styles.text, styles[`${variant}Text`]]}>{children}</Text>
        ) : (
          <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  },
);
