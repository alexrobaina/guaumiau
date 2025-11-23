import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  servicesContainer: {
    gap: 12,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  serviceCardSelected: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  serviceName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    lineHeight: 20,
  },
  serviceNameSelected: {
    fontWeight: '600',
    color: '#F97316',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flexShrink: 0,
    minWidth: 80,
    textAlign: 'right',
  },
  servicePriceSelected: {
    color: '#F97316',
  },
})
