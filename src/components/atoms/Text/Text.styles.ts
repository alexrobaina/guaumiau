import { StyleSheet } from 'react-native';
import { Colors } from '@/lib/colors';

export const makeStyles = () => StyleSheet.create({
  base: {
    fontFamily: 'System', // Use platform default
  },

  // Typography variants
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },

  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
  },

  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },

  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },

  body: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
  },

  caption: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },

  // Color variants
  defaultColor: {
    color: Colors.gray[900],
  },

  primaryColor: {
    color: Colors.primary[500],
  },

  secondaryColor: {
    color: Colors.secondary[500],
  },

  tertiaryColor: {
    color: Colors.tertiary[500],
  },

  mutedColor: {
    color: Colors.gray[500],
  },

  errorColor: {
    color: Colors.error,
  },

  successColor: {
    color: Colors.success,
  },
});