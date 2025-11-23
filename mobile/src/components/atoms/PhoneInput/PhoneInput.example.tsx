import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {PhoneInput} from './index';
import {theme} from '@/theme';

/**
 * Ejemplo de uso del componente PhoneInput
 * Este archivo muestra cómo implementar el componente en tu aplicación
 */

export const PhoneInputExample = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [error, setError] = useState('');

  const handlePhoneChange = (phone: string) => {
    setPhoneNumber(phone);

    // Validación simple
    if (phone.length > 0 && phone.length < 8) {
      setError('El número debe tener al menos 8 dígitos');
    } else {
      setError('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejemplo de PhoneInput</Text>

      <PhoneInput
        value={phoneNumber}
        onChangePhoneNumber={handlePhoneChange}
        onChangeCountryCode={setCountryCode}
        onChangeFormattedPhoneNumber={setFormattedPhone}
        error={error}
        placeholder="Ingresa tu número"
      />

      {/* Información de debug */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>Información:</Text>
        <Text style={styles.debugText}>Número: {phoneNumber}</Text>
        <Text style={styles.debugText}>Código de país: +{countryCode}</Text>
        <Text style={styles.debugText}>
          Número formateado: {formattedPhone}
        </Text>
      </View>

      {/* Ejemplo con país predeterminado */}
      <Text style={styles.subtitle}>
        Con país predeterminado (Argentina):
      </Text>
      <PhoneInput
        value=""
        onChangePhoneNumber={() => {}}
        defaultCountry="AR"
        autoDetectCountry={false}
        placeholder="Solo Argentina"
      />

      {/* Ejemplo deshabilitado */}
      <Text style={styles.subtitle}>Componente deshabilitado:</Text>
      <PhoneInput
        value="1123456789"
        onChangePhoneNumber={() => {}}
        disabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  debugContainer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  debugTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  debugText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginVertical: 2,
  },
});
