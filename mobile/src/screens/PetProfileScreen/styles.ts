import { StyleSheet } from 'react-native';
import { theme } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  centerText: {
    textAlign: 'center',
    marginTop: theme.spacing.md,
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

  // Hero Section
  heroContainer: {
    position: 'relative',
    height: 200,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(249, 115, 22, 0.3)',
  },
  headerButtons: {
    position: 'absolute',
    top: theme.spacing.xl + 20, // Moved down (48 + 20 = 68px from top)
    left: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  profilePhotoContainer: {
    position: 'absolute',
    bottom: -60,
    left: '50%',
    marginLeft: -60,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
    ...theme.shadows.lg,
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },

  // Identity Section
  identitySection: {
    marginTop: 70,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  petName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  petBreed: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  genderBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
  },
  maleBadge: {
    backgroundColor: '#3b82f6',
  },
  femaleBadge: {
    backgroundColor: '#ec4899',
  },
  ageBadge: {
    backgroundColor: theme.colors.primary,
  },
  sizeBadge: {
    backgroundColor: '#fdba74',
  },
  badgeWhiteText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  statIcon: {
    marginBottom: 4,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },

  // Card Styles
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  // Info Rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },

  // Subsections
  subsection: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  subsectionTitle: {
    fontWeight: '600',
  },

  // Tags and Badges
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  badgeGreen: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    backgroundColor: '#dcfce7',
  },
  badgeTextGreen: {
    color: '#16a34a',
    fontWeight: '500',
  },
  badgeRed: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    backgroundColor: '#fee2e2',
  },
  badgeTextRed: {
    color: '#dc2626',
    fontWeight: '500',
  },
  badgeOrange: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    backgroundColor: '#fed7aa',
  },
  badgeTextOrange: {
    color: '#ea580c',
    fontWeight: '500',
  },

  // Behavior Grid
  behaviorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  behaviorChip: {
    flex: 1,
    minWidth: '45%',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  behaviorActive: {
    backgroundColor: '#dcfce7',
  },
  behaviorInactive: {
    backgroundColor: '#f3f4f6',
  },
  behaviorActiveText: {
    color: '#16a34a',
    fontWeight: '500',
  },
  behaviorInactiveText: {
    color: theme.colors.textSecondary,
  },

  // Lists
  listContainer: {
    gap: theme.spacing.xs,
  },
  listItem: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  listItemText: {
    flex: 1,
  },

  // Preferences
  preferenceSection: {
    marginTop: theme.spacing.md,
  },
  preferenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  preferenceTitle: {
    fontWeight: '600',
    fontSize: theme.fontSize.sm,
  },

  // Emergency Card
  emergencyCard: {
    borderWidth: 2,
    borderColor: '#fee2e2',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  emergencyClinic: {
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  emergencyVet: {
    marginBottom: theme.spacing.xs,
  },
  emergencyPhone: {
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  emergencyAddress: {
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  emergencyButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  emergencyButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  // Expandable Care Instructions
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  careInstructionsContent: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#fff7ed',
    borderRadius: theme.borderRadius.lg,
  },
  careInstructionsText: {
    lineHeight: 22,
  },

  // Photo Gallery
  photoGallery: {
    marginTop: theme.spacing.md,
  },
  galleryPhoto: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Bottom Action Bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.lg,
  },
  ownerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: theme.spacing.sm,
  },
  ownerName: {
    flex: 1,
    fontSize: theme.fontSize.sm,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  messageButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
