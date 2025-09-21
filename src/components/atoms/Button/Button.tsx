import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { Colors } from '@/lib/colors';

import { ButtonProps } from './Button.types';
import { makeStyles, getButtonStyle, getTextStyle } from './Button.styles';

export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  variant = 'primary',
  size = 'md',
  buttonStyle = 'solid',
  disabled = false,
  fullWidth = false,
  style,
  ...props
}) => {
  const styles = makeStyles();

  const buttonStyleComputed = getButtonStyle(
    styles,
    variant,
    size,
    buttonStyle,
    fullWidth,
    disabled
  );

  const textStyleComputed = getTextStyle(styles, variant, size);

  return (
    <Pressable
      disabled={disabled || loading}
      style={[buttonStyleComputed, style] as any}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'tertiary' ? Colors.black : Colors.white}
        />
      ) : (
        <Text style={textStyleComputed}>{children}</Text>
      )}
    </Pressable>
  );
};