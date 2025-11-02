import { memo, useState, useCallback, useMemo, useEffect } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { Footprints, Home } from 'lucide-react-native';
import { HomeHeader } from '@components/organisms/HomeHeader';
import { SearchBar } from '@components/molecules/SearchBar';
import { FilterChipList } from '@components/molecules/FilterChipList';
import { QuickActionCard } from '@components/atoms/QuickActionCard';
import { WalkerCard } from '@components/molecules/WalkerCard';
import { Sidebar } from '@components/organisms/Sidebar';
import { LocationRequestModal } from '@components/organisms/LocationRequestModal';
import { useProviders, useUpdateLocation } from '@/hooks/api';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/hooks/useLocation';
import { styles } from './styles';
import { theme } from '@/theme';

const FILTERS = [
  'Cerca de mi',
  'Disponible ahora',
  'Mejor valorados',
  'Paseador de perros',
  'Cuidador de mascotas',
];

export const WalkerHomeScreen = memo(() => {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Debounce search text to prevent too many API calls while typing
  const debouncedSearchText = useDebounce(searchText, 1000);

  // Location hooks
  const { location, requestLocation } = useLocation(false); // Don't auto-request
  const updateLocationMutation = useUpdateLocation({
    onSuccess: () => {
      console.log('Location updated successfully');
    },
    onError: error => {
      console.error('Failed to update location:', error);
    },
  });

  // Check if user needs location on mount
  useEffect(() => {
    // If user is on "Cerca de mi" and doesn't have location, show modal
    if (activeFilter === 'Cerca de mi' && user && (!user.latitude || !user.longitude)) {
      setShowLocationModal(true);
    }
  }, [activeFilter, user]);

  // Request and update location on mount (only for PET_OWNER)
  useEffect(() => {
    const updateUserLocation = async () => {
      // Only update location for pet owners, not service providers
      if (user && user.roles.includes('PET_OWNER')) {
        // Skip if user already has location
        if (user.latitude && user.longitude) {
          return;
        }

        try {
          const currentLocation = await requestLocation();
          if (currentLocation) {
            // Update location in backend
            updateLocationMutation.mutate({
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            });
          }
        } catch (error) {
          console.log('Location permission denied or unavailable');
        }
      }
    };

    updateUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only run when user ID changes (login/logout), not on user object updates

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
      // When searching, use broader location or no location filter
      params.search = debouncedSearchText.trim();
      // Don't pass latitude/longitude - backend will use user's location from auth
      params.radius = 100; // Much larger radius when searching (100km)
    } else {
      // When not searching, use normal location-based filtering
      // Don't pass latitude/longitude - backend will use user's location from auth
      params.radius = 10; // 10km radius for normal browsing
    }

    // Apply active filter (only if not searching, to avoid conflicts)
    if (!isSearching) {
      switch (activeFilter) {
        case 'Cerca de mi':
          // Just use location, no additional filters
          break;
        case 'Disponible ahora':
          params.availableNow = true;
          break;
        case 'Mejor valorados':
          params.minRating = 4.8;
          break;
        case 'Paseador de perros':
          params.serviceType = 'DOG_WALKING';
          break;
        case 'Cuidador de mascotas':
          params.serviceType = 'PET_SITTING';
          break;
      }
    }

    return params;
  }, [activeFilter, debouncedSearchText]);

  // Get display name and location from user
  const userName = user?.firstName || 'Usuario';
  const userLocation = user?.city || 'Ubicación';

  // Fetch providers from API
  const { data, isLoading, error, refetch } = useProviders(queryParams);

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
    // Check if user needs to set location for "Cerca de mi" filter
    if (filter === 'Cerca de mi' && user && (!user.latitude || !user.longitude)) {
      setShowLocationModal(true);
      return;
    }

    setActiveFilter(filter);
  }, [user]);

  const handleMenuPress = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const handleLocationSelected = useCallback((address: string, latitude: number, longitude: number, city?: string, country?: string) => {
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
  }, [updateLocationMutation]);

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

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Buscando paseadores...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Error al cargar paseadores. Por favor, intenta de nuevo.
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
              console.log(provider.isAvailable);
              return (
                <WalkerCard
                  id={provider.id}
                  key={provider.id}
                  onPress={handleWalkerPress}
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
                No se encontraron paseadores con los filtros seleccionados.
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
