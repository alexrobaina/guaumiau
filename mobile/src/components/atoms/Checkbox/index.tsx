import React, {memo} from 'react';
import {TouchableOpacity, View, Text as RNText} from 'react-native';
import {Text} from '../Text';
import {styles} from './styles';

export interface ICheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  labelComponent?: React.ReactNode;
  disabled?: boolean;
  error?: string;
  testID?: string;
}

export const Checkbox = memo<ICheckboxProps>(
  ({
    checked,
    onToggle,
    label,
    labelComponent,
    disabled = false,
    error,
    testID,
  }) => {
    return (
      <>
        <TouchableOpacity
          style={styles.container}
          onPress={onToggle}
          disabled={disabled}
          activeOpacity={0.7}
          testID={testID}>
          <View
            style={[
              styles.checkbox,
              checked && styles.checkboxChecked,
              disabled && styles.checkboxDisabled,
            ]}>
            {checked && (
              <RNText style={styles.checkmark}>✓</RNText>
            )}
          </View>
          {labelComponent ? (
            labelComponent
          ) : label ? (
            <Text style={[styles.label, disabled && styles.labelDisabled]}>
              {label}
            </Text>
          ) : null}
        </TouchableOpacity>
        {error && <Text style={styles.error}>{error}</Text>}
      </>
    );
  },
);
