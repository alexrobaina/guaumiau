import { theme } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginBottom: theme.spacing.sm,
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
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  checkboxLinkText: {
    color: '#2563EB',
    fontWeight: '600',
  },
});
