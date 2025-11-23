import { memo, useRef, useState } from 'react';
import { View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import type { IInputPhoneProps } from './InputPhone.types';
import { styles } from './styles';
import { theme } from '@/theme';

export type { IInputPhoneProps };

export const InputPhone = memo<IInputPhoneProps>(
  ({ value, onChangeText, onChangeFormattedText, error, placeholder = 'Phone number', editable = true, disabled = false }) => {
    const phoneInput = useRef<PhoneInput>(null);
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={styles.container}>
        <PhoneInput
          ref={phoneInput}
          value={value}
          defaultCode="US"
          layout="first"
          onChangeFormattedText={(text) => {
            // Save the formatted phone number as text
            if (onChangeFormattedText) {
              onChangeFormattedText(text);
            }
            if (onChangeText) {
              onChangeText(text);
            }
          }}
          placeholder={placeholder}
          disabled={disabled || !editable}
          withDarkTheme={false}
          withShadow={false}
          autoFocus={false}
          countryPickerProps={{
            renderFlagButton: undefined,
          }}
          containerStyle={[
            styles.phoneContainer,
            isFocused && styles.phoneContainerFocused,
            error && styles.phoneContainerError,
            (disabled || !editable) && styles.phoneContainerDisabled,
          ]}
          textContainerStyle={styles.textContainer}
          textInputStyle={styles.textInput}
          codeTextStyle={styles.codeText}
          flagButtonStyle={styles.flagButton}
          textInputProps={{
            onFocus: () => setIsFocused(true),
            onBlur: () => setIsFocused(false),
            placeholderTextColor: theme.colors.textSecondary,
            keyboardType: 'phone-pad',
          }}
        />
      </View>
    );
  },
);

InputPhone.displayName = 'InputPhone';
