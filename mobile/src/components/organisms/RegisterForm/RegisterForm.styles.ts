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
  loginLink: {
    marginTop: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  loginText: {
    color: '#6B7280',
    fontSize: 14,
  },
  loginLinkText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
});
