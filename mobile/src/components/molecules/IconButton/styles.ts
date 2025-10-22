import {StyleSheet} from 'react-native';
import {theme} from '@/theme';

export const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  small: {
    width: 32,
    height: 32,
  },
  medium: {
    width: 44,
    height: 44,
  },
  large: {
    width: 56,
    height: 56,
  },
  circular: {
    borderRadius: theme.borderRadius.full,
  },
  disabled: {
    opacity: 0.5,
  },
});
