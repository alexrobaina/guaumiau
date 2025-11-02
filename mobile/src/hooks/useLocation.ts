import { useState, useEffect, useCallback } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface UseLocationReturn {
  location: LocationCoordinates | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<LocationCoordinates | null>;
  hasPermission: boolean | null;
}

/**
 * Custom hook to handle device geolocation with permissions
 *
 * @param autoRequest - Whether to automatically request location on mount
 * @returns Location data, loading state, error, and request function
 */
export const useLocation = (autoRequest = false): UseLocationReturn => {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  /**
   * Request location permission on Android
   */
  const requestAndroidPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso de ubicación',
          message:
            'GuauMiau necesita acceso a tu ubicación para mostrarte paseadores cerca de ti.',
          buttonNeutral: 'Preguntar luego',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Aceptar',
        },
      );

      const permissionGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
      setHasPermission(permissionGranted);
      return permissionGranted;
    } catch (err) {
      console.error('Error requesting Android location permission:', err);
      setHasPermission(false);
      return false;
    }
  }, []);

  /**
   * Request current device location
   */
  const requestLocation = useCallback(async (): Promise<LocationCoordinates | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Request permission first (Android only, iOS handled via Info.plist)
      if (Platform.OS === 'android') {
        const hasAndroidPermission = await requestAndroidPermission();
        if (!hasAndroidPermission) {
          setError('Se requiere permiso de ubicación');
          setIsLoading(false);
          return null;
        }
      }

      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            const coords: LocationCoordinates = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            };

            setLocation(coords);
            setIsLoading(false);
            setHasPermission(true);
            resolve(coords);
          },
          positionError => {
            let errorMessage = 'No se pudo obtener la ubicación';

            switch (positionError.code) {
              case 1: // PERMISSION_DENIED
                errorMessage = 'Permiso de ubicación denegado';
                setHasPermission(false);
                break;
              case 2: // POSITION_UNAVAILABLE
                errorMessage = 'Ubicación no disponible';
                break;
              case 3: // TIMEOUT
                errorMessage = 'Tiempo de espera agotado';
                break;
            }

            setError(errorMessage);
            setIsLoading(false);
            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          },
        );
      });
    } catch (err) {
      const errorMessage = 'Error al obtener la ubicación';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, [requestAndroidPermission]);

  /**
   * Auto-request location on mount if enabled
   */
  useEffect(() => {
    if (autoRequest) {
      requestLocation().catch(console.error);
    }
  }, [autoRequest, requestLocation]);

  return {
    location,
    isLoading,
    error,
    requestLocation,
    hasPermission,
  };
};

/**
 * Show alert to prompt user to enable location services
 */
export const showLocationPermissionAlert = (): void => {
  Alert.alert(
    'Ubicación desactivada',
    'Para mostrarte paseadores cerca de ti, necesitamos acceso a tu ubicación. Por favor, activa los servicios de ubicación en la configuración de tu dispositivo.',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Ir a configuración',
        onPress: () => {
          // On iOS, you can open Settings app
          if (Platform.OS === 'ios') {
            // Linking.openSettings(); // Uncomment if you want to open settings
          }
        },
      },
    ],
  );
};
