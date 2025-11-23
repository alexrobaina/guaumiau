import { StyleSheet } from 'react-native';
import { theme } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  phoneContainer: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
  },
  phoneContainerFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  phoneContainerError: {
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  phoneContainerDisabled: {
    backgroundColor: theme.colors.background,
    opacity: 0.6,
  },
  textContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: 44,
  },
  textInput: {
    height: 44,
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  codeText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    height: 44,
    lineHeight: 44,
    paddingTop: 0,
    paddingBottom: 0,
  },
  flagButton: {
    backgroundColor: 'transparent',
    width: 50,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
