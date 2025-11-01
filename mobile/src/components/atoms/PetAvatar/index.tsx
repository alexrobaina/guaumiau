import React, {memo} from 'react';
import {View, Image, StyleProp, ViewStyle} from 'react-native';
import {Dog, Cat, Bird, Rabbit, Fish} from 'lucide-react-native';
import {PetType} from '@/types/pet.types';
import {styles} from './styles';

interface IPetAvatarProps {
  photoUrl?: string | null;
  petType: PetType;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_PET_ICONS = {
  [PetType.DOG]: Dog,
  [PetType.CAT]: Cat,
  [PetType.BIRD]: Bird,
  [PetType.RABBIT]: Rabbit,
  [PetType.FISH]: Fish,
  [PetType.HAMSTER]: Rabbit, // Using rabbit as fallback
  [PetType.REPTILE]: Fish, // Using fish as fallback
  [PetType.OTHER]: Dog, // Using dog as fallback
};

export const PetAvatar = memo<IPetAvatarProps>(
  ({photoUrl, petType, size = 'medium', style}) => {
    const Icon = DEFAULT_PET_ICONS[petType];
    const sizeStyle = styles[size];
    const iconSize = size === 'small' ? 20 : size === 'medium' ? 28 : size === 'large' ? 36 : 48;

    if (photoUrl) {
      return (
        <View style={[styles.container, sizeStyle, style]}>
          <Image source={{uri: photoUrl}} style={styles.image} />
        </View>
      );
    }

    return (
      <View style={[styles.container, styles.iconContainer, sizeStyle, style]}>
        <Icon size={iconSize} color="#FFFFFF" />
      </View>
    );
  },
);
