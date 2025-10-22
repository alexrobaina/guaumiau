import React, {memo} from 'react';
import {TouchableOpacity, ActivityIndicator} from 'react-native';
import {styles} from './styles';

interface IIconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  circular?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export const IconButton = memo<IIconButtonProps>(
  ({
    icon,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    circular = true,
    testID,
    accessibilityLabel,
  }) => {
    return (
      <TouchableOpacity
        style={[
          styles.base,
          styles[variant],
          styles[size],
          circular && styles.circular,
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
          icon
        )}
      </TouchableOpacity>
    );
  },
);
