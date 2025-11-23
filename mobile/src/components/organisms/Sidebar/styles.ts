import { theme } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingTop: theme.spacing.xxl + 30, // Extra padding for status bar
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  brandText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  menu: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  itemActive: {
    backgroundColor: `${theme.colors.primary}15`,
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginLeft: theme.spacing.md,
    fontSize: 16,
  },
  labelActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  logoutLabel: {
    marginLeft: theme.spacing.md,
    fontSize: 16,
  },
});
