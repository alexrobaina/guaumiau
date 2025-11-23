import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  scrollView: {
    flexDirection: 'row',
  },
  methodCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodCardSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  iconContainer: {
    marginBottom: 8,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  methodNameSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
})
