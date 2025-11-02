import React, {memo} from 'react';
import {View} from 'react-native';
import {Text} from '@components/atoms/Text';
import {GooglePlacesInput} from '@components/atoms/GooglePlacesInput';
import {IGooglePlacesFormFieldProps} from './GooglePlacesFormField.types';
import {styles} from './GooglePlacesFormField.styles';

export const GooglePlacesFormField = memo<IGooglePlacesFormFieldProps>(
  ({
    label,
    placeholder,
    value,
    error,
    onPlaceSelected,
    onChangeText,
    disabled = false,
    required = false,
  }) => {
    return (
      <View style={styles.container}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
        <GooglePlacesInput
          placeholder={placeholder}
          value={value}
          error={error}
          onPlaceSelected={onPlaceSelected}
          onChangeText={onChangeText}
          disabled={disabled}
          required={required}
        />
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    );
  },
);
