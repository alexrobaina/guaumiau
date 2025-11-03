import React, {useState, useEffect, useRef, useMemo} from 'react';
import {View, ScrollView, Platform, Alert} from 'react-native';
import MapView, {Marker, Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {Text, Spinner} from '@/components';
import {FilterChips} from './FilterChips';
import {WalkerCard} from './WalkerCard';
import {styles} from './styles';
import {Walker, UserLocation} from './types';
import {theme} from '@/theme';

// Generate mock walkers around user location
const generateMockWalkers = (userLat: number, userLng: number): Walker[] => {
  const walkerTemplates = [
    {
      id: 1,
      name: 'María González',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 4.9,
      reviews: 127,
      experience: '5 años de experiencia',
      services: ['Paseo de perros', 'Cuidado de mascotas'],
      price: 1500,
      distance: '0.8 km',
      offsetLat: 0.005,
      offsetLng: 0.003,
    },
    {
      id: 2,
      name: 'Carlos Mendoza',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 4.8,
      reviews: 95,
      experience: '3 años de experiencia',
      services: ['Paseo de perros'],
      price: 1200,
      distance: '1.2 km',
      offsetLat: -0.008,
      offsetLng: 0.006,
    },
    {
      id: 3,
      name: 'Laura Fernández',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      rating: 5.0,
      reviews: 203,
      experience: '7 años de experiencia',
      services: ['Paseo de perros', 'Cuidado de mascotas', 'Baño y peluquería'],
      price: 2000,
      distance: '1.5 km',
      offsetLat: 0.003,
      offsetLng: -0.009,
    },
    {
      id: 4,
      name: 'Diego Ramírez',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      rating: 4.7,
      reviews: 78,
      experience: '4 años de experiencia',
      services: ['Paseo de perros', 'Cuidado de mascotas'],
      price: 1400,
      distance: '1.8 km',
      offsetLat: -0.006,
      offsetLng: -0.005,
    },
  ];

  return walkerTemplates.map(template => ({
    id: template.id,
    name: template.name,
    photo: template.photo,
    rating: template.rating,
    reviews: template.reviews,
    experience: template.experience,
    services: template.services,
    price: template.price,
    distance: template.distance,
    lat: userLat + template.offsetLat,
    lng: userLng + template.offsetLng,
  }));
};

export function SearchWalkersScreen() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['Todos']);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [selectedWalkerId, setSelectedWalkerId] = useState<number | null>(null);
  const mapRef = useRef<MapView>(null);

  // Generate walkers around user location
  const mockWalkers = useMemo(() => {
    if (!userLocation) return [];
    return generateMockWalkers(userLocation.lat, userLocation.lng);
  }, [userLocation]);

  // Get user's current location
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setUserLocation({lat: latitude, lng: longitude});
        setIsLoadingLocation(false);
      },
      error => {
        console.error('Error getting location:', error);
        Alert.alert(
          'Error de ubicación',
          'No se pudo obtener tu ubicación. Usando ubicación predeterminada.',
        );
        // Fallback to default location (Buenos Aires, Argentina)
        setUserLocation({lat: -34.6037, lng: -58.3816});
        setIsLoadingLocation(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

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

  const handleWalkerCardPress = (walkerId: number) => {
    setSelectedWalkerId(walkerId);
    const walker = mockWalkers.find(w => w.id === walkerId);
    if (walker && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: walker.lat,
          longitude: walker.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500,
      );
    }
  };

  const handleMarkerPress = (walkerId: number) => {
    setSelectedWalkerId(walkerId);
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
          {mockWalkers.map(walker => (
            <Marker
              key={walker.id}
              coordinate={{
                latitude: walker.lat,
                longitude: walker.lng,
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
            {mockWalkers.length} paseadores encontrados
          </Text>

          {/* Filter Chips */}
          <FilterChips
            filters={['Todos', 'Paseador', 'Cuidador', '<2km', '4.5+ estrellas']}
            selectedFilters={selectedFilters}
            onToggleFilter={toggleFilter}
          />

          {/* Walker Cards */}
          <View style={styles.walkersList}>
            {mockWalkers.map(walker => (
              <WalkerCard
                key={walker.id}
                walker={walker}
                onPress={() => handleWalkerCardPress(walker.id)}
                isSelected={selectedWalkerId === walker.id}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
