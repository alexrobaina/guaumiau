import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text } from '../../atoms/Text'
import { Avatar } from '../../atoms/Avatar'
import { styles } from './styles'
import type { PetSelectorProps } from './PetSelector.types'

export const PetSelector: React.FC<PetSelectorProps> = ({
  label,
  pets,
  selectedPetIds,
  onTogglePet,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.petsContainer}>
        {pets.map((pet) => {
          const isSelected = selectedPetIds.includes(pet.id)
          return (
            <TouchableOpacity
              key={pet.id}
              style={[styles.petCard, isSelected && styles.petCardSelected]}
              onPress={() => onTogglePet(pet.id)}
              activeOpacity={0.7}
            >
              <Avatar
                source={pet.image}
                fallbackText={pet.name}
                size="small"
                style={styles.petImage}
              />
              <Text style={[styles.petName, isSelected && styles.petNameSelected]} numberOfLines={1}>
                {pet.name}
              </Text>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <View style={styles.checkboxInner} />}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
