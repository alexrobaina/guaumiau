import React, {memo} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import {MapPin, Star, Dog, Cat, Home, Footprints} from 'lucide-react-native';
import {Button} from '@components/atoms/Button';
import {styles} from './styles';
import {theme} from '@/theme';

interface IWalkerCardProps {
  id: string;
  name: string;
  avatar: string;
  distance: string;
  rating: number;
  reviews: number;
  price: number;
  available: boolean;
  servicesOffered: string[];
  onPress: (id: string) => void;
  onReservePress?: (id: string) => void;
  testID?: string;
}

export const WalkerCard = memo<IWalkerCardProps>(
  ({id, name, avatar, distance, rating, reviews, price, available, servicesOffered, onPress, onReservePress, testID}) => {
    // Helper to render service icons
    const renderServiceIcons = () => {
      const icons = [];

      // Dog walking/running
      if (servicesOffered.some(s => s.includes('DOG_WALKING') || s.includes('DOG_RUNNING'))) {
        icons.push(
          <View key="dog-walk" style={styles.serviceIcon}>
            <Footprints size={16} color={theme.colors.primary} />
          </View>
        );
      }

      // Dog care (sitting, boarding, daycare)
      if (servicesOffered.some(s => s.includes('DOG_SITTING') || s.includes('DOG_BOARDING') || s.includes('DOG_DAYCARE'))) {
        icons.push(
          <View key="dog" style={styles.serviceIcon}>
            <Dog size={16} color={theme.colors.primary} />
          </View>
        );
      }

      // Cat care
      if (servicesOffered.some(s => s.includes('CAT'))) {
        icons.push(
          <View key="cat" style={styles.serviceIcon}>
            <Cat size={16} color={theme.colors.primary} />
          </View>
        );
      }

      // Home visits or pet sitting
      if (servicesOffered.some(s => s.includes('HOME_VISITS') || s.includes('PET_SITTING'))) {
        icons.push(
          <View key="home" style={styles.serviceIcon}>
            <Home size={16} color={theme.colors.primary} />
          </View>
        );
      }

      return icons;
    };

    const handleReserve = () => {
      if (onReservePress) {
        onReservePress(id);
      } else {
        onPress(id);
      }
    };

    return (
      <TouchableOpacity
        style={styles.container}
        testID={testID}
        onPress={() => onPress(id)}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <Image source={{uri: avatar}} style={styles.avatar} />
          <View style={styles.info}>
            <View style={styles.header}>
              <Text style={styles.name}>{name}</Text>
              <View style={available ? styles.availableBadge : styles.unavailableBadge}>
                <Text style={available ? styles.availableText : styles.unavailableText}>
                  {available ? 'Disponible' : 'No disponible'}
                </Text>
              </View>
            </View>

            {/* Service Icons */}
            {servicesOffered && servicesOffered.length > 0 && (
              <View style={styles.servicesContainer}>
                {renderServiceIcons()}
              </View>
            )}

            <View style={styles.details}>
              <View style={styles.detailItem}>
                <MapPin size={14} color={theme.colors.textSecondary} />
                <Text style={styles.distance}>{distance}</Text>
              </View>
              <View style={styles.detailItem}>
                <Star size={14} color={theme.colors.warning} fill={theme.colors.warning} />
                <Text style={styles.rating}>{rating}</Text>
                <Text style={styles.reviews}>({reviews})</Text>
              </View>
            </View>
            <View style={styles.footer}>
              <Text style={styles.price}>${price}/hr</Text>
              <Button
                title="Reservar"
                onPress={handleReserve}
                variant="primary"
                size="small"
                style={styles.button}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);
