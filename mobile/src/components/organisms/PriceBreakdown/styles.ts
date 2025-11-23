import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#F97316',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  itemsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  itemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flexShrink: 0,
    minWidth: 70,
    textAlign: 'right',
  },
  divider: {
    height: 2,
    backgroundColor: '#FDBA74',
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  totalLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F97316',
    flexShrink: 0,
    textAlign: 'right',
  },
})
