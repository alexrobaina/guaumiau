import React, {useState, useEffect, useRef, useMemo} from 'react';
import {View, ScrollView, Platform, Alert} from 'react-native';
import MapView, {Marker, Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {Text, Spinner} from '@/components';
import {FilterChips} from './FilterChips';
import {WalkerCard} from './WalkerCard';
import {styles} from './styles';
import {Walker, UserLocation, FilterType} from './types';
import {theme} from '@/theme';
import {useWalkers} from '@/hooks/api/useWalkers';
import {SearchWalkersParams} from '@/services/api/walkers.service';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {MainStackParamList} from '@/navigation/types';
import {useAuth} from '@/contexts/AuthContext';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function SearchWalkersScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {user} = useAuth();
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['Todos']);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [selectedWalkerId, setSelectedWalkerId] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  // Build search params based on filters
  const searchParams = useMemo<SearchWalkersParams>(() => {
    const params: SearchWalkersParams = {};

    // Add user location if available
    if (userLocation) {
      params.latitude = userLocation.lat;
      params.longitude = userLocation.lng;
    }

    // Process filters
    if (!selectedFilters.includes('Todos')) {
      // Distance filter
      if (selectedFilters.includes('<2km')) {
        params.maxDistance = 2;
      } else if (selectedFilters.includes('<5km')) {
        params.maxDistance = 5;
      } else if (selectedFilters.includes('<10km')) {
        params.maxDistance = 10;
      }

      // Rating filter
      if (selectedFilters.includes('4.5+ estrellas')) {
        params.minRating = 4.5;
      } else if (selectedFilters.includes('4.0+ estrellas')) {
        params.minRating = 4.0;
      }

      // Service type filters
      const serviceTypes: string[] = [];
      if (selectedFilters.includes('Paseo')) {
        serviceTypes.push('DOG_WALKING');
      }
      if (selectedFilters.includes('Cuidado')) {
        serviceTypes.push('DOG_SITTING', 'CAT_SITTING', 'PET_SITTING');
      }
      if (selectedFilters.includes('Hospedaje')) {
        serviceTypes.push('DOG_BOARDING', 'CAT_BOARDING', 'PET_BOARDING');
      }
      if (selectedFilters.includes('Guardería')) {
        serviceTypes.push('DOG_DAYCARE', 'PET_DAYCARE');
      }

      if (serviceTypes.length > 0) {
        params.serviceTypes = serviceTypes;
      }
    }

    return params;
  }, [selectedFilters, userLocation]);

  // Fetch walkers with filters
  const {data: walkers = [], isLoading, isError, refetch} = useWalkers(searchParams);

  // Get user's location (prioritize saved address over GPS)
  useEffect(() => {
    // Check if user has saved coordinates
    if (user?.latitude && user?.longitude) {
      console.log('Using user saved location:', user.latitude, user.longitude);
      setUserLocation({lat: user.latitude, lng: user.longitude});
      setIsLoadingLocation(false);
      return;
    }

    // Otherwise, get device GPS location
    console.log('No saved location, getting GPS coordinates...');
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('GPS location obtained:', latitude, longitude);
        setUserLocation({lat: latitude, lng: longitude});
        setIsLoadingLocation(false);
      },
      error => {
        console.error('Error getting GPS location:', error);
        Alert.alert(
          'Error de ubicación',
          'No se pudo obtener tu ubicación. Usando ubicación predeterminada (Palermo, Buenos Aires).',
        );
        // Fallback to Palermo, Buenos Aires
        setUserLocation({lat: -34.5875, lng: -58.4200});
        setIsLoadingLocation(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, [user]);

  const toggleFilter = (filter: string) => {
    if (filter === 'Todos') {
      setSelectedFilters(['Todos']);
    } else {
      const newFilters = selectedFilters.includes(filter)
        ? selectedFilters.filter(f => f !== filter)
        : [...selectedFilters.filter(f => f !== 'Todos'), filter];
      setSelectedFilters(newFilters.length === 0 ? ['Todos'] : newFilters);
    }
  };

  const handleWalkerCardPress = (walkerId: string) => {
    setSelectedWalkerId(walkerId);
    const walker = walkers.find(w => w.id === walkerId);
    if (walker?.latitude && walker?.longitude && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: walker.latitude,
          longitude: walker.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500,
      );
    }
  };

  const handleMarkerPress = (walkerId: string) => {
    setSelectedWalkerId(walkerId);
  };

  const handleWalkerNavigate = (walkerId: string) => {
    navigation.navigate('ProviderProfile', {providerId: walkerId});
  };

  if (isLoadingLocation) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Spinner size="large" />
        <Text variant="body" color="textSecondary" style={styles.loadingText}>
          Obteniendo tu ubicación...
        </Text>
      </View>
    );
  }

  if (!userLocation) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text variant="h3" color="error">
          No se pudo cargar el mapa
        </Text>
        <Text variant="body" color="textSecondary" style={styles.loadingText}>
          Por favor verifica los permisos de ubicación
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map Section - Top 50% */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={{
            latitude: userLocation.lat,
            longitude: userLocation.lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
          toolbarEnabled={true}>
          {/* User Location Circle */}
          <Circle
            center={{
              latitude: userLocation.lat,
              longitude: userLocation.lng,
            }}
            radius={100}
            fillColor="rgba(59, 130, 246, 0.2)"
            strokeColor="rgba(59, 130, 246, 0.5)"
            strokeWidth={1}
          />

          {/* Walker Markers */}
          {walkers
            .filter(w => w.latitude && w.longitude)
            .map(walker => (
              <Marker
                key={walker.id}
                coordinate={{
                  latitude: walker.latitude!,
                  longitude: walker.longitude!,
                }}
                onPress={() => handleMarkerPress(walker.id)}
                pinColor={selectedWalkerId === walker.id ? '#FF6B35' : '#FF8C42'}>
                <View
                  style={[
                    styles.walkerMarkerContainer,
                    selectedWalkerId === walker.id && styles.selectedMarker,
                  ]}>
                  <View style={styles.walkerMarker}>
                    <View
                      style={[
                        styles.walkerMarkerPin,
                        selectedWalkerId === walker.id && styles.selectedMarkerPin,
                      ]}
                    />
                    <View style={styles.walkerMarkerCircle} />
                  </View>
                </View>
              </Marker>
            ))}
        </MapView>
      </View>

      {/* Bottom Panel - Slides up from bottom */}
      <View style={styles.bottomPanel}>
        {/* Pull Handle */}
        <View style={styles.pullHandle}>
          <View style={styles.handleBar} />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          {/* Results Count */}
          <Text style={styles.resultsText}>
            {isLoading
              ? 'Buscando paseadores...'
              : `${walkers.length} paseador${walkers.length !== 1 ? 'es' : ''} encontrado${walkers.length !== 1 ? 's' : ''}`}
          </Text>

          {/* Filter Chips */}
          <FilterChips
            filters={[
              'Todos',
              'Paseo',
              'Cuidado',
              'Hospedaje',
              'Guardería',
              '<2km',
              '<5km',
              '<10km',
              '4.0+ estrellas',
              '4.5+ estrellas',
            ]}
            selectedFilters={selectedFilters}
            onToggleFilter={toggleFilter}
          />

          {/* Loading State */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Spinner size="large" />
            </View>
          )}

          {/* Error State */}
          {isError && (
            <View style={styles.errorContainer}>
              <Text variant="body" color="error" style={styles.errorText}>
                Error al cargar los paseadores
              </Text>
              <Text
                variant="caption"
                color="primary"
                style={styles.retryText}
                onPress={() => refetch()}>
                Reintentar
              </Text>
            </View>
          )}

          {/* Walker Cards */}
          {!isLoading && !isError && (
            <View style={styles.walkersList}>
              {walkers.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text variant="body" color="textSecondary" style={styles.emptyText}>
                    No se encontraron paseadores con los filtros seleccionados
                  </Text>
                  {!selectedFilters.includes('Todos') && (
                    <Text variant="caption" color="textSecondary" style={[styles.emptyText, {marginTop: 8}]}>
                      Intenta remover algunos filtros para ver más resultados
                    </Text>
                  )}
                </View>
              ) : (
                walkers.map(walker => (
                  <WalkerCard
                    key={walker.id}
                    walker={walker}
                    onPress={() => handleWalkerNavigate(walker.id)}
                    isSelected={selectedWalkerId === walker.id}
                  />
                ))
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
