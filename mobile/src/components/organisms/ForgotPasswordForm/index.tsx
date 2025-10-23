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
  if (!email) return 'El email es requerido';
  if (!emailRegex.test(email)) return 'Formato de email inválido';
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
            Ingresa tu dirección de email y te enviaremos las instrucciones para
            restablecer tu contraseña.
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
              Las instrucciones para restablecer tu contraseña han sido enviadas
              a tu email. Por favor, revisa tu bandeja de entrada.
            </Text>
          </View>
        )}

        {!success && (
          <>
            <FormField
              label="Email"
              placeholder="Ingresa tu email"
              value={formState.email}
              onChangeText={handleEmailChange}
              error={formState.errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              required
            />

            <Button
              title="Enviar Instrucciones"
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
