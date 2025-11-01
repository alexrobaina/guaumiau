import React, {memo, useState, useCallback} from 'react';
import {ScrollView, View, Text} from 'react-native';
import {Footprints, Home} from 'lucide-react-native';
import {HomeHeader} from '@components/organisms/HomeHeader';
import {SearchBar} from '@components/molecules/SearchBar';
import {FilterChipList} from '@components/molecules/FilterChipList';
import {QuickActionCard} from '@components/atoms/QuickActionCard';
import {WalkerCard} from '@components/molecules/WalkerCard';
import {styles} from './styles';
import {theme} from '@/theme';

interface IWalker {
  id: string;
  name: string;
  avatar: string;
  distance: string;
  rating: number;
  reviews: number;
  price: number;
  available: boolean;
}

const MOCK_WALKERS: IWalker[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    distance: '0.5 km',
    rating: 4.9,
    reviews: 127,
    price: 25,
    available: true,
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    distance: '0.8 km',
    rating: 4.8,
    reviews: 94,
    price: 22,
    available: true,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    distance: '1.2 km',
    rating: 5.0,
    reviews: 156,
    price: 30,
    available: true,
  },
];

const FILTERS = [
  'Cerca de mi',
  'Disponible ahora',
  'Mejor valorados',
  'Paseador de perros',
  'Cuidador de mascotas',
];

export const WalkerHomeScreen = memo(() => {
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);

  const handleNotificationPress = useCallback(() => {
    console.log('Notifications pressed');
  }, []);

  const handleProfilePress = useCallback(() => {
    console.log('Profile pressed');
  }, []);

  const handleBookWalkPress = useCallback(() => {
    console.log('Book walk pressed');
  }, []);

  const handlePetSittingPress = useCallback(() => {
    console.log('Pet sitting pressed');
  }, []);

  const handleWalkerPress = useCallback((id: string) => {
    console.log('Walker pressed:', id);
  }, []);

  const handleFilterPress = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  return (
    <View style={styles.container}>
      <HomeHeader
        userName="Alex"
        location="San Francisco"
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Search Bar - Overlapping Header */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar paseadores..."
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          <FilterChipList
            filters={FILTERS}
            activeFilter={activeFilter}
            onFilterPress={handleFilterPress}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
          <View style={styles.quickActions}>
            <View style={styles.quickActionItem}>
              <QuickActionCard
                icon={<Footprints size={24} color={theme.colors.primary} />}
                title="Reservar paseo"
                onPress={handleBookWalkPress}
              />
            </View>
            <View style={styles.quickActionItem}>
              <QuickActionCard
                icon={<Home size={24} color={theme.colors.primary} />}
                title="Cuidado de mascotas"
                onPress={handlePetSittingPress}
              />
            </View>
          </View>
        </View>

        {/* Top Walkers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mejores paseadores cerca de ti</Text>
          {MOCK_WALKERS.map(walker => (
            <WalkerCard
              key={walker.id}
              id={walker.id}
              name={walker.name}
              avatar={walker.avatar}
              distance={walker.distance}
              rating={walker.rating}
              reviews={walker.reviews}
              price={walker.price}
              available={walker.available}
              onPress={handleWalkerPress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
});
