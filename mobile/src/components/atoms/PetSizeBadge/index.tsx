import React, {memo} from 'react';
import {View, Text, StyleProp, ViewStyle} from 'react-native';
import {PetSize} from '@/types/pet.types';
import {styles} from './styles';

interface IPetSizeBadgeProps {
  size: PetSize;
  style?: StyleProp<ViewStyle>;
}

const SIZE_LABELS = {
  [PetSize.EXTRA_SMALL]: 'XS',
  [PetSize.SMALL]: 'S',
  [PetSize.MEDIUM]: 'M',
  [PetSize.LARGE]: 'L',
  [PetSize.EXTRA_LARGE]: 'XL',
};

const SIZE_DESCRIPTIONS = {
  [PetSize.EXTRA_SMALL]: '< 5kg',
  [PetSize.SMALL]: '5-10kg',
  [PetSize.MEDIUM]: '10-25kg',
  [PetSize.LARGE]: '25-45kg',
  [PetSize.EXTRA_LARGE]: '> 45kg',
};

export const PetSizeBadge = memo<IPetSizeBadgeProps>(({size, style}) => {
  const label = SIZE_LABELS[size];
  const description = SIZE_DESCRIPTIONS[size];

  return (
    <View style={[styles.container, styles[size], style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
});
