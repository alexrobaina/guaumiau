import React from 'react'
import { View } from 'react-native'
import { Star } from 'lucide-react-native'
import { Text } from '../../atoms/Text'
import { Avatar } from '../../atoms/Avatar'
import { styles } from './styles'
import type { WalkerInfoProps } from './WalkerInfo.types'

export const WalkerInfo: React.FC<WalkerInfoProps> = ({ walker }) => {
  return (
    <View style={styles.container}>
      <Avatar
        source={walker.avatar}
        fallbackText={walker.name}
        size="medium"
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{walker.name}</Text>
        <View style={styles.ratingContainer}>
          <Star size={16} color="#F97316" fill="#F97316" />
          <Text style={styles.rating}>{walker.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({walker.reviews} reseñas)</Text>
        </View>
      </View>
    </View>
  )
}
