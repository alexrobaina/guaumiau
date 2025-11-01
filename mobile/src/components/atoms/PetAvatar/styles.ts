import {StyleSheet} from 'react-native';
import {theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 999, // Fully rounded
    overflow: 'hidden',
  },
  iconContainer: {
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  small: {
    width: 40,
    height: 40,
  },
  medium: {
    width: 56,
    height: 56,
  },
  large: {
    width: 80,
    height: 80,
  },
  xlarge: {
    width: 120,
    height: 120,
  },
});
