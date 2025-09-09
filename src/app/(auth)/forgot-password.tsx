import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Formik } from 'formik';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/atoms/Button';
import { AnimatedInput } from '@/components/atoms/AnimatedInput';
import { useStore } from '@/store';
import { Colors } from '@/lib/colors';
import {
  forgotPasswordSchema,
  forgotPasswordInitialValues,
  ForgotPasswordFormValues,
} from '@/lib/validation/auth.schemas';

export default function ForgotPasswordScreen() {
  const { resetPassword, isLoading, error, clearError } = useStore();
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (values: ForgotPasswordFormValues) => {
    try {
      clearError();
      await resetPassword(values.email);
      setEmailSent(true);
      
      Alert.alert(
        'Reset Email Sent',
        `We've sent a password reset link to ${values.email}. Please check your email and follow the instructions to reset your password.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Password reset error:', error);
    }
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Reset Password Error', error);
    }
  }, [error]);

  if (emailSent) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.container}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✉️</Text>
            </View>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successMessage}>
              We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
            </Text>
            <Button
              onPress={() => router.back()}
              variant="primary"
              size="lg"
              fullWidth
              style={styles.backButton}
            >
              Back to Login
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </Text>
          </View>

          <Formik
            initialValues={forgotPasswordInitialValues}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleResetPassword}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
              dirty,
            }) => (
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <AnimatedInput
                    label="Email Address"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    error={touched.email && errors.email ? errors.email : undefined}
                    leftIcon="mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    autoFocus
                  />
                </View>

                <Button
                  onPress={() => handleSubmit()}
                  loading={isLoading}
                  disabled={!isValid || !dirty}
                  variant="primary"
                  size="lg"
                  fullWidth
                  style={styles.resetButton}
                >
                  Send Reset Link
                </Button>

                <View style={styles.helpContainer}>
                  <Text style={styles.helpText}>
                    Remember your password?{' '}
                    <Link href="/(auth)/login">
                      <Text style={styles.helpLink}>Back to Login</Text>
                    </Link>
                  </Text>
                </View>
              </View>
            )}
          </Formik>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Link href="/(auth)/register">
                <Text style={styles.footerLink}>Sign Up</Text>
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 32,
  },
  resetButton: {
    marginBottom: 24,
  },
  helpContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  helpText: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: 'center',
  },
  helpLink: {
    color: Colors.primary[500],
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: 'center',
  },
  footerLink: {
    color: Colors.primary[500],
    fontWeight: '600',
  },
  // Success state styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 32,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  backButton: {
    maxWidth: 300,
    width: '100%',
  },
});