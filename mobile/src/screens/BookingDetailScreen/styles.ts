import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
  },
  // Header Card
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  bookingId: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTimeIcon: {
    marginRight: 12,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  // Status colors
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusTextPending: {
    color: '#92400E',
  },
  statusConfirmed: {
    backgroundColor: '#DBEAFE',
  },
  statusTextConfirmed: {
    color: '#1E40AF',
  },
  statusInProgress: {
    backgroundColor: '#E0E7FF',
  },
  statusTextInProgress: {
    color: '#4338CA',
  },
  statusCompleted: {
    backgroundColor: '#D1FAE5',
  },
  statusTextCompleted: {
    color: '#065F46',
  },
  statusCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusTextCancelled: {
    color: '#991B1B',
  },
  statusRejected: {
    backgroundColor: '#FEE2E2',
  },
  statusTextRejected: {
    color: '#991B1B',
  },
  // Section Cards
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  // User Info
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Pets
  petsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  petIcon: {
    marginRight: 8,
  },
  petName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  // Location
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  locationText: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
  },
  // Instructions
  instructionsText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  noInstructions: {
    fontSize: 15,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  // Price Breakdown
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#F97316',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F97316',
  },
  // Actions
  actionsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    backgroundColor: '#F97316',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  cancelButtonText: {
    color: '#DC2626',
  },
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})
