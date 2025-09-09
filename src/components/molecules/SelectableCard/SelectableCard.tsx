import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/atoms';
import { SelectableCardProps } from './SelectableCard.types';
import { makeStyles } from './SelectableCard.styles';

export const SelectableCard: React.FC<SelectableCardProps> = ({
  title,
  description,
  icon,
  selected,
  onSelect,
  style,
  disabled = false,
}) => {
  const styles = makeStyles();

  return (
    <Pressable
      style={[
        styles.card,
        selected ? styles.cardSelected : styles.cardDefault,
        disabled && styles.cardDisabled,
        style,
      ]}
      onPress={disabled ? undefined : onSelect}
      disabled={disabled}
    >
      <View style={styles.content}>
        {icon && (
          <View style={[
            styles.iconContainer,
            selected && styles.iconContainerSelected,
          ]}>
            {icon}
          </View>
        )}
        
        <View style={styles.textContainer}>
          <Text style={[
            styles.title,
            selected && styles.titleSelected,
          ]}>
            {title}
          </Text>
          {description && (
            <Text style={[
              styles.description,
              selected && styles.descriptionSelected,
            ]}>
              {description}
            </Text>
          )}
        </View>

        <View style={[
          styles.checkContainer,
          selected && styles.checkContainerSelected,
        ]}>
          {selected && <View style={styles.checkMark} />}
        </View>
      </View>
    </Pressable>
  );
};