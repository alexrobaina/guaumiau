import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
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
  // User info
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  // Pets
  petsSection: {
    marginBottom: 12,
  },
  petsLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  petsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  petTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  petName: {
    fontSize: 12,
    color: '#374151',
  },
  // Location
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    marginRight: 6,
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
  },
  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F97316',
  },
  viewButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})
