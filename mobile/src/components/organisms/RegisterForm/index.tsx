import React, { memo, useState, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormField } from '@components/molecules/FormField';
import { GooglePlacesFormField } from '@components/molecules/GooglePlacesFormField';
import { RadioGroup } from '@components/molecules/RadioGroup';
import { Button } from '@components/atoms/Button';
import { Text } from '@components/atoms/Text';
import { Checkbox } from '@components/atoms/Checkbox';
import { IGooglePlaceData, IGooglePlaceDetails } from '@components/atoms/GooglePlacesInput/GooglePlacesInput.types';
import { IRegisterFormProps, IRegisterFormState, UserRole } from './RegisterForm.types';
import { parseGooglePlaceAddress } from '@utils/addressParser';
import { styles } from './RegisterForm.styles';

const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'El email es requerido';
  if (!emailRegex.test(email)) return 'Formato de email inválido';
  return undefined;
};

const validateUsername = (username: string): string | undefined => {
  if (!username) return 'El nombre de usuario es requerido';
  if (username.length < 3) return 'El nombre de usuario debe tener al menos 3 caracteres';
  if (username.length > 20) return 'El nombre de usuario debe tener menos de 20 caracteres';
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return 'El nombre de usuario solo puede contener letras, números y guiones bajos';
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return 'La contraseña es requerida';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  return undefined;
};

const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
  if (!confirmPassword) return 'Por favor, confirma tu contraseña';
  if (password !== confirmPassword) return 'Las contraseñas no coinciden';
  return undefined;
};

const validateName = (name: string, fieldName: string): string | undefined => {
  if (!name) return `${fieldName} es requerido`;
  if (name.length < 2) return `${fieldName} debe tener al menos 2 caracteres`;
  return undefined;
};

const validateUserRole = (userRole: UserRole | null): string | undefined => {
  if (!userRole) return 'Debes seleccionar un tipo de usuario';
  return undefined;
};

const validateTerms = (termsAccepted: boolean): string | undefined => {
  if (!termsAccepted) return 'Debes aceptar los Términos y Condiciones';
  return undefined;
};

export const RegisterForm = memo<IRegisterFormProps>(({ onSubmit, isLoading = false, error }) => {
  const navigation = useNavigation();
  const [formState, setFormState] = useState<IRegisterFormState>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    userRole: null,
    termsAccepted: false,
    address: '',
    latitude: undefined,
    longitude: undefined,
    city: undefined,
    country: undefined,
    errors: {},
  });

  const handleEmailChange = useCallback((email: string) => {
    setFormState(prev => ({
      ...prev,
      email,
      errors: { ...prev.errors, email: undefined },
    }));
  }, []);

  const handleUsernameChange = useCallback((username: string) => {
    setFormState(prev => ({
      ...prev,
      username,
      errors: { ...prev.errors, username: undefined },
    }));
  }, []);

  const handlePasswordChange = useCallback((password: string) => {
    setFormState(prev => ({
      ...prev,
      password,
      errors: { ...prev.errors, password: undefined },
    }));
  }, []);

  const handleConfirmPasswordChange = useCallback((confirmPassword: string) => {
    setFormState(prev => ({
      ...prev,
      confirmPassword,
      errors: { ...prev.errors, confirmPassword: undefined },
    }));
  }, []);

  const handleFirstNameChange = useCallback((firstName: string) => {
    setFormState(prev => ({
      ...prev,
      firstName,
      errors: { ...prev.errors, firstName: undefined },
    }));
  }, []);

  const handleLastNameChange = useCallback((lastName: string) => {
    setFormState(prev => ({
      ...prev,
      lastName,
      errors: { ...prev.errors, lastName: undefined },
    }));
  }, []);

  const handleUserRoleChange = useCallback((userRole: UserRole) => {
    setFormState(prev => ({
      ...prev,
      userRole,
      errors: { ...prev.errors, userRole: undefined },
    }));
  }, []);

  const handleTermsToggle = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      termsAccepted: !prev.termsAccepted,
      errors: { ...prev.errors, termsAccepted: undefined },
    }));
  }, []);

  const handleAddressChange = useCallback((address: string) => {
    setFormState(prev => ({
      ...prev,
      address,
      errors: { ...prev.errors, address: undefined },
    }));
  }, []);

  const handlePlaceSelected = useCallback((data: IGooglePlaceData, details: IGooglePlaceDetails | null) => {
    // Extract city and country from address components
    const { city, country } = parseGooglePlaceAddress(details);

    setFormState(prev => ({
      ...prev,
      address: data.description,
      latitude: details?.geometry?.location?.lat,
      longitude: details?.geometry?.location?.lng,
      city,
      country,
      errors: { ...prev.errors, address: undefined },
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    const emailError = validateEmail(formState.email);
    const passwordError = validatePassword(formState.password);
    const confirmPasswordError = validateConfirmPassword(
      formState.password,
      formState.confirmPassword,
    );
    const firstNameError = validateName(formState.firstName, 'El nombre');
    const lastNameError = validateName(formState.lastName, 'El apellido');
    const userRoleError = validateUserRole(formState.userRole);
    const termsError = validateTerms(formState.termsAccepted);

    // Only validate username for SERVICE_PROVIDER
    const usernameError = formState.userRole === 'SERVICE_PROVIDER'
      ? validateUsername(formState.username)
      : undefined;

    // Only validate address for SERVICE_PROVIDER
    const addressError = formState.userRole === 'SERVICE_PROVIDER' && !formState.address
      ? 'La dirección es requerida para paseadores'
      : undefined;

    if (
      emailError ||
      usernameError ||
      passwordError ||
      confirmPasswordError ||
      firstNameError ||
      lastNameError ||
      userRoleError ||
      termsError ||
      addressError
    ) {
      setFormState(prev => ({
        ...prev,
        errors: {
          email: emailError,
          username: usernameError,
          password: passwordError,
          confirmPassword: confirmPasswordError,
          firstName: firstNameError,
          lastName: lastNameError,
          userRole: userRoleError,
          termsAccepted: termsError,
          address: addressError,
        },
      }));
      return;
    }

    // For PET_OWNER, use email as username
    const username = formState.userRole === 'SERVICE_PROVIDER'
      ? formState.username
      : formState.email;

    onSubmit(
      formState.email,
      username,
      formState.password,
      formState.firstName,
      formState.lastName,
      formState.userRole!,
      formState.termsAccepted,
      formState.address,
      formState.latitude,
      formState.longitude,
      formState.city,
      formState.country,
    );
  }, [
    formState.email,
    formState.username,
    formState.password,
    formState.confirmPassword,
    formState.firstName,
    formState.lastName,
    formState.userRole,
    formState.termsAccepted,
    formState.address,
    formState.latitude,
    formState.longitude,
    formState.city,
    formState.country,
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

      <RadioGroup<UserRole>
        label="Tipo de Usuario"
        required
        options={[
          {
            value: 'PET_OWNER',
            label: 'Dueño de Mascota',
            icon: '🐕',
          },
          {
            value: 'SERVICE_PROVIDER',
            label: 'Paseador / Cuidador',
            icon: '👨‍⚕️',
          },
        ]}
        value={formState.userRole}
        onChange={handleUserRoleChange}
        error={formState.errors.userRole}
        layout="horizontal"
      />

      <FormField
        label="Nombre"
        placeholder="Ingresa tu nombre"
        value={formState.firstName}
        onChangeText={handleFirstNameChange}
        error={formState.errors.firstName}
        autoCapitalize="words"
        required
      />

      <FormField
        label="Apellido"
        placeholder="Ingresa tu apellido"
        value={formState.lastName}
        onChangeText={handleLastNameChange}
        error={formState.errors.lastName}
        autoCapitalize="words"
        required
      />

      {/* Address field - Only for SERVICE_PROVIDER */}
      {formState.userRole === 'SERVICE_PROVIDER' && (
        <GooglePlacesFormField
          label="Dirección"
          placeholder="Busca tu dirección"
          value={formState.address}
          onChangeText={handleAddressChange}
          onPlaceSelected={handlePlaceSelected}
          error={formState.errors.address}
          required
        />
      )}

      <FormField
        label="Email"
        placeholder="Ingresa tu email"
        value={formState.email}
        onChangeText={handleEmailChange}
        error={formState.errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        required
      />

      {/* Username - Only for SERVICE_PROVIDER */}
      {formState.userRole === 'SERVICE_PROVIDER' && (
        <FormField
          label="Nombre de Usuario"
          placeholder="Elige un nombre de usuario"
          value={formState.username}
          onChangeText={handleUsernameChange}
          error={formState.errors.username}
          autoCapitalize="none"
          autoComplete="username"
          required
        />
      )}

      <FormField
        label="Contraseña"
        placeholder="Crea una contraseña"
        value={formState.password}
        onChangeText={handlePasswordChange}
        error={formState.errors.password}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        required
      />

      <FormField
        label="Confirmar Contraseña"
        placeholder="Confirma tu contraseña"
        value={formState.confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        error={formState.errors.confirmPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        required
      />

      <Checkbox
        checked={formState.termsAccepted}
        onToggle={handleTermsToggle}
        error={formState.errors.termsAccepted}
        labelComponent={
          <Text style={styles.checkboxLabel}>
            Acepto los <Text style={styles.checkboxLinkText}>Términos y Condiciones</Text>
          </Text>
        }
      />

      <Button
        title="Crear Cuenta"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        fullWidth
      />

      <TouchableOpacity style={styles.loginLink} onPress={handleNavigateToLogin}>
        <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
        <Text style={styles.loginLinkText}>Inicia Sesión</Text>
      </TouchableOpacity>
    </View>
  );
});
