import { StyleSheet } from 'react-native';
import { Colors } from '@/lib/colors';
import { InputVariant, InputSize } from './Input.types';

export const makeStyles = () => StyleSheet.create({
  base: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    color: Colors.gray[900],
    fontSize: 16,
    fontWeight: 'normal',
    width: '100%',
  },

  // Variant styles
  default: {
    borderColor: Colors.gray[300],
  },

  error: {
    borderColor: Colors.error,
  },

  success: {
    borderColor: Colors.success,
  },

  // Size styles
  sm: {
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  md: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  lg: {
    fontSize: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});

export const getPlaceholderTextColor = (error?: string | boolean) => {
  if (error) return Colors.error;
  return Colors.gray[400];
};