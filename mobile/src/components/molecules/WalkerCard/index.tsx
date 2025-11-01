import React, {memo} from 'react';
import {View, Image, Text} from 'react-native';
import {MapPin, Star} from 'lucide-react-native';
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
  onPress: (id: string) => void;
  testID?: string;
}

export const WalkerCard = memo<IWalkerCardProps>(
  ({id, name, avatar, distance, rating, reviews, price, available, onPress, testID}) => {
    return (
      <View style={styles.container} testID={testID}>
        <View style={styles.content}>
          <Image source={{uri: avatar}} style={styles.avatar} />
          <View style={styles.info}>
            <View style={styles.header}>
              <Text style={styles.name}>{name}</Text>
              {available && (
                <View style={styles.availableBadge}>
                  <Text style={styles.availableText}>Disponible</Text>
                </View>
              )}
            </View>
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
                onPress={() => onPress(id)}
                variant="primary"
                size="small"
                style={styles.button}
              />
            </View>
          </View>
        </View>
      </View>
    );
  },
);
