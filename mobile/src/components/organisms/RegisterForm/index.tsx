import React, {memo, useState, useCallback} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FormField} from '@components/molecules/FormField';
import {Button} from '@components/atoms/Button';
import {Text} from '@components/atoms/Text';
import {IRegisterFormProps, IRegisterFormState} from './RegisterForm.types';
import {styles} from './RegisterForm.styles';

const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return undefined;
};

const validateUsername = (username: string): string | undefined => {
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 20) return 'Username must be less than 20 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return 'Username can only contain letters, numbers, and underscores';
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return undefined;
};

const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | undefined => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return undefined;
};

export const RegisterForm = memo<IRegisterFormProps>(
  ({onSubmit, isLoading = false, error}) => {
    const navigation = useNavigation();
    const [formState, setFormState] = useState<IRegisterFormState>({
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      errors: {},
    });

    const handleEmailChange = useCallback((email: string) => {
      setFormState(prev => ({
        ...prev,
        email,
        errors: {...prev.errors, email: undefined},
      }));
    }, []);

    const handleUsernameChange = useCallback((username: string) => {
      setFormState(prev => ({
        ...prev,
        username,
        errors: {...prev.errors, username: undefined},
      }));
    }, []);

    const handlePasswordChange = useCallback((password: string) => {
      setFormState(prev => ({
        ...prev,
        password,
        errors: {...prev.errors, password: undefined},
      }));
    }, []);

    const handleConfirmPasswordChange = useCallback(
      (confirmPassword: string) => {
        setFormState(prev => ({
          ...prev,
          confirmPassword,
          errors: {...prev.errors, confirmPassword: undefined},
        }));
      },
      [],
    );

    const handleSubmit = useCallback(() => {
      const emailError = validateEmail(formState.email);
      const usernameError = validateUsername(formState.username);
      const passwordError = validatePassword(formState.password);
      const confirmPasswordError = validateConfirmPassword(
        formState.password,
        formState.confirmPassword,
      );

      if (emailError || usernameError || passwordError || confirmPasswordError) {
        setFormState(prev => ({
          ...prev,
          errors: {
            email: emailError,
            username: usernameError,
            password: passwordError,
            confirmPassword: confirmPasswordError,
          },
        }));
        return;
      }

      onSubmit(formState.email, formState.username, formState.password);
    }, [
      formState.email,
      formState.username,
      formState.password,
      formState.confirmPassword,
      onSubmit,
    ]);

    const handleNavigateToLogin = useCallback(() => {
      navigation.goBack();
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
          label="Username"
          placeholder="Choose a username"
          value={formState.username}
          onChangeText={handleUsernameChange}
          error={formState.errors.username}
          autoCapitalize="none"
          autoComplete="username"
          required
        />

        <FormField
          label="Password"
          placeholder="Create a password"
          value={formState.password}
          onChangeText={handlePasswordChange}
          error={formState.errors.password}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          required
        />

        <FormField
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formState.confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          error={formState.errors.confirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          required
        />

        <Button
          title="Create Account"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          fullWidth
        />

        <TouchableOpacity
          style={styles.loginLink}
          onPress={handleNavigateToLogin}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <Text style={styles.loginLinkText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  },
);
