import React, { memo, useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Linking, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AuthLayout } from '@components/templates/AuthLayout';
import { Text } from '@components/atoms/Text';
import { Button } from '@components/atoms/Button';
import { useVerifyEmail, useResendVerification } from '@/hooks/api';
import { IVerifyEmailScreenProps } from './VerifyEmailScreen.types';
import { Mail, CheckCircle, XCircle } from 'lucide-react-native';

type VerifyEmailRouteParams = {
  token?: string;
  email?: string;
};

export const VerifyEmailScreen = memo<IVerifyEmailScreenProps>(() => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: VerifyEmailRouteParams }, 'params'>>();
  const { token, email } = route.params || {};

  const [verificationStatus, setVerificationStatus] = useState<
    'idle' | 'verifying' | 'success' | 'error'
  >('idle');

  const verifyEmail = useVerifyEmail({
    onSuccess: data => {
      setVerificationStatus('success');
      setTimeout(() => {
        navigation.navigate('Login' as never);
      }, 2000);
    },
    onError: error => {
      console.error('Email verification failed:', error.response?.data?.message);
      setVerificationStatus('error');
    },
  });

  const resendVerification = useResendVerification({
    onSuccess: data => {
      Alert.alert('Éxito', 'Se ha enviado un nuevo correo de verificación');
    },
    onError: error => {
      Alert.alert('Error', error.response?.data?.message || 'No se pudo enviar el correo');
    },
  });

  useEffect(() => {
    if (token) {
      setVerificationStatus('verifying');
      verifyEmail.mutate({ token });
    }
  }, [token]);

  const handleResendVerification = useCallback(() => {
    if (email) {
      resendVerification.mutate({ email });
    } else {
      Alert.alert('Error', 'No se pudo obtener el email');
    }
  }, [email, resendVerification]);

  const handleGoToLogin = useCallback(() => {
    navigation.navigate('Login' as never);
  }, [navigation]);

  const handleOpenEmailApp = useCallback(async () => {
    try {
      // Try to open email app with different schemes
      const emailSchemes = Platform.select({
        ios: ['message://', 'mailto:'],
        android: ['mailto:'],
        default: ['mailto:'],
      });

      for (const scheme of emailSchemes) {
        const canOpen = await Linking.canOpenURL(scheme);
        if (canOpen) {
          await Linking.openURL(scheme);
          return;
        }
      }

      // If no email app found, show alert
      Alert.alert(
        'No se encontró aplicación de correo',
        'Por favor, abre tu aplicación de correo manualmente para verificar tu email.',
      );
    } catch (error) {
      console.error('Error opening email app:', error);
      Alert.alert('Error', 'No se pudo abrir la aplicación de correo');
    }
  }, []);

  const renderContent = () => {
    if (verificationStatus === 'verifying') {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.statusText}>Verificando tu correo electrónico...</Text>
        </View>
      );
    }

    if (verificationStatus === 'success') {
      return (
        <View style={styles.centerContent}>
          <CheckCircle size={64} color="#10B981" />
          <Text style={styles.successTitle}>¡Verificación Exitosa!</Text>
          <Text style={styles.successMessage}>
            Tu correo electrónico ha sido verificado correctamente.
          </Text>
          <Text style={styles.successMessage}>Redirigiendo al inicio de sesión...</Text>
        </View>
      );
    }

    if (verificationStatus === 'error') {
      return (
        <View style={styles.centerContent}>
          <XCircle size={64} color="#EF4444" />
          <Text style={styles.errorTitle}>Verificación Fallida</Text>
          <Text style={styles.errorMessage}>
            El enlace de verificación es inválido o ha expirado.
          </Text>
          {email && (
            <Button
              onPress={handleResendVerification}
              isLoading={resendVerification.isPending}
              style={styles.resendButton}
            >
              Reenviar Correo de Verificación
            </Button>
          )}
          <Button onPress={handleGoToLogin} variant="outline" style={styles.loginButton}>
            Ir al Inicio de Sesión
          </Button>
        </View>
      );
    }

    // Idle state - no token provided
    return (
      <View style={styles.centerContent}>
        <Mail size={64} color="#6B7280" />
        <Text style={styles.title}>Verificación de Correo Electrónico</Text>
        <Text style={styles.message}>
          Por favor, revisa tu correo electrónico y haz click en el enlace de verificación que te
          hemos enviado.
        </Text>
        {email && (
          <>
            <Text style={styles.emailText}>Correo enviado a: {email}</Text>
            <Button
              onPress={handleOpenEmailApp}
              style={styles.openEmailButton}
            >
              ✓ Verificar mi correo electrónico
            </Button>
            <Button
              onPress={handleResendVerification}
              isLoading={resendVerification.isPending}
              variant="outline"
              style={styles.resendButton}
            >
              Reenviar Correo
            </Button>
          </>
        )}
        <Button onPress={handleGoToLogin} variant="outline" style={styles.loginButton}>
          Volver al Inicio de Sesión
        </Button>
      </View>
    );
  };

  return (
    <AuthLayout title="Verificación de Email" subtitle="Confirma tu dirección de correo">
      {renderContent()}
    </AuthLayout>
  );
});

const styles = StyleSheet.create({
  centerContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  statusText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  successTitle: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    textAlign: 'center',
  },
  successMessage: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  title: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  emailText: {
    marginTop: 16,
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
  openEmailButton: {
    marginTop: 24,
    width: '100%',
  },
  resendButton: {
    marginTop: 16,
    width: '100%',
  },
  loginButton: {
    marginTop: 16,
    width: '100%',
  },
});
