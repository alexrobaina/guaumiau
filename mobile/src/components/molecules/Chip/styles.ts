import {StyleSheet} from 'react-native';
import {theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: theme.colors.background,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  leftIcon: {
    marginRight: theme.spacing.xs,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: '500',
  },
  defaultLabel: {
    color: theme.colors.text,
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  secondaryLabel: {
    color: '#FFFFFF',
  },
  outlinedLabel: {
    color: theme.colors.text,
  },
  closeButton: {
    marginLeft: theme.spacing.xs,
    padding: theme.spacing.xs,
  },
  closeIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.textSecondary,
  },
});
