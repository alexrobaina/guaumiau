import React, { memo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { AuthLayout } from '@components/templates/AuthLayout';
import { RegisterForm } from '@components/organisms/RegisterForm';
import { useRegister } from '@/hooks/api';
import { ENV } from '@/config/env';
import { IRegisterScreenProps } from './RegisterScreen.types';

export const RegisterScreen = memo<IRegisterScreenProps>(() => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Register'>>();

  const register = useRegister({
    onSuccess: async data => {
      console.log('Registration successful:', data.user);
      // Navigate to email verification screen
      navigation.navigate('VerifyEmail', { email: data.user.email });
    },
    onError: error => {
      console.error('Registration failed:', error);
    },
  });

  const handleRegister = useCallback(
    (
      email: string,
      username: string,
      password: string,
      firstName: string,
      lastName: string,
      userRole: 'PET_OWNER' | 'SERVICE_PROVIDER',
      termsAccepted: boolean,
      address?: string,
      latitude?: number,
      longitude?: number,
      city?: string,
      country?: string,
    ) => {
      register.mutate({
        email,
        username,
        password,
        firstName,
        lastName,
        userRole,
        termsAccepted,
        address,
        latitude,
        longitude,
        city,
        country,
      });
    },
    [register],
  );

  // Extract error message from the response
  const getErrorMessage = () => {
    if (!register.isError) return undefined;

    const responseData = (register.error as any)?.response?.data;
    if (!responseData) return 'Registro fallido. Por favor, intenta de nuevo.';

    const message = (responseData as any)?.message;
    // Handle nested message object (NestJS error format)
    if (message && typeof message === 'object' && message.message) {
      return message.message;
    }

    // Handle string message
    if (typeof message === 'string') {
      return message;
    }

    return 'Registro fallido. Por favor, intenta de nuevo.';
  };

  const errorMessage = getErrorMessage();

  return (
    <AuthLayout title="Crear Cuenta" subtitle="Únete a nuestra comunidad de cuidado de mascotas">
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={register.isPending}
        error={errorMessage}
      />
    </AuthLayout>
  );
});
