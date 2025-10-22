import {StyleSheet} from 'react-native';
import {theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    backgroundColor: theme.colors.secondary,
  },
  small: {
    width: 32,
    height: 32,
  },
  medium: {
    width: 48,
    height: 48,
  },
  large: {
    width: 64,
    height: 64,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondary,
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  smallText: {
    fontSize: theme.fontSize.sm,
  },
  mediumText: {
    fontSize: theme.fontSize.lg,
  },
  largeText: {
    fontSize: theme.fontSize.xl,
  },
  onlineIndicator: {
    position: 'absolute',
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
  },
  smallIndicator: {
    width: 10,
    height: 10,
    right: 0,
    bottom: 0,
  },
  mediumIndicator: {
    width: 12,
    height: 12,
    right: 2,
    bottom: 2,
  },
  largeIndicator: {
    width: 16,
    height: 16,
    right: 2,
    bottom: 2,
  },
});
