import { StyleSheet } from 'react-native';
import { theme } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: theme.spacing.xl,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl, // Moved down (48 + 20 = 68px from top)
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
  },
  headerAddButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  petsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100,
  },
  petCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    position: 'relative',
    ...theme.shadows.sm,
  },
  editButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  petCardContent: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  petPhoto: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  petBreed: {
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.sm,
  },
  petDetails: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  petDetailText: {
    fontSize: theme.fontSize.sm,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  badgeGreen: {
    backgroundColor: '#dcfce7',
  },
  badgeBlue: {
    backgroundColor: '#dbeafe',
  },
  badgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: '500',
  },
  badgeTextGreen: {
    color: '#16a34a',
  },
  badgeTextBlue: {
    color: '#2563eb',
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  // Loading, Error, and Empty states
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  centerText: {
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  errorTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorMessage: {
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  retryButton: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    color: theme.colors.surface,
    fontWeight: '600',
  },
  // Modern Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
  },
  illustrationContainer: {
    marginBottom: theme.spacing.xl,
  },
  illustrationCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  illustrationInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationEmoji: {
    fontSize: 64,
  },
  emptyContent: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: theme.spacing.md,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
  },
  featureItem: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  featureEmoji: {
    fontSize: 28,
  },
  featureText: {
    fontSize: theme.fontSize.xs,
    textAlign: 'center',
    maxWidth: 80,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.md,
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontWeight: '700',
    fontSize: theme.fontSize.md,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  addButtonText: {
    color: theme.colors.surface,
    fontWeight: '600',
  },
});
