import React from 'react';
import { View, Text } from 'react-native';
import { Input } from '@/components/atoms/Input';

import { FormFieldProps } from './FormField.types';
import { makeStyles } from './FormField.styles';

export const FormField: React.FC<FormFieldProps> = ({
  label,
  helperText,
  error,
  ...inputProps
}) => {
  const styles = makeStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Input
        {...inputProps}
        error={!!error}
        style={styles.input}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};