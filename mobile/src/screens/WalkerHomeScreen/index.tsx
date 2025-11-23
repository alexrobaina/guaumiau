import { memo, useState, useCallback, useMemo, useEffect } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeHeader } from '@components/organisms/HomeHeader';
import { SearchBar } from '@components/molecules/SearchBar';
import { FilterChipList } from '@components/molecules/FilterChipList';
import { WalkerCard } from '@components/molecules/WalkerCard';
import { Sidebar } from '@components/organisms/Sidebar';
import { LocationRequestModal } from '@components/organisms/LocationRequestModal';
import { useProviders, useUpdateLocation } from '@/hooks/api';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/contexts/AuthContext';
import type { MainStackParamList } from '@/navigation/types';
import { styles } from './styles';
import { theme } from '@/theme';

type WalkerHomeNavigationProp = NativeStackNavigationProp<MainStackParamList, 'WalkerHome'>;

const FILTERS = [
  'Cerca de mi',
  'Disponible ahora',
  'Mejor valorados',
  'Paseador de perros',
  'Cuidador de mascotas',
];

export const WalkerHomeScreen = memo(() => {
  const navigation = useNavigation<WalkerHomeNavigationProp>();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState(FILTERS[1]); // Start with "Disponible ahora" instead of "Cerca de mi"
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Debounce search text to prevent too many API calls while typing
  const debouncedSearchText = useDebounce(searchText, 1500);

  // Location hooks
  const updateLocationMutation = useUpdateLocation({
    onSuccess: () => {
      console.log('Location updated successfully');
    },
    onError: error => {
      console.error('Failed to update location:', error);
    },
  });

  // Check if user needs location when filter changes to "Cerca de mi"
  useEffect(() => {
    // If user is on "Cerca de mi" and doesn't have location, show modal
    if (activeFilter === 'Cerca de mi' && user && (!user.latitude || !user.longitude)) {
      setShowLocationModal(true);
    }
  }, [activeFilter, user?.latitude, user?.longitude]);

  // Map filter to query params
  const queryParams = useMemo(() => {
    // Base params with pagination
    const params: any = {
      limit: 20,
      page: 1,
    };

    // If searching, search globally without location restrictions
    const isSearching = debouncedSearchText.trim().length > 0;

    if (isSearching) {
      // When searching, use broader location
      params.search = debouncedSearchText.trim();
      // Don't add location params when searching to get global results
    } else {
      // Apply active filter
      switch (activeFilter) {
        case 'Cerca de mi':
          // Only add location if available
          if (user?.latitude && user?.longitude) {
            params.latitude = user.latitude;
            params.longitude = user.longitude;
            params.radius = 50; // Increased from 10km to 50km for better results
          }
          break;
        case 'Disponible ahora':
          params.availableNow = true;
          break;
        case 'Mejor valorados':
          params.minRating = 4.8;
          // Don't use location filter for this
          break;
        case 'Paseador de perros':
          params.serviceType = 'DOG_WALKING';
          // Don't use location filter for this
          break;
        case 'Cuidador de mascotas':
          params.serviceType = 'PET_SITTING';
          // Don't use location filter for this
          break;
      }
    }

    return params;
  }, [activeFilter, debouncedSearchText, user?.latitude, user?.longitude]);

  // Get display name and location from user
  const userName = user?.firstName || 'Usuario';
  const userLocation = user?.city || 'Ubicación';

  // Debug logging
  useEffect(() => {
    console.log('\n========================================');
    console.log('🏷️  [FRONTEND] Active filter:', activeFilter);
    console.log('🔍 [FRONTEND] Query params:', JSON.stringify(queryParams, null, 2));
    console.log('👤 [FRONTEND] User location:', {
      hasLocation: !!(user?.latitude && user?.longitude),
      latitude: user?.latitude,
      longitude: user?.longitude,
      city: user?.city,
    });
    console.log('🔎 [FRONTEND] Search text:', searchText ? `"${searchText}"` : 'empty');
    console.log('========================================\n');
  }, [queryParams, activeFilter, user?.latitude, user?.longitude, user?.city, searchText]);

  // Fetch providers from API
  // Use staleTime to prevent duplicate requests
  const { data, isLoading, error, refetch } = useProviders(queryParams, {
    staleTime: 30000, // Consider data fresh for 30 seconds (prevents duplicate requests)
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnMount: false, // Don't refetch on component mount if data is fresh
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    retry: (failureCount, error: any) => {
      // Retry on rate limit errors (429), but only once after a delay
      if (error?.response?.status === 429) {
        return failureCount < 1;
      }
      // Retry network errors up to 2 times
      return failureCount < 2;
    },
    retryDelay: (attemptIndex, error: any) => {
      // Wait longer for rate limit errors
      if (error?.response?.status === 429) {
        return 3000; // Wait 3 seconds before retrying (increased from 2)
      }
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
  });

  // Debug response
  useEffect(() => {
    console.log('\n========== RESPONSE ==========');
    if (isLoading) {
      console.log('⏳ [FRONTEND] Loading providers...');
    }
    if (data) {
      console.log('✅ [FRONTEND] Providers received:', data.total, 'total');
      console.log('📦 [FRONTEND] Providers list:');
      data.providers.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.user.firstName} ${p.user.lastName}`);
        console.log(
          `      Rating: ${p.averageRating}⭐ | Available: ${p.isAvailable ? 'YES' : 'NO'} | Distance: ${p.distance ? p.distance + 'km' : 'N/A'}`,
        );
        console.log(`      Services: ${p.servicesOffered.join(', ')}`);
      });
    }
    if (error) {
      console.error('❌ [FRONTEND] Error fetching providers:');
      console.error('   Status:', (error as any)?.response?.status);
      console.error('   Message:', (error as any)?.message);
      console.error('   Full error:', error);
    }
    console.log('==============================\n');
  }, [data, error, isLoading]);

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

  const handleWalkerPress = useCallback(
    (id: string) => {
      navigation.navigate('ProviderProfile', { providerId: id });
    },
    [navigation],
  );

  const handleReservePress = useCallback(
    (id: string) => {
      navigation.navigate('Booking', { providerId: id });
    },
    [navigation],
  );

  const handleFilterPress = useCallback(
    (filter: string) => {
      console.log('\n🎯 [FRONTEND] User clicked filter:', filter);
      console.log('   Previous filter:', activeFilter);

      // Check if user needs to set location for "Cerca de mi" filter
      if (filter === 'Cerca de mi' && user && (!user.latitude || !user.longitude)) {
        console.log('   ⚠️  User has no location, showing location modal');
        setShowLocationModal(true);
        // Don't change the active filter yet - wait for location to be set
        return;
      }

      // Clear search when changing filters to avoid confusion
      if (filter !== activeFilter && searchText.trim().length > 0) {
        console.log('   🧹 Clearing search text');
        setSearchText('');
      }

      console.log('   ✅ Setting new filter:', filter);
      setActiveFilter(filter);
    },
    [user, activeFilter, searchText],
  );

  const handleMenuPress = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const handleLocationSelected = useCallback(
    (address: string, latitude: number, longitude: number, city?: string, country?: string) => {
      // Update user location in backend
      updateLocationMutation.mutate({
        latitude,
        longitude,
        address,
        city,
        country,
      });
      setShowLocationModal(false);
      // Set the filter to "Cerca de mi" after location is set
      setActiveFilter('Cerca de mi');
    },
    [updateLocationMutation],
  );

  const handleCloseLocationModal = useCallback(() => {
    setShowLocationModal(false);
  }, []);

  return (
    <View style={styles.container}>
      <HomeHeader
        userName={userName}
        location={userLocation}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
        onMenuPress={handleMenuPress}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
        {/* <View style={styles.section}>
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
        </View> */}

        {/* Top Walkers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mejores paseadores cerca de ti</Text>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Buscando paseadores...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {(error as any)?.response?.status === 429
                  ? 'Demasiadas solicitudes. Por favor, espera un momento e intenta de nuevo.'
                  : 'Error al cargar paseadores. Por favor, intenta de nuevo.'}
              </Text>
            </View>
          )}

          {!isLoading &&
            !error &&
            data?.providers.map(provider => {
              // Get the primary service (first DOG_WALKING service or first service)
              const dogWalkingService = provider.services.find(
                s => s.serviceType === 'DOG_WALKING',
              );
              const primaryService = dogWalkingService || provider.services[0];

              return (
                <WalkerCard
                  id={provider.id}
                  key={provider.id}
                  onPress={handleWalkerPress}
                  onReservePress={handleReservePress}
                  rating={provider.averageRating}
                  reviews={provider.totalReviews}
                  available={provider.isAvailable}
                  avatar={provider.user.avatar || ''}
                  price={primaryService?.basePrice || 0}
                  name={`${provider.user.firstName} ${provider.user.lastName}`}
                  distance={provider.distance !== undefined ? `${provider.distance} km` : 'N/A'}
                  servicesOffered={provider.servicesOffered}
                />
              );
            })}

          {!isLoading && !error && data?.providers.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeFilter === 'Cerca de mi'
                  ? 'No se encontraron paseadores cerca de tu ubicación. Intenta con otros filtros.'
                  : 'No se encontraron paseadores con los filtros seleccionados.'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <LocationRequestModal
        visible={showLocationModal}
        onClose={handleCloseLocationModal}
        onLocationSelected={handleLocationSelected}
      />
    </View>
  );
});
