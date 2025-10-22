import {StyleSheet} from 'react-native';
import {theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    height: 44,
  },
  searchContainerFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
  },
  clearButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  cancelButton: {
    marginLeft: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  cancelText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary,
    fontWeight: '500',
  },
});
