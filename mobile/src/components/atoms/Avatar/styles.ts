import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    borderRadius: 9999,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  small: {
    width: 40,
    height: 40,
  },
  medium: {
    width: 64,
    height: 64,
  },
  large: {
    width: 96,
    height: 96,
  },
  smallText: {
    fontSize: 16,
  },
  mediumText: {
    fontSize: 24,
  },
  largeText: {
    fontSize: 36,
  },
})
