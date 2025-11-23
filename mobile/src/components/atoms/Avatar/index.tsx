import React from 'react'
import { Image, View, Text } from 'react-native'
import { styles } from './styles'
import type { AvatarProps } from './Avatar.types'

// Generate deterministic color based on text
const stringToColor = (str: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7B731', '#5F27CD', '#00D2D3', '#FF9FF3', '#54A0FF',
    '#48DBFB', '#1DD1A1', '#FFA502', '#FF6348', '#FF4757',
  ]

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

export const Avatar: React.FC<AvatarProps> = ({ source, fallbackText, size = 'medium', style }) => {
  const [imageError, setImageError] = React.useState(false)
  const sizeStyle = size === 'small' ? styles.small : size === 'large' ? styles.large : styles.medium
  const textSizeStyle = size === 'small' ? styles.smallText : size === 'large' ? styles.largeText : styles.mediumText

  // Determine if we should show fallback
  const shouldShowFallback = !source || source.trim() === '' || imageError

  // Show fallback if no valid source
  if (shouldShowFallback && fallbackText) {
    const initial = fallbackText.charAt(0).toUpperCase()
    const backgroundColor = stringToColor(fallbackText)

    return (
      <View style={[styles.container, sizeStyle, { backgroundColor }, style]}>
        <View style={styles.fallbackContainer}>
          <Text style={[styles.fallbackText, textSizeStyle]}>{initial}</Text>
        </View>
      </View>
    )
  }

  // Show image with error handling
  if (source && source.trim() !== '') {
    return (
      <View style={[styles.container, sizeStyle, style]}>
        <Image
          source={{ uri: source }}
          style={[styles.image, sizeStyle]}
          onError={() => setImageError(true)}
        />
      </View>
    )
  }

  // Fallback for no source and no fallback text
  return (
    <View style={[styles.container, sizeStyle, { backgroundColor: '#D1D5DB' }, style]}>
      <View style={styles.fallbackContainer}>
        <Text style={[styles.fallbackText, textSizeStyle]}>?</Text>
      </View>
    </View>
  )
}
