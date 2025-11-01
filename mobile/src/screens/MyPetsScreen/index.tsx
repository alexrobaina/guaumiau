import React from 'react';
import {View, FlatList, TouchableOpacity, RefreshControl} from 'react-native';
import {Plus} from 'lucide-react-native';
import {Layout} from '@/components/Layout';
import {Text, Button, Spinner, Card, Spacer, PetAvatar, PetSizeBadge} from '@/components';
import {usePets} from '@/hooks/api';
import {Pet} from '@/types/pet.types';
import {styles} from './styles';
import {theme} from '@/theme';

interface PetCardProps {
  pet: Pet;
  onPress: () => void;
}

const PetCard: React.FC<PetCardProps> = ({pet, onPress}) => {
  const firstPhoto = pet.photos && pet.photos.length > 0 ? pet.photos[0] : null;

  return (
    <Card padding="medium" onPress={onPress}>
      <View style={styles.petCard}>
        <PetAvatar
          photoUrl={firstPhoto}
          petType={pet.type}
          size="medium"
        />
        <View style={styles.petInfo}>
          <Text variant="h3">{pet.name}</Text>
          <Spacer size="xs" />
          <Text variant="caption" color="textSecondary">
            {pet.breed || pet.type}
          </Text>
        </View>
        <PetSizeBadge size={pet.size} />
      </View>
    </Card>
  );
};

export function MyPetsScreen() {
  const {data: pets, isLoading, isError, error, refetch} = usePets();

  if (isLoading) {
    return (
      <Layout>
        <View style={styles.centerContainer}>
          <Spinner size="large" />
          <Spacer size="md" />
          <Text variant="body" color="textSecondary">
            Loading pets...
          </Text>
        </View>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <View style={styles.centerContainer}>
          <Text variant="body" color="error" align="center">
            {error?.response?.data?.message || 'Failed to load pets'}
          </Text>
          <Spacer size="md" />
          <Button title="Retry" onPress={() => refetch()} />
        </View>
      </Layout>
    );
  }

  const handleAddPet = () => {
    // TODO: Navigate to AddPet screen
    console.log('Navigate to Add Pet');
  };

  const handlePetPress = (pet: Pet) => {
    // TODO: Navigate to Pet Profile screen
    console.log('Navigate to Pet Profile', pet.id);
  };

  if (!pets || pets.length === 0) {
    return (
      <Layout>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text variant="h2">Mis Mascotas</Text>
          </View>
          <Spacer size="lg" />

          <View style={styles.emptyContainer}>
            <Text variant="h1" align="center" style={styles.emptyEmoji}>
              🐾
            </Text>
            <Spacer size="md" />
            <Text variant="h2" align="center">
              Aún no tienes mascotas
            </Text>
            <Spacer size="sm" />
            <Text variant="body" color="textSecondary" align="center" style={styles.emptyText}>
              Agrega tu primera mascota para comenzar a reservar servicios de cuidado y paseo
            </Text>
          </View>
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddPet}
          activeOpacity={0.8}>
          <Plus size={28} color="#FFF" />
        </TouchableOpacity>
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="h2">Mis Mascotas</Text>
        </View>

        <Spacer size="md" />

        <FlatList
          data={pets}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <>
              <PetCard pet={item} onPress={() => handlePetPress(item)} />
              <Spacer size="sm" />
            </>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 80}}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor={theme.colors.primary}
            />
          }
        />
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddPet}
        activeOpacity={0.8}>
        <Plus size={28} color="#FFF" />
      </TouchableOpacity>
    </Layout>
  );
}
