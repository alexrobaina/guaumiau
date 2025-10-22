import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginBottom: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  successContainer: {
    padding: 12,
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    marginBottom: 8,
  },
  successText: {
    color: '#059669',
    fontSize: 14,
  },
  backToLogin: {
    marginTop: 8,
    alignItems: 'center',
  },
  backToLoginText: {
    color: '#6B7280',
    fontSize: 14,
  },
  description: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});
