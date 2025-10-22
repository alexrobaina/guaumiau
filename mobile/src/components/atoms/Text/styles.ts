import {StyleSheet} from 'react-native';
import {theme} from '@/theme';

export const styles = StyleSheet.create({
  h1: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h3: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'normal',
    lineHeight: 24,
  },
  caption: {
    fontSize: theme.fontSize.sm,
    fontWeight: 'normal',
    lineHeight: 16,
  },
  primary: {
    color: theme.colors.primary,
  },
  secondary: {
    color: theme.colors.secondary,
  },
  text: {
    color: theme.colors.text,
  },
  textSecondary: {
    color: theme.colors.textSecondary,
  },
  error: {
    color: theme.colors.error,
  },
  success: {
    color: theme.colors.success,
  },
  warning: {
    color: theme.colors.warning,
  },
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
});
