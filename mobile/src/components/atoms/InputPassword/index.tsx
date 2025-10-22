import React, {memo, useState, useCallback} from 'react';
import {View, TextInput, TouchableOpacity, TextInputProps} from 'react-native';
import {styles} from './styles';
import {theme} from '@/theme';
import {Icon} from '@/components/atoms/Icon';

interface IInputPasswordProps extends Omit<TextInputProps, 'secureTextEntry'> {
  error?: string;
}

export const InputPassword = memo<IInputPasswordProps>(
  ({error, value, style, ...props}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);
    const togglePasswordVisibility = useCallback(() => {
      setIsPasswordVisible(prev => !prev);
    }, []);

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
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            autoCorrect={false}
            {...props}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconButton}>
            <Icon
              name={isPasswordVisible ? 'EyeOff' : 'Eye'}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);
