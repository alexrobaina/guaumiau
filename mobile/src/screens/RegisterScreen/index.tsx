import React, {memo, useCallback} from 'react';
import {AuthLayout} from '@components/templates/AuthLayout';
import {RegisterForm} from '@components/organisms/RegisterForm';
import {useRegister} from '@/hooks/api';
import {useAuth} from '@/contexts/AuthContext';
import {IRegisterScreenProps} from './RegisterScreen.types';

export const RegisterScreen = memo<IRegisterScreenProps>(() => {
  const {login: authLogin} = useAuth();

  const register = useRegister({
    onSuccess: async data => {
      console.log('Registration successful:', data.user);
      // Save user, accessToken, and refreshToken to context and storage
      await authLogin(data.user, data.accessToken, data.refreshToken);
    },
    onError: error => {
      console.error('Registration failed:', error);
    },
  });

  const handleRegister = useCallback(
    (email: string, username: string, password: string) => {
      register.mutate({email, username, password});
    },
    [register],
  );

  const errorMessage =
    register.error?.response?.data?.message ||
    (register.isError
      ? 'Registration failed. Please try again.'
      : undefined);

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the climbing community">
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={register.isPending}
        error={errorMessage}
      />
    </AuthLayout>
  );
});
