import {StyleSheet} from 'react-native';
import {theme} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  EXTRA_SMALL: {
    backgroundColor: '#10B981', // Green
  },
  SMALL: {
    backgroundColor: '#3B82F6', // Blue
  },
  MEDIUM: {
    backgroundColor: '#F59E0B', // Orange
  },
  LARGE: {
    backgroundColor: '#EF4444', // Red
  },
  EXTRA_LARGE: {
    backgroundColor: '#7C3AED', // Purple
  },
});
