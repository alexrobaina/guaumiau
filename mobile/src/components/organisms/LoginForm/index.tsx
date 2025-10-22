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
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
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
          placeholder="Enter your email"
          value={formState.email}
          onChangeText={handleEmailChange}
          error={formState.errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          required
        />

        <FormField
          label="Password"
          placeholder="Enter your password"
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
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          title="Sign In"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          fullWidth
        />

        <TouchableOpacity
          style={styles.registerLink}
          onPress={handleNavigateToRegister}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <Text style={styles.registerLinkText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  },
);
