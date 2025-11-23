import {StyleSheet} from 'react-native';
import {theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
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
  countryPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  flagText: {
    fontSize: theme.fontSize.xl,
    marginRight: theme.spacing.xs,
  },
  countryCodeText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '80%',
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
  closeButton: {
    padding: theme.spacing.xs,
  },
  closeButtonText: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  searchInput: {
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSize.md,
    backgroundColor: theme.colors.background,
  },
  countryList: {
    paddingBottom: theme.spacing.md,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  countryItemFlag: {
    fontSize: theme.fontSize.xxl,
    marginRight: theme.spacing.md,
  },
  countryItemContent: {
    flex: 1,
  },
  countryItemName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: '500',
  },
  countryItemCode: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});
