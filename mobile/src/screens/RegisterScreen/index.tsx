import React, {memo, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {AuthLayout} from '@components/templates/AuthLayout';
import {RegisterForm} from '@components/organisms/RegisterForm';
import {useRegister} from '@/hooks/api';
import {IRegisterScreenProps} from './RegisterScreen.types';

export const RegisterScreen = memo<IRegisterScreenProps>(() => {
  const navigation = useNavigation();

  const register = useRegister({
    onSuccess: async data => {
      console.log('Registration successful:', data.user);
      // Navigate to email verification screen
      navigation.navigate('VerifyEmail' as never, {email: data.user.email} as never);
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
    ) => {
      register.mutate({
        email,
        username,
        password,
        firstName,
        lastName,
        userRole,
        termsAccepted,
      });
    },
    [register],
  );

  // Extract error message from the response
  const getErrorMessage = () => {
    if (!register.isError) return undefined;

    const responseData = register.error?.response?.data;
    if (!responseData) return 'Registro fallido. Por favor, intenta de nuevo.';

    // Handle nested message object (NestJS error format)
    if (typeof responseData.message === 'object' && responseData.message?.message) {
      return responseData.message.message;
    }

    // Handle string message
    if (typeof responseData.message === 'string') {
      return responseData.message;
    }

    return 'Registro fallido. Por favor, intenta de nuevo.';
  };

  const errorMessage = getErrorMessage();

  return (
    <AuthLayout
      title="Crear Cuenta"
      subtitle="Únete a nuestra comunidad de cuidado de mascotas">
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={register.isPending}
        error={errorMessage}
      />
    </AuthLayout>
  );
});
