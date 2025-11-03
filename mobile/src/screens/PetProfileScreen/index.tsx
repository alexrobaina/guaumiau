import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Pencil,
  Heart,
  Activity,
  Cross,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Pill,
  PawPrint,
  Clock,
  ToyBrick,
  Utensils,
  Phone,
  ChevronDown,
  ChevronUp,
  Camera,
  MessageCircle,
} from 'lucide-react-native';
import { Text } from '@/components/atoms/Text';
import { MainStackParamList } from '@/navigation/types';
import { usePet } from '@/hooks/api/usePet';
import { EnergyLevel, PetGender, PetSize } from '@/types/pet.types';
import { AddPetModal } from '@/components/organisms/AddPetModal';
import { useAuth } from '@/contexts/AuthContext';
import { styles } from './styles';
import { theme } from '@/theme';

type PetProfileScreenRouteProp = RouteProp<MainStackParamList, 'PetProfile'>;

// Helper functions to format data
const formatGender = (gender: PetGender): string => {
  const labels = {
    [PetGender.MALE]: 'Macho',
    [PetGender.FEMALE]: 'Hembra',
    [PetGender.UNKNOWN]: 'Desconocido',
  };
  return labels[gender] || 'Desconocido';
};

const formatSize = (size: PetSize): string => {
  const labels = {
    [PetSize.EXTRA_SMALL]: 'Extra Pequeño',
    [PetSize.SMALL]: 'Pequeño',
    [PetSize.MEDIUM]: 'Mediano',
    [PetSize.LARGE]: 'Grande',
    [PetSize.EXTRA_LARGE]: 'Extra Grande',
  };
  return labels[size] || 'Mediano';
};

const formatEnergyLevel = (level?: EnergyLevel | null): string => {
  if (!level) return 'Desconocido';
  const labels = {
    [EnergyLevel.LOW]: 'Bajo',
    [EnergyLevel.MODERATE]: 'Moderado',
    [EnergyLevel.HIGH]: 'Alto',
    [EnergyLevel.VERY_HIGH]: 'Muy Alto',
  };
  return labels[level] || 'Desconocido';
};

const getPhotoUrl = (photoPath?: string): string => {
  if (!photoPath)
    return 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop';
  if (photoPath.startsWith('http')) return photoPath;
  return `http://127.0.0.1:3000${photoPath}`;
};

export function PetProfileScreen() {
  const route = useRoute<PetProfileScreenRouteProp>();
  const navigation = useNavigation();
  const { petId } = route.params;
  const { user } = useAuth();

  const [careExpanded, setCareExpanded] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const { data: pet, isLoading, isError, error, refetch } = usePet(petId);

  const handleEditPet = () => {
    setIsEditModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsEditModalVisible(false);
    refetch(); // Refresh pet data after editing
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="body" color="textSecondary" style={styles.centerText}>
          Cargando perfil de mascota...
        </Text>
      </View>
    );
  }

  if (isError || !pet) {
    return (
      <View style={styles.centerContainer}>
        <AlertTriangle size={48} color={theme.colors.error} />
        <Text variant="body" color="error" style={styles.centerText}>
          Error al cargar el perfil
        </Text>
        <Text variant="caption" color="textSecondary" style={styles.centerText}>
          {error?.response?.data?.message || error?.message || 'Mascota no encontrada'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()} activeOpacity={0.7}>
          <Text variant="body" style={styles.retryButtonText}>
            Reintentar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Format data from backend
  const heroImage = getPhotoUrl(pet.photos?.[0]);
  const profileImage = getPhotoUrl(pet.photos?.[0]);
  const gender = formatGender(pet.gender);
  const size = formatSize(pet.size);
  const energyLevel = formatEnergyLevel(pet.energyLevel);

  // Parse text fields that might contain JSON arrays or comma-separated values
  const parseListField = (field?: string | null): string[] => {
    if (!field) return [];
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return field
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    }
  };

  const allergies = parseListField(pet.allergies);
  const medications = parseListField(pet.medications);
  const favoriteActivities = parseListField(pet.favoriteActivities);

  return (
    <View style={styles.container}>
      {/* Header with Hero Image */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: heroImage }} style={styles.heroImage} />
        <View style={styles.heroOverlay} />

        {/* Header Buttons */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleEditPet} activeOpacity={0.7}>
            <Pencil size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Photo Overlay */}
        <View style={styles.profilePhotoContainer}>
          <Image source={{ uri: profileImage }} style={styles.profilePhoto} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Pet Identity Section */}
        <View style={styles.identitySection}>
          <Text variant="h1" style={styles.petName}>
            {pet.name}
          </Text>
          <Text variant="body" color="textSecondary" style={styles.petBreed}>
            {pet.breed || 'Raza desconocida'}
          </Text>

          <View style={styles.badgesRow}>
            <View
              style={[
                styles.genderBadge,
                pet.gender === PetGender.MALE ? styles.maleBadge : styles.femaleBadge,
              ]}
            >
              <Text variant="caption" style={styles.badgeWhiteText}>
                {gender}
              </Text>
            </View>
            {pet.age && (
              <View style={[styles.genderBadge, styles.ageBadge]}>
                <Text variant="caption" style={styles.badgeWhiteText}>
                  {pet.age} años
                </Text>
              </View>
            )}
            <View style={[styles.genderBadge, styles.sizeBadge]}>
              <Text variant="caption" style={styles.badgeWhiteText}>
                {size}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{pet.weight || 'N/A'}</Text>
            <Text style={styles.statLabel}>kg</Text>
          </View>
          <View style={styles.statBox}>
            <Activity style={styles.statIcon} size={20} color={theme.colors.primary} />
            <Text style={styles.statLabel}>{energyLevel}</Text>
          </View>
          <View style={styles.statBox}>
            <Heart style={styles.statIcon} size={20} color={theme.colors.primary} />
            <Text style={styles.statLabel}>Amigable</Text>
          </View>
        </View>

        {/* Medical Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Cross size={20} color={theme.colors.primary} />
            <Text variant="h2" style={styles.cardTitle}>
              Información Médica
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="body" color="text">
              Estado de Vacunación
            </Text>
            {pet.isVaccinated ? (
              <CheckCircle size={20} color={theme.colors.success} />
            ) : (
              <XCircle size={20} color={theme.colors.error} />
            )}
          </View>

          <View style={styles.infoRow}>
            <Text variant="body" color="text">
              Esterilizado
            </Text>
            <View style={styles.badgeGreen}>
              <Text variant="caption" style={styles.badgeTextGreen}>
                {pet.isNeutered ? 'Sí' : 'No'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text variant="body" color="text">
              ID de Microchip
            </Text>
            <Text variant="caption" color="textSecondary">
              {pet.microchipId || 'N/D'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="body" color="text">
              Última Visita al Veterinario
            </Text>
            <Text variant="caption" color="textSecondary">
              {'N/D'}
            </Text>
          </View>

          {allergies.length > 0 && (
            <View style={styles.subsection}>
              <View style={styles.subsectionHeader}>
                <AlertTriangle size={16} color={theme.colors.error} />
                <Text variant="body" style={styles.subsectionTitle}>
                  Alergias
                </Text>
              </View>
              <View style={styles.tagsContainer}>
                {allergies.map((allergy, index) => (
                  <View key={index} style={styles.badgeRed}>
                    <Text variant="caption" style={styles.badgeTextRed}>
                      {allergy}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {medications.length > 0 && (
            <View style={styles.subsection}>
              <View style={styles.subsectionHeader}>
                <Pill size={16} color={theme.colors.primary} />
                <Text variant="body" style={styles.subsectionTitle}>
                  Medicamentos Actuales
                </Text>
              </View>
              <View style={styles.listContainer}>
                {medications.map((med, index) => (
                  <Text key={index} variant="body" color="textSecondary">
                    • {med}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Behavioral Traits Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <PawPrint size={20} color={theme.colors.primary} />
            <Text variant="h2" style={styles.cardTitle}>
              Comportamiento y Entrenamiento
            </Text>
          </View>

          <View style={styles.behaviorGrid}>
            <View
              style={[
                styles.behaviorChip,
                pet.isFriendlyWithKids ? styles.behaviorActive : styles.behaviorInactive,
              ]}
            >
              <Text
                variant="caption"
                style={
                  pet.isFriendlyWithKids ? styles.behaviorActiveText : styles.behaviorInactiveText
                }
              >
                Bueno con niños
              </Text>
            </View>
            <View
              style={[
                styles.behaviorChip,
                pet.isFriendlyWithDogs ? styles.behaviorActive : styles.behaviorInactive,
              ]}
            >
              <Text
                variant="caption"
                style={
                  pet.isFriendlyWithDogs ? styles.behaviorActiveText : styles.behaviorInactiveText
                }
              >
                Bueno con mascotas
              </Text>
            </View>
            <View
              style={[styles.behaviorChip, true ? styles.behaviorActive : styles.behaviorInactive]}
            >
              <Text
                variant="caption"
                style={true ? styles.behaviorActiveText : styles.behaviorInactiveText}
              >
                Entrenado en casa
              </Text>
            </View>
            <View
              style={[styles.behaviorChip, true ? styles.behaviorActive : styles.behaviorInactive]}
            >
              <Text
                variant="caption"
                style={true ? styles.behaviorActiveText : styles.behaviorInactiveText}
              >
                Entrenado con correa
              </Text>
            </View>
          </View>

          <View style={styles.subsection}>
            <Text variant="body" style={styles.subsectionTitle}>
              Comandos Conocidos
            </Text>
            <View style={styles.tagsContainer}>
              {[].map((command, index) => (
                <View key={index} style={styles.badgeOrange}>
                  <Text variant="caption" style={styles.badgeTextOrange}>
                    {command}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Preferences Card */}
        <View style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Preferencias
          </Text>

          <View style={styles.preferenceSection}>
            <View style={styles.preferenceHeader}>
              <Activity size={16} color={theme.colors.primary} />
              <Text variant="body" style={styles.preferenceTitle}>
                Actividades Favoritas
              </Text>
            </View>
            <View style={styles.listContainer}>
              {favoriteActivities.map((activity, index) => (
                <View key={index} style={styles.listItem}>
                  <Text variant="body" color="primary">
                    •
                  </Text>
                  <Text variant="body" color="textSecondary" style={styles.listItemText}>
                    {activity}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.preferenceSection}>
            <View style={styles.preferenceHeader}>
              <Clock size={16} color={theme.colors.primary} />
              <Text variant="body" style={styles.preferenceTitle}>
                Duración Preferida de Paseo
              </Text>
            </View>
            <Text variant="body" color="primary">
              {pet.preferredWalkDuration ? `${pet.preferredWalkDuration} minutos` : 'N/D'}
            </Text>
          </View>

          <View style={styles.preferenceSection}>
            <View style={styles.preferenceHeader}>
              <ToyBrick size={16} color={theme.colors.primary} />
              <Text variant="body" style={styles.preferenceTitle}>
                Juguetes Favoritos
              </Text>
            </View>
            <View style={styles.listContainer}>
              {[].map((toy, index) => (
                <View key={index} style={styles.listItem}>
                  <Text variant="body" color="primary">
                    •
                  </Text>
                  <Text variant="body" color="textSecondary" style={styles.listItemText}>
                    {toy}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.preferenceSection}>
            <View style={styles.preferenceHeader}>
              <Utensils size={16} color={theme.colors.primary} />
              <Text variant="body" style={styles.preferenceTitle}>
                Restricciones Dietéticas
              </Text>
            </View>
            <View style={styles.tagsContainer}>
              {[].map((restriction, index) => (
                <View key={index} style={styles.badgeRed}>
                  <Text variant="caption" style={styles.badgeTextRed}>
                    {restriction}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Emergency Contact Section */}
        <View style={[styles.card, styles.emergencyCard]}>
          <Text variant="h2" style={styles.emergencyTitle}>
            Contacto de Emergencia
          </Text>

          <Text variant="h3" style={styles.emergencyClinic}>
            {pet.vetName || 'Clínica Veterinaria'}
          </Text>
          <Text variant="body" color="text" style={styles.emergencyVet}>
            {pet.vetName || 'No especificado'}
          </Text>
          <Text variant="body" color="primary" style={styles.emergencyPhone}>
            {pet.vetPhone || 'No especificado'}
          </Text>
          <Text variant="caption" color="textSecondary" style={styles.emergencyAddress}>
            {pet.vetAddress || 'No especificado'}
          </Text>

          <TouchableOpacity style={styles.emergencyButton} activeOpacity={0.7}>
            <Phone size={20} color="#fff" />
            <Text variant="body" style={styles.emergencyButtonText}>
              Llamar Veterinario
            </Text>
          </TouchableOpacity>
        </View>

        {/* Care Instructions */}
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => setCareExpanded(!careExpanded)}
            style={styles.expandableHeader}
            activeOpacity={0.7}
          >
            <Text variant="h2" style={styles.cardTitle}>
              Instrucciones Especiales de Cuidado
            </Text>
            {careExpanded ? (
              <ChevronUp size={20} color={theme.colors.primary} />
            ) : (
              <ChevronDown size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>

          {careExpanded && (
            <View style={styles.careInstructionsContent}>
              <Text variant="body" color="text" style={styles.careInstructionsText}>
                {pet.specialInstructions || 'No se proporcionaron instrucciones especiales.'}
              </Text>
            </View>
          )}
        </View>

        {/* Photo Gallery */}
        <View style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Fotos
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoGallery}>
            {pet.photos && pet.photos.length > 0
              ? pet.photos.map((photo, index) => (
                  <Image
                    key={index}
                    source={{ uri: getPhotoUrl(photo) }}
                    style={styles.galleryPhoto}
                  />
                ))
              : null}
            <TouchableOpacity style={styles.addPhotoButton} activeOpacity={0.7}>
              <Camera size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Image
          source={{
            uri:
              pet.owner?.avatar ||
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
          }}
          style={styles.ownerAvatar}
        />
        <Text variant="caption" color="text" style={styles.ownerName}>
          {pet.owner ? `${pet.owner.firstName} ${pet.owner.lastName}` : 'Dueño de Mascota'}
        </Text>
        <View style={styles.bottomActions}>
          {user?.id !== pet.ownerId && (
            <TouchableOpacity
              onPress={() => navigation.navigate('WalkerHome' as never)}
              style={styles.primaryButton}
              activeOpacity={0.7}
            >
              <Text variant="body" style={styles.primaryButtonText}>
                Reservar Paseo
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('Messages')}
            style={styles.messageButton}
            activeOpacity={0.7}
          >
            <MessageCircle size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Edit Pet Modal */}
      <AddPetModal visible={isEditModalVisible} onClose={handleCloseModal} pet={pet} />
    </View>
  );
}
