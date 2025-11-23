import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { styles } from './styles'
import type { SpinnerProps } from './Spinner.types'

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'large', 
  color = '#007AFF', 
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}
