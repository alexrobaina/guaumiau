import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/lib/colors';

import { AnimatedInputProps } from './AnimatedInput.types';
import { makeStyles, getLabelStyle, getContainerBorderColor } from './AnimatedInput.styles';

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  value,
  onFocus,
  onBlur,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const animatedLabelPosition = useRef(new Animated.Value(value ? 1 : 0)).current;
  const animatedBorderColor = useRef(new Animated.Value(0)).current;
  const styles = makeStyles();

  const handleFocus = (e: any) => {
    setIsFocused(true);
    animateLabel(1);
    animateBorder(1);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!value) {
      animateLabel(0);
    }
    animateBorder(0);
    onBlur?.(e);
  };

  const animateLabel = (toValue: number) => {
    Animated.timing(animatedLabelPosition, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const animateBorder = (toValue: number) => {
    Animated.timing(animatedBorderColor, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  React.useEffect(() => {
    if (value) {
      animateLabel(1);
    }
  }, [value]);

  const labelStyle = getLabelStyle(
    animatedLabelPosition,
    !!leftIcon,
    !!error,
    isFocused
  );

  const containerBorderColor = getContainerBorderColor(
    animatedBorderColor,
    !!error
  );

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: containerBorderColor,
            borderWidth: isFocused ? 2 : 1,
          },
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons
              name={leftIcon}
              size={20}
              color={isFocused ? Colors.primary[500] : Colors.gray[400]}
            />
          </View>
        )}

        <Animated.Text style={labelStyle}>{label}</Animated.Text>

        <TextInput
          {...props}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isSecure}
          style={[
            styles.input,
            {
              paddingLeft: leftIcon ? 48 : 16,
              paddingRight: rightIcon || secureTextEntry ? 48 : 16,
            },
          ]}
          placeholderTextColor={Colors.gray[400]}
        />

        {(rightIcon || secureTextEntry) && (
          <Pressable
            style={styles.rightIconContainer}
            onPress={secureTextEntry ? toggleSecureEntry : onRightIconPress}
          >
            <Ionicons
              name={
                secureTextEntry
                  ? isSecure
                    ? 'eye-off'
                    : 'eye'
                  : rightIcon || 'help-circle'
              }
              size={20}
              color={Colors.gray[400]}
            />
          </Pressable>
        )}
      </Animated.View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {!error && helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};