import {StyleSheet} from 'react-native';
import {theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    height: 44,
  },
  focused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: theme.colors.error,
  },
  disabled: {
    backgroundColor: theme.colors.background,
    opacity: 0.6,
  },
  selectedText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    flex: 1,
  },
  placeholderText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  iconContainer: {
    marginLeft: theme.spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    width: '80%',
    maxHeight: '60%',
    ...theme.shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.text,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  optionItemSelected: {
    backgroundColor: theme.colors.background,
  },
  optionText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
