import React, {memo, useState, useCallback} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FormField} from '@components/molecules/FormField';
import {Button} from '@components/atoms/Button';
import {Text} from '@components/atoms/Text';
import {ILoginFormProps, ILoginFormState} from './LoginForm.types';
import {styles} from './LoginForm.styles';

const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'El email es requerido';
  if (!emailRegex.test(email)) return 'Formato de email inválido';
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return 'La contraseña es requerida';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  return undefined;
};

export const LoginForm = memo<ILoginFormProps>(
  ({onSubmit, isLoading = false, error}) => {
    const navigation = useNavigation();
    const [formState, setFormState] = useState<ILoginFormState>({
      email: '',
      password: '',
      errors: {},
    });

    const handleEmailChange = useCallback((email: string) => {
      setFormState(prev => ({
        ...prev,
        email,
        errors: {...prev.errors, email: undefined},
      }));
    }, []);

    const handlePasswordChange = useCallback((password: string) => {
      setFormState(prev => ({
        ...prev,
        password,
        errors: {...prev.errors, password: undefined},
      }));
    }, []);

    const handleSubmit = useCallback(() => {
      const emailError = validateEmail(formState.email);
      const passwordError = validatePassword(formState.password);

      if (emailError || passwordError) {
        setFormState(prev => ({
          ...prev,
          errors: {
            email: emailError,
            password: passwordError,
          },
        }));
        return;
      }

      onSubmit(formState.email, formState.password);
    }, [formState.email, formState.password, onSubmit]);

    const handleForgotPassword = useCallback(() => {
      navigation.navigate('ForgotPassword' as never);
    }, [navigation]);

    const handleNavigateToRegister = useCallback(() => {
      navigation.navigate('Register' as never);
    }, [navigation]);

    return (
      <View style={styles.container}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

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

        <FormField
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          value={formState.password}
          onChangeText={handlePasswordChange}
          error={formState.errors.password}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          required
        />

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <Button
          title="Iniciar Sesión"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          fullWidth
        />

        <TouchableOpacity
          style={styles.registerLink}
          onPress={handleNavigateToRegister}>
          <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
          <Text style={styles.registerLinkText}>Regístrate</Text>
        </TouchableOpacity>
      </View>
    );
  },
);
