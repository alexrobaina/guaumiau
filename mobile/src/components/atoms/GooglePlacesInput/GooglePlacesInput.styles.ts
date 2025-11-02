import {StyleSheet} from 'react-native';
import {theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 1,
    minHeight: 44,
    marginBottom: 8,
  },
  textInputContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
  },
  textInputFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  textInputError: {
    borderColor: theme.colors.error,
  },
  textInputDisabled: {
    backgroundColor: theme.colors.background,
    opacity: 0.6,
  },
  listView: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    ...theme.shadows.md,
  },
  row: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  loader: {
    marginTop: theme.spacing.sm,
  },
  poweredContainer: {
    paddingVertical: theme.spacing.xs,
    alignItems: 'center',
  },
});
