import type { ViewStyle } from 'react-native'

export interface AvatarProps {
  source?: string
  fallbackText?: string
  size?: 'small' | 'medium' | 'large'
  style?: ViewStyle
}
