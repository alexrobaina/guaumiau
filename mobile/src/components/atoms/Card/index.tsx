import React from 'react'
import { View } from 'react-native'
import { styles } from './styles'
import type { CardProps } from './Card.types'

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>
}
