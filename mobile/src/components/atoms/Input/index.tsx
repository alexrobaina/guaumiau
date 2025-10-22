import React, {memo, useState} from 'react';
import {View, TextInput, TouchableOpacity, TextInputProps} from 'react-native';
import {styles} from './styles';
import {theme} from '@/theme';

interface IInputProps extends TextInputProps {
  error?: string;
  showClearButton?: boolean;
  onClear?: () => void;
}

export const Input = memo<IInputProps>(
  ({
    error,
    showClearButton = false,
    onClear,
    value,
    style,
    ...props
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.inputContainer,
            isFocused && styles.focused,
            error && styles.error,
            props.editable === false && styles.disabled,
          ]}>
          <TextInput
            style={[styles.input, style]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            placeholderTextColor={theme.colors.textSecondary}
            {...props}
          />
          {showClearButton && value && (
            <TouchableOpacity onPress={onClear} style={styles.clearButton}>
              <View style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);
