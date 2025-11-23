import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Star, MapPin, CheckCircle} from 'lucide-react-native';
import {Text, Spacer} from '@/components';
import {Avatar} from '@components/atoms/Avatar';
import {theme} from '@/theme';
import {Walker} from './types';

interface WalkerCardProps {
  walker: Walker;
  onPress?: () => void;
  isSelected?: boolean;
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  DOG_WALKING: 'Paseo',
  DOG_RUNNING: 'Running',
  DOG_SITTING: 'Cuidado Perros',
  CAT_SITTING: 'Cuidado Gatos',
  PET_SITTING: 'Cuidado',
  DOG_BOARDING: 'Hospedaje Perros',
  CAT_BOARDING: 'Hospedaje Gatos',
  PET_BOARDING: 'Hospedaje',
  DOG_DAYCARE: 'Guardería',
  PET_DAYCARE: 'Guardería',
  HOME_VISITS: 'Visitas',
  PET_TAXI: 'Taxi',
}

export function WalkerCard({walker, onPress, isSelected}: WalkerCardProps) {
  const provider = walker.serviceProvider
  const fullName = `${walker.firstName} ${walker.lastName}`
  const rating = provider?.averageRating || 0
  const reviews = provider?.totalReviews || 0
  const services = provider?.services || []
  const minPrice = services.length > 0 ? Math.min(...services.map(s => s.basePrice)) : 0
  const distance = walker.distance !== undefined && walker.distance !== null
    ? `${walker.distance.toFixed(1)} km`
    : null

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.container}>
        {/* Photo */}
        <Avatar
          source={walker.avatar}
          fallbackText={walker.firstName}
          size="large"
          style={styles.photo}
        />

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.header}>
            <View style={styles.nameContainer}>
              <Text variant="h3" style={styles.name} numberOfLines={1}>
                {fullName}
              </Text>
              {provider?.isVerified && (
                <>
                  <Spacer size="xs" horizontal />
                  <CheckCircle size={16} color={theme.colors.success} fill={theme.colors.success} />
                </>
              )}
            </View>
            <Text variant="h3" color="primary" style={styles.price}>
              ${minPrice}
            </Text>
          </View>

          {/* Rating */}
          {rating > 0 && (
            <View style={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  color={i < Math.floor(rating) ? theme.colors.warning : theme.colors.border}
                  fill={i < Math.floor(rating) ? theme.colors.warning : 'transparent'}
                />
              ))}
              <Spacer size="xs" horizontal />
              <Text variant="caption" color="textSecondary">
                {rating.toFixed(1)} ({reviews})
              </Text>
            </View>
          )}

          <Spacer size="xs" />

          {/* Services */}
          {services.length > 0 && (
            <View style={styles.services}>
              {services.slice(0, 3).map(service => (
                <View key={service.id} style={styles.serviceBadge}>
                  <Text variant="caption" style={styles.serviceText}>
                    {SERVICE_TYPE_LABELS[service.serviceType] || service.serviceType}
                  </Text>
                </View>
              ))}
              {services.length > 3 && (
                <View style={styles.serviceBadge}>
                  <Text variant="caption" style={styles.serviceText}>
                    +{services.length - 3}
                  </Text>
                </View>
              )}
            </View>
          )}

          <Spacer size="xs" />

          {/* Distance */}
          {distance && (
            <View style={styles.distance}>
              <MapPin size={14} color={theme.colors.textSecondary} />
              <Spacer size="xs" horizontal />
              <Text variant="caption" color="textSecondary">
                {distance}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  container: {
    flexDirection: 'row',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: theme.colors.border,
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  name: {
    flex: 1,
  },
  price: {
    fontWeight: 'bold',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  serviceBadge: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
