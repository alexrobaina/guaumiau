import React, {memo} from 'react';
import {View, TouchableOpacity, Text as RNText} from 'react-native';
import {Text} from '@components/atoms/Text';
import {IRadioGroupProps} from './RadioGroup.types';
import {styles} from './RadioGroup.styles';

export const RadioGroup = memo(
  <T extends string>({
    options,
    value,
    onChange,
    label,
    required = false,
    error,
    disabled = false,
    layout = 'horizontal',
    testID,
  }: IRadioGroupProps<T>) => {
    return (
      <View style={styles.container}>
        {label && (
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{label}</Text>
            {required && <Text style={styles.required}>*</Text>}
          </View>
        )}

        <View
          style={
            layout === 'horizontal'
              ? styles.optionsHorizontal
              : styles.optionsVertical
          }>
          {options.map(option => {
            const isSelected = value === option.value;
            const isDisabled = disabled || option.disabled;

            return (
              <TouchableOpacity
                key={String(option.value)}
                style={[
                  styles.option,
                  layout === 'vertical' && styles.optionVertical,
                  isSelected && styles.optionSelected,
                  isDisabled && styles.optionDisabled,
                ]}
                onPress={() => !isDisabled && onChange(option.value)}
                disabled={isDisabled}
                activeOpacity={0.7}
                testID={testID ? `${testID}-${option.value}` : undefined}>
                {option.icon && (
                  <RNText
                    style={[
                      styles.optionIcon,
                      layout === 'vertical' && styles.optionIconVertical,
                    ]}>
                    {option.icon}
                  </RNText>
                )}
                <Text
                  style={[
                    styles.optionLabel,
                    layout === 'vertical' && styles.optionLabelVertical,
                    isSelected && styles.optionLabelSelected,
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  },
) as <T extends string>(props: IRadioGroupProps<T>) => JSX.Element;
