import React, {memo, useCallback} from 'react';
import {AuthLayout} from '@components/templates/AuthLayout';
import {LoginForm} from '@components/organisms/LoginForm';
import {useLogin} from '@/hooks/api';
import {useAuth} from '@/contexts/AuthContext';
import {ILoginScreenProps} from './LoginScreen.types';

export const LoginScreen = memo<ILoginScreenProps>(() => {
  const {login: authLogin} = useAuth();

  const login = useLogin({
    onSuccess: async data => {
      console.log('Login successful:', data.user);
      // Save user, accessToken, and refreshToken to context and storage
      await authLogin(data.user, data.accessToken, data.refreshToken);
    },
    onError: error => {
      console.error('Login failed:', error);
    },
  });

  const handleLogin = useCallback(
    (email: string, password: string) => {
      login.mutate({email, password});
    },
    [login],
  );

  const errorMessage = login.error?.response?.data?.message ||
    (login.isError ? 'Invalid email or password. Please try again.' : undefined);

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue climbing">
      <LoginForm
        onSubmit={handleLogin}
        isLoading={login.isPending}
        error={errorMessage}
      />
    </AuthLayout>
  );
});
