import React, { memo, useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile } from '@/hooks/api/useUpdateProfile';
import { Text, Button, Spacer, Input } from '@/components';
import { PhoneInput } from '@/components/atoms/PhoneInput';
import { GooglePlacesInput } from '@/components/molecules/GooglePlacesInput';
import { theme } from '@/theme';
import { styles } from './styles';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'EditProfile'>;

export const EditProfileScreen = memo(() => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [formData, setFormData] = useState({
    email: user?.email || '',
    username: user?.username || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    postalCode: user?.postalCode || '',
    country: user?.country || 'AR',
    latitude: user?.latitude || null,
    longitude: user?.longitude || null,
  });

  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');

  useEffect(() => {
    if (user?.phone) {
      // Parse existing phone number
      const match = user.phone.match(/^\+(\d+)\s(.+)$/);
      if (match) {
        setCountryCode(match[1]);
        setPhoneNumber(match[2]);
        setFormattedPhone(user.phone);
      }
    }
  }, [user?.phone]);

  const handleUpdateField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectPlace = (place: { address: string; latitude: number; longitude: number }) => {
    setFormData((prev) => ({
      ...prev,
      address: place.address,
      latitude: place.latitude,
      longitude: place.longitude,
    }));
  };

  const handleSubmit = () => {
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'El apellido es requerido');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'El email es requerido');
      return;
    }

    if (!formData.username.trim()) {
      Alert.alert('Error', 'El nombre de usuario es requerido');
      return;
    }

    const updateData: any = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      username: formData.username.trim(),
    };

    // Only include optional fields if they have values
    if (formattedPhone) {
      updateData.phone = formattedPhone;
    }

    if (formData.address) {
      updateData.address = formData.address;
      updateData.latitude = formData.latitude;
      updateData.longitude = formData.longitude;
    }

    if (formData.city) {
      updateData.city = formData.city;
    }

    if (formData.state) {
      updateData.state = formData.state;
    }

    if (formData.postalCode) {
      updateData.postalCode = formData.postalCode;
    }

    if (formData.country) {
      updateData.country = formData.country;
    }

    updateProfile(updateData, {
      onSuccess: () => {
        Alert.alert('Éxito', 'Perfil actualizado correctamente', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || error?.message || 'Error al actualizar el perfil';
        Alert.alert('Error', errorMessage);
      },
    });
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="h1" style={styles.title}>
          Editar Perfil
        </Text>

        <Spacer size="md" />

        <Text variant="body" style={styles.sectionTitle}>
          Información Personal
        </Text>

        <Spacer size="sm" />

        <Input
          placeholder="Nombre"
          value={formData.firstName}
          onChangeText={(text) => handleUpdateField('firstName', text)}
          editable={!isPending}
        />

        <Spacer size="sm" />

        <Input
          placeholder="Apellido"
          value={formData.lastName}
          onChangeText={(text) => handleUpdateField('lastName', text)}
          editable={!isPending}
        />

        <Spacer size="md" />

        <Text variant="body" style={styles.sectionTitle}>
          Credenciales
        </Text>

        <Spacer size="sm" />

        <Input
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => handleUpdateField('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isPending}
        />

        <Spacer size="sm" />

        <Input
          placeholder="Nombre de Usuario"
          value={formData.username}
          onChangeText={(text) => handleUpdateField('username', text)}
          autoCapitalize="none"
          editable={!isPending}
        />

        <Spacer size="md" />

        <Text variant="body" style={styles.sectionTitle}>
          Información de Contacto
        </Text>

        <Spacer size="sm" />

        <PhoneInput
          value={phoneNumber}
          onChangePhoneNumber={setPhoneNumber}
          onChangeCountryCode={setCountryCode}
          onChangeFormattedPhoneNumber={setFormattedPhone}
          placeholder="Número de teléfono"
          disabled={isPending}
          defaultCountry="AR"
        />

        <Spacer size="md" />

        <Text variant="body" style={styles.sectionTitle}>
          Dirección
        </Text>

        <Spacer size="sm" />

        <GooglePlacesInput
          value={formData.address}
          onChangeText={(text) => handleUpdateField('address', text)}
          onSelectPlace={handleSelectPlace}
          placeholder="Ingresa tu dirección"
          apiKey=""
        />

        <Spacer size="sm" />

        <Input
          placeholder="Ciudad"
          value={formData.city}
          onChangeText={(text) => handleUpdateField('city', text)}
          editable={!isPending}
        />

        <Spacer size="sm" />

        <Input
          placeholder="Provincia/Estado"
          value={formData.state}
          onChangeText={(text) => handleUpdateField('state', text)}
          editable={!isPending}
        />

        <Spacer size="sm" />

        <Input
          placeholder="Código Postal"
          value={formData.postalCode}
          onChangeText={(text) => handleUpdateField('postalCode', text)}
          keyboardType="numeric"
          editable={!isPending}
        />

        <Spacer size="xl" />

        <Button
          variant="primary"
          onPress={handleSubmit}
          disabled={isPending}
          isLoading={isPending}
          fullWidth
        >
          {isPending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>

        <Spacer size="md" />

        <Button
          variant="outline"
          onPress={() => navigation.goBack()}
          disabled={isPending}
          fullWidth
        >
          Cancelar
        </Button>

        <Spacer size="xl" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

EditProfileScreen.displayName = 'EditProfileScreen';
