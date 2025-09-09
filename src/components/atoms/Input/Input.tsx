import React from 'react';
import { TextInput } from 'react-native';

import { InputProps } from './Input.types';
import { makeStyles, getPlaceholderTextColor } from './Input.styles';

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  size = 'md',
  error,
  style,
  ...props
}) => {
  const styles = makeStyles();
  const variantToUse = error ? 'error' : variant;

  const inputStyle = [styles.base, styles[variantToUse], styles[size], style];

  return (
    <TextInput
      style={inputStyle}
      placeholderTextColor={getPlaceholderTextColor(error)}
      {...props}
    />
  );
};