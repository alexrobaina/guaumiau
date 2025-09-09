import React from 'react';
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
  registerSchema,
  registerInitialValues,
  RegisterFormValues,
} from '@/lib/validation/auth.schemas';

export default function RegisterScreen() {
  const { register, loginWithGoogle, isLoading, error, clearError } = useStore();

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      clearError();
      await register(values.email, values.password, values.name);
      
      Alert.alert(
        'Registration Successful',
        'Please check your email to verify your account before signing in.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      clearError();
      
      // Import AuthService dynamically to avoid circular dependencies
      const { AuthService } = await import('@/lib/firebase/auth');
      const user = await AuthService.signInWithGoogle();
      
      Alert.alert(
        'Welcome! 🎉',
        `Account created successfully for ${user.displayName || user.email}!`,
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      console.error('Google sign-up error:', error);
      Alert.alert(
        'Google Sign-Up Failed', 
        error instanceof Error ? error.message : 'Please try again.'
      );
    }
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
    }
  }, [error]);

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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join CruxClimb to track your climbing progress
            </Text>
          </View>

          <Formik
            initialValues={registerInitialValues}
            validationSchema={registerSchema}
            onSubmit={handleRegister}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
              isValid,
              dirty,
            }) => (
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <AnimatedInput
                    label="Full Name"
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    error={touched.name && errors.name ? errors.name : undefined}
                    leftIcon="person"
                    autoCapitalize="words"
                    textContentType="name"
                  />
                </View>

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
                  />
                </View>

                <View style={styles.inputContainer}>
                  <AnimatedInput
                    label="Password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    error={touched.password && errors.password ? errors.password : undefined}
                    leftIcon="lock-closed"
                    secureTextEntry
                    textContentType="newPassword"
                    helperText="Must be 8+ characters with uppercase, lowercase, and number"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <AnimatedInput
                    label="Confirm Password"
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                    leftIcon="lock-closed"
                    secureTextEntry
                    textContentType="newPassword"
                  />
                </View>

                <View style={styles.checkboxContainer}>
                  <Button
                    onPress={() => setFieldValue('acceptTerms', !values.acceptTerms)}
                    variant="ghost"
                    size="sm"
                    style={styles.checkbox}
                  >
                    <View style={[
                      styles.checkboxBox,
                      values.acceptTerms && styles.checkboxBoxChecked
                    ]}>
                      {values.acceptTerms && (
                        <Text style={styles.checkboxCheck}>✓</Text>
                      )}
                    </View>
                  </Button>
                  <View style={styles.checkboxTextContainer}>
                    <Text style={styles.checkboxText}>
                      I agree to the{' '}
                      <Text style={styles.checkboxLink}>Terms of Service</Text>
                      {' '}and{' '}
                      <Text style={styles.checkboxLink}>Privacy Policy</Text>
                    </Text>
                  </View>
                </View>

                {touched.acceptTerms && errors.acceptTerms && (
                  <Text style={styles.checkboxError}>{errors.acceptTerms}</Text>
                )}

                <Button
                  onPress={() => handleSubmit()}
                  loading={isLoading}
                  disabled={!isValid || !dirty}
                  variant="primary"
                  size="lg"
                  fullWidth
                  style={styles.registerButton}
                >
                  Create Account
                </Button>

                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.divider} />
                </View>

                <Button
                  onPress={handleGoogleSignUp}
                  loading={isLoading}
                  variant="ghost"
                  buttonStyle="outline"
                  size="lg"
                  fullWidth
                  style={styles.googleButton}
                >
                  <View style={styles.googleButtonContent}>
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                  </View>
                </Button>
              </View>
            )}
          </Formik>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Link href="/(auth)/login">
                <Text style={styles.footerLink}>Sign In</Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkbox: {
    padding: 0,
    marginRight: 12,
    marginTop: 2,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkboxBoxChecked: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  checkboxCheck: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxText: {
    fontSize: 14,
    color: Colors.gray[600],
    lineHeight: 20,
  },
  checkboxLink: {
    color: Colors.primary[500],
    fontWeight: '500',
  },
  checkboxError: {
    fontSize: 12,
    color: Colors.error,
    marginBottom: 16,
    marginLeft: 32,
  },
  registerButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray[200],
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: Colors.gray[500],
    fontWeight: '500',
  },
  googleButton: {
    borderColor: Colors.gray[300],
    marginBottom: 32,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[700],
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
});