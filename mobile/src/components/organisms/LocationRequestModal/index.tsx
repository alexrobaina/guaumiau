import React, {memo, useState} from 'react';
import {View, Text, Modal} from 'react-native';
import {MapPin, X} from 'lucide-react-native';
import {Button} from '@components/atoms/Button';
import {GooglePlacesInput} from '@components/atoms/GooglePlacesInput';
import {IGooglePlaceData, IGooglePlaceDetails} from '@components/atoms/GooglePlacesInput/GooglePlacesInput.types';
import {styles} from './styles';
import {theme} from '@/theme';

interface ILocationRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelected: (address: string, latitude: number, longitude: number, city?: string, country?: string) => void;
}

export const LocationRequestModal = memo<ILocationRequestModalProps>(
  ({visible, onClose, onLocationSelected}) => {
    const [address, setAddress] = useState('');

    const handlePlaceSelected = (prediction: IGooglePlaceData, details: IGooglePlaceDetails | null) => {
      if (details && details.geometry && details.geometry.location) {
        const {lat, lng} = details.geometry.location;

        // Extract city and country from address components
        let city = '';
        let country = '';

        if (details.address_components) {
          const cityComponent = details.address_components.find((component) =>
            component.types.includes('locality') || component.types.includes('administrative_area_level_2')
          );
          const countryComponent = details.address_components.find((component) =>
            component.types.includes('country')
          );

          city = cityComponent?.long_name || '';
          country = countryComponent?.short_name || 'AR'; // Default to Argentina
        }

        setAddress(prediction.description);
        onLocationSelected(prediction.description, lat, lng, city, country);
      }
    };

    const handleClose = () => {
      setAddress('');
      onClose();
    };

    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.iconContainer}>
                  <MapPin size={24} color={theme.colors.primary} />
                </View>
                <View>
                  <Text style={styles.title}>Ubicación requerida</Text>
                  <Text style={styles.subtitle}>Para mostrarte paseadores cercanos</Text>
                </View>
              </View>
              <Button
                onPress={handleClose}
                variant="ghost"
                size="small"
                style={styles.closeButton}
              >
                <X size={24} color={theme.colors.textSecondary} />
              </Button>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.label}>Ingresa tu dirección</Text>
              <GooglePlacesInput
                placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
                value={address}
                onChangeText={setAddress}
                onPlaceSelected={handlePlaceSelected}
              />
              <Text style={styles.hint}>
                Usaremos tu ubicación para mostrarte paseadores y cuidadores cerca de ti
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Button
                title="Cancelar"
                onPress={handleClose}
                variant="outline"
                style={styles.cancelButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  },
);
