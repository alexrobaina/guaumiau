import React, {memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './styles';

interface IChipProps {
  label: string;
  onPress?: () => void;
  onClose?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'outlined';
  leftIcon?: React.ReactNode;
  testID?: string;
}

export const Chip = memo<IChipProps>(
  ({
    label,
    onPress,
    onClose,
    variant = 'default',
    leftIcon,
    testID,
  }) => {
    const Container = onPress ? TouchableOpacity : View;

    return (
      <Container
        style={[styles.container, styles[variant]]}
        onPress={onPress}
        activeOpacity={0.7}
        testID={testID}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <View style={styles.closeIcon} />
          </TouchableOpacity>
        )}
      </Container>
    );
  },
);
