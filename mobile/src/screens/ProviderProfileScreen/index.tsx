import React, { memo } from 'react';
import { View, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Star, CheckCircle, MessageCircle, Shield, Award, Heart } from 'lucide-react-native';
import { useProvider } from '@/hooks/api/useProvider';
import { MainStackParamList } from '@/navigation/types';
import { Text, Button, Card, Spacer } from '@/components';
import { theme } from '@/theme';
import {
  formatServiceType,
  formatFullName,
  formatLocation,
  isNetworkError,
  getErrorMessage,
} from '@/utils/providerHelpers';
import { styles } from './styles';

type ProviderProfileScreenRouteProp = RouteProp<MainStackParamList, 'ProviderProfile'>;

export const ProviderProfileScreen = memo(() => {
  const route = useRoute<ProviderProfileScreenRouteProp>();
  const { providerId } = route.params;
  const { data: provider, isLoading, error, refetch, isFetching } = useProvider(providerId);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Spacer size="md" />
        <Text variant="body" color={'textSecondary'}>
          Loading provider profile...
        </Text>
      </View>
    );
  }

  // Error state
  if (error || !provider) {
    const errorMessage = getErrorMessage(error);
    const networkError = isNetworkError(errorMessage);

    return (
      <View style={styles.centerContainer}>
        <Text variant="h2" style={styles.centerText}>
          {networkError ? '📡 Connection Error' : '😕 Oops!'}
        </Text>
        <Spacer size="md" />
        <Text variant="body" color={'textSecondary'} style={styles.centerText}>
          {errorMessage}
        </Text>
        <Spacer size="lg" />
        <Button variant="primary" onPress={() => refetch()} disabled={isFetching}>
          {isFetching ? 'Retrying...' : 'Try Again'}
        </Button>
      </View>
    );
  }

  const fullName = formatFullName(provider.user.firstName ?? '', provider.user.lastName ?? '');
  const location = formatLocation(provider.user.city ?? '', provider.user.country ?? '');

  // Mock data for badges - in real app, this would come from provider data
  const badges = [
    { text: 'Verified', icon: <CheckCircle size={14} color="#2563eb" />, color: '#dbeafe' },
    { text: 'Insured', icon: <Shield size={14} color="#16a34a" />, color: '#dcfce7' },
    { text: 'Top Rated', icon: <Award size={14} color="#ca8a04" />, color: '#fef3c7' },
    { text: 'Pet Lover', icon: <Heart size={14} color="#dc2626" />, color: '#fee2e2' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Content */}
      <View style={styles.profileContent}>
        {/* Profile Photo */}
        <View style={styles.profilePhotoContainer}>
          <View style={styles.avatarWrapper}>
            {provider.user.avatar ? (
              <Image source={{ uri: provider.user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text variant="h1" style={{ color: '#ffffff' }}>
                  {provider.user.firstName.charAt(0)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Name and Title */}
        <View style={styles.nameSection}>
          <Text variant="h1" style={styles.centerText}>
            {fullName}
          </Text>
          <Spacer size="xs" />
          <Text variant="body" color={'textSecondary'} style={styles.centerText}>
            Paseador Profesional
          </Text>

          {/* Rating Stars */}
          <View style={styles.ratingRow}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                color={theme.colors.warning}
                fill={i < Math.floor(provider.averageRating) ? theme.colors.warning : 'transparent'}
              />
            ))}
            <Text variant="caption" color={'textSecondary'} style={{ marginLeft: 8 }}>
              ({provider.totalReviews} reseñas)
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {provider.completedBookings}+
            </Text>
            <Text style={styles.statLabel}>
              Paseos{'\n'}Completados
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {provider.totalReviews}
            </Text>
            <Text style={styles.statLabel}>
              Reseñas
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {provider.averageRating.toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>
              Calificación
            </Text>
          </View>
        </View>

        <Spacer size="lg" />

        {/* Experience Card */}
        {provider.experience && (
          <>
            <Card padding="medium" style={styles.card}>
              <Text variant="h2" style={styles.sectionTitle}>
                Experiencia
              </Text>
              <Spacer size="sm" />
              <Text variant="body" color={'textSecondary'} style={{ lineHeight: 22 }}>
                {provider.experience}
              </Text>
            </Card>
            <Spacer size="md" />
          </>
        )}

        {/* About Me Card */}
        <Card padding="medium" style={styles.card}>
          <Text variant="h2" style={styles.sectionTitle}>
            Sobre mí
          </Text>
          <Spacer size="sm" />
          <Text variant="body" color={'textSecondary'} style={{ lineHeight: 22 }}>
            {provider.bio ||
              `¡Hola! Soy ${provider.user.firstName}, un amante apasionado de las mascotas. Me dedico al cuidado profesional de perros y gatos, asegurándome de que cada mascota reciba el ejercicio, la atención y el amor que merece. Trato a cada animal como si fuera mío.`}
          </Text>
        </Card>

        <Spacer size="md" />

        {/* Services & Pricing */}
        {provider.services.length > 0 && (
          <Card padding="medium" style={styles.card}>
            <Text variant="h2" style={styles.sectionTitle}>
              Servicios y Precios
            </Text>
            <Spacer size="md" />
            <View style={styles.servicesContainer}>
              {provider.services.map((service, index) => (
                <View key={service.id}>
                  <View style={styles.serviceRow}>
                    <Text variant="body" color={'text'}>
                      {formatServiceType(service.serviceType)}
                    </Text>
                    <Text variant="h3" color={'primary'}>
                      ${service.basePrice}
                    </Text>
                  </View>
                  {index < provider.services.length - 1 && <View style={styles.serviceDivider} />}
                </View>
              ))}
            </View>
          </Card>
        )}

        <Spacer size="md" />

        {/* Badges & Certifications */}
        <Card padding="medium" style={styles.card}>
          <Text variant="h2" style={styles.sectionTitle}>
            Insignias y Certificaciones
          </Text>
          <Spacer size="md" />
          <View style={styles.badgesContainer}>
            {badges.map((badge, index) => (
              <View key={index} style={[styles.badge, { backgroundColor: badge.color }]}>
                {badge.icon}
                <Text variant="caption" style={{ marginLeft: 6, fontWeight: '600' }}>
                  {badge.text}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <Spacer size="lg" />

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
            }}
          >
            <Text variant="body" style={styles.primaryButtonText}>
              Reservar Ahora
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
            }}
          >
            <MessageCircle size={20} color={theme.colors.primary} />
            <Text variant="body" style={styles.secondaryButtonText}>
              Mensaje
            </Text>
          </TouchableOpacity>
        </View>

        <Spacer size="xl" />
      </View>
    </ScrollView>
  );
});

ProviderProfileScreen.displayName = 'ProviderProfileScreen';
