import React, {memo, useCallback} from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthLayout} from '@components/templates/AuthLayout';
import {ForgotPasswordForm} from '@components/organisms/ForgotPasswordForm';
import {Text} from '@components/atoms/Text';
import {useForgotPassword} from '@/hooks/api';
import {IForgotPasswordScreenProps} from './ForgotPasswordScreen.types';
import {StyleSheet} from 'react-native';

export const ForgotPasswordScreen = memo<IForgotPasswordScreenProps>(() => {
  const navigation = useNavigation();

  const forgotPassword = useForgotPassword({
    onSuccess: data => {
      console.log('Password reset email sent:', data.message);
    },
    onError: error => {
      console.error('Forgot password failed:', error.response?.data?.message);
    },
  });

  const handleForgotPassword = useCallback(
    (email: string) => {
      forgotPassword.mutate({email});
    },
    [forgotPassword],
  );

  const handleBackToLogin = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const errorMessage = forgotPassword.error?.response?.data?.message ||
    (forgotPassword.isError
      ? 'Unable to send reset instructions. Please check your email and try again.'
      : undefined);

  return (
    <AuthLayout title="Reset Password" subtitle="Recover your account access">
      <ForgotPasswordForm
        onSubmit={handleForgotPassword}
        isLoading={forgotPassword.isPending}
        error={errorMessage}
        success={forgotPassword.isSuccess}
      />
      <TouchableOpacity style={styles.backToLogin} onPress={handleBackToLogin}>
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>
    </AuthLayout>
  );
});

const styles = StyleSheet.create({
  backToLogin: {
    marginTop: 16,
    alignItems: 'center',
  },
  backToLoginText: {
    color: '#6B7280',
    fontSize: 14,
  },
});
