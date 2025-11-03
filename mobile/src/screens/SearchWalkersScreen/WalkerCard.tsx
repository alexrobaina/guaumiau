import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Star, MapPin} from 'lucide-react-native';
import {Text, Spacer} from '@/components';
import {theme} from '@/theme';
import {Walker} from './types';

interface WalkerCardProps {
  walker: Walker;
  onPress?: () => void;
  isSelected?: boolean;
}

export function WalkerCard({walker, onPress, isSelected}: WalkerCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.container}>
        {/* Photo */}
        <Image source={{uri: walker.photo}} style={styles.photo} />

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.header}>
            <Text variant="h3" style={styles.name} numberOfLines={1}>
              {walker.name}
            </Text>
            <Text variant="h3" color="primary" style={styles.price}>
              ${walker.price}
            </Text>
          </View>

          {/* Rating */}
          <View style={styles.rating}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                color={i < Math.floor(walker.rating) ? theme.colors.warning : theme.colors.border}
                fill={i < Math.floor(walker.rating) ? theme.colors.warning : 'transparent'}
              />
            ))}
            <Spacer size="xs" horizontal />
            <Text variant="caption" color="textSecondary">
              {walker.rating} ({walker.reviews})
            </Text>
          </View>

          <Spacer size="xs" />

          {/* Experience */}
          <Text variant="caption" color="textSecondary">
            {walker.experience}
          </Text>

          <Spacer size="xs" />

          {/* Services */}
          <View style={styles.services}>
            {walker.services.map(service => (
              <View key={service} style={styles.serviceBadge}>
                <Text variant="caption" style={styles.serviceText}>
                  {service}
                </Text>
              </View>
            ))}
          </View>

          <Spacer size="xs" />

          {/* Distance */}
          <View style={styles.distance}>
            <MapPin size={14} color={theme.colors.textSecondary} />
            <Spacer size="xs" horizontal />
            <Text variant="caption" color="textSecondary">
              {walker.distance} away
            </Text>
          </View>
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
  name: {
    flex: 1,
    marginRight: 8,
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
