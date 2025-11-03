import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, Pencil, AlertCircle } from 'lucide-react-native';
import { Text } from '@/components/atoms/Text';
import { styles } from './styles';
import { theme } from '@/theme';
import { usePets } from '@/hooks/api/usePets';
import { Pet, PetGender } from '@/types/pet.types';
import { AddPetModal } from '@/components/organisms/AddPetModal';

interface PetCardProps {
  pet: Pet;
  onEdit: () => void;
  onPress: () => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onEdit, onPress }) => {
  // Format pet info string
  const genderLabel =
    pet.gender === PetGender.MALE ? 'Macho' : pet.gender === PetGender.FEMALE ? 'Hembra' : 'Desconocido';
  const info = `${genderLabel}${pet.age ? `, ${pet.age} años` : ''}`;

  // Get primary photo or use placeholder
  let photo = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop';

  if (pet.photos && pet.photos.length > 0) {
    const photoUrl = pet.photos[0];
    // If it's a local path, construct full URL
    if (photoUrl.startsWith('/uploads')) {
      photo = `http://127.0.0.1:3000${photoUrl}`;
    } else {
      photo = photoUrl;
    }
  }

  // Create badges based on pet properties
  const badges: string[] = [];
  if (pet.isVaccinated) badges.push('Vacunado');
  if (pet.isFriendlyWithDogs) badges.push('Amigable');

  return (
    <TouchableOpacity style={styles.petCard} onPress={onPress} activeOpacity={0.7}>
      <TouchableOpacity style={styles.editButton} onPress={onEdit} activeOpacity={0.7}>
        <Pencil size={20} color={theme.colors.primary} />
      </TouchableOpacity>

      <View style={styles.petCardContent}>
        <Image source={{ uri: photo }} style={styles.petPhoto} />

        <View style={styles.petInfo}>
          <Text variant="h3" style={styles.petName}>
            {pet.name}
          </Text>
          <Text variant="caption" color="textSecondary" style={styles.petBreed}>
            {pet.breed || 'Raza desconocida'} • {info}
          </Text>

          <View style={styles.petDetails}>
            <Text variant="caption" color="text" style={styles.petDetailText}>
              Edad: {pet.age ? `${pet.age} años` : 'N/D'}
            </Text>
            <Text variant="caption" color="text" style={styles.petDetailText}>
              Peso: {pet.weight ? `${pet.weight} kg` : 'N/D'}
            </Text>
          </View>

          {badges.length > 0 && (
            <View style={styles.badgesContainer}>
              {badges.map((badge, index) => (
                <View
                  key={index}
                  style={[
                    styles.badge,
                    badge === 'Vacunado' ? styles.badgeGreen : styles.badgeBlue,
                  ]}
                >
                  <Text
                    variant="caption"
                    style={[
                      styles.badgeText,
                      badge === 'Vacunado' ? styles.badgeTextGreen : styles.badgeTextBlue,
                    ]}
                  >
                    {badge}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export function MyPetsScreen() {
  const navigation = useNavigation<any>();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const { data: pets, isLoading, isError, error, refetch, isRefetching } = usePets();

  const handleAddPet = () => {
    setSelectedPet(null);
    setIsAddModalVisible(true);
  };

  const handleEditPet = (pet: Pet) => {
    setSelectedPet(pet);
    setIsAddModalVisible(true);
  };

  const handleViewPet = (pet: Pet) => {
    navigation.navigate('PetProfile', { petId: pet.id });
  };

  const handleCloseModal = () => {
    setIsAddModalVisible(false);
    setSelectedPet(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="h1" style={styles.headerTitle}>
            Mis Mascotas
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="body" color="textSecondary" style={styles.centerText}>
            Cargando tus mascotas...
          </Text>
        </View>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="h1" style={styles.headerTitle}>
            Mis Mascotas
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <AlertCircle size={48} color={theme.colors.error} />
          <Text variant="body" color="error" style={styles.centerText}>
            Error al cargar las mascotas
          </Text>
          <Text variant="caption" color="textSecondary" style={styles.errorMessage}>
            {error?.response?.data?.message || error?.message || 'Error desconocido'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
            activeOpacity={0.7}
          >
            <Text variant="body" style={styles.retryButtonText}>
              Reintentar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Empty state
  if (!pets || pets.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="h1" style={styles.headerTitle}>
            Mis Mascotas
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <Text variant="h2" style={styles.emptyTitle}>
            Aún no tienes mascotas
          </Text>
          <Text variant="body" color="textSecondary" style={styles.emptyText}>
            Agrega tu primera mascota para comenzar
          </Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddPet} activeOpacity={0.7}>
            <Plus size={24} color="#FFF" />
            <Text variant="body" style={styles.addButtonText}>
              Agregar Mascota
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Pets list
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1" style={styles.headerTitle}>
          Mis Mascotas
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.petsContainer}>
          {pets.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              onEdit={() => handleEditPet(pet)}
              onPress={() => handleViewPet(pet)}
            />
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleAddPet} activeOpacity={0.8}>
        <Plus size={24} color="#FFF" />
      </TouchableOpacity>

      <AddPetModal visible={isAddModalVisible} onClose={handleCloseModal} pet={selectedPet} />
    </View>
  );
}
