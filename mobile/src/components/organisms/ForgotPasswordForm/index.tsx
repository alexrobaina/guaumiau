import React, {memo, useState, useCallback} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {FormField} from '@components/molecules/FormField';
import {Button} from '@components/atoms/Button';
import {Text} from '@components/atoms/Text';
import {
  IForgotPasswordFormProps,
  IForgotPasswordFormState,
} from './ForgotPasswordForm.types';
import {styles} from './ForgotPasswordForm.styles';

const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return undefined;
};

export const ForgotPasswordForm = memo<IForgotPasswordFormProps>(
  ({onSubmit, isLoading = false, error, success = false}) => {
    const [formState, setFormState] = useState<IForgotPasswordFormState>({
      email: '',
      errors: {},
    });

    const handleEmailChange = useCallback((email: string) => {
      setFormState(prev => ({
        ...prev,
        email,
        errors: {...prev.errors, email: undefined},
      }));
    }, []);

    const handleSubmit = useCallback(() => {
      const emailError = validateEmail(formState.email);

      if (emailError) {
        setFormState(prev => ({
          ...prev,
          errors: {
            email: emailError,
          },
        }));
        return;
      }

      onSubmit(formState.email);
    }, [formState.email, onSubmit]);

    return (
      <View style={styles.container}>
        {!success && (
          <Text style={styles.description}>
            Enter your email address and we'll send you instructions to reset
            your password.
          </Text>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Password reset instructions have been sent to your email address.
              Please check your inbox.
            </Text>
          </View>
        )}

        {!success && (
          <>
            <FormField
              label="Email"
              placeholder="Enter your email"
              value={formState.email}
              onChangeText={handleEmailChange}
              error={formState.errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              required
            />

            <Button
              title="Send Reset Instructions"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              fullWidth
            />
          </>
        )}
      </View>
    );
  },
);
