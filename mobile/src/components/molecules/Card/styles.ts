import { StyleSheet } from 'react-native';
import { theme } from '@/theme';

export const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  padding_none: {
    padding: 0,
  },
  padding_small: {
    padding: theme.spacing.sm,
  },
  padding_medium: {
    padding: theme.spacing.md,
  },
  padding_large: {
    padding: theme.spacing.lg,
  },
  shadow_small: {
    ...theme.shadows.sm,
  },
  shadow_medium: {
    ...theme.shadows.md,
  },
  shadow_large: {
    ...theme.shadows.lg,
  },
  border: {
    borderColor: theme.colors.border,
  },
});
