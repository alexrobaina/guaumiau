import React, {memo} from 'react';
import {View} from 'react-native';
import {Input} from '@components/atoms/Input';
import {InputPassword} from '@components/atoms/InputPassword';
import {Text} from '@components/atoms/Text';
import {IFormFieldProps} from './FormField.types';
import {styles} from './FormField.styles';

export const FormField = memo<IFormFieldProps>(
  ({label, error, required = false, secureTextEntry, ...inputProps}) => {
    const InputComponent = secureTextEntry ? InputPassword : Input;

    return (
      <View style={styles.container}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
        <InputComponent error={error} {...inputProps} />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  },
);
