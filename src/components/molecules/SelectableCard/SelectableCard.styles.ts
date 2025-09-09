import { StyleSheet } from 'react-native';
import { Colors } from '@/lib/colors';

export const makeStyles = () =>
  StyleSheet.create({
    card: {
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      backgroundColor: Colors.white,
      marginBottom: 12,
    },
    cardDefault: {
      borderColor: Colors.gray[200],
    },
    cardSelected: {
      borderColor: Colors.primary[500],
      backgroundColor: Colors.primary[50],
    },
    cardDisabled: {
      opacity: 0.5,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      marginRight: 12,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: Colors.gray[100],
    },
    iconContainerSelected: {
      backgroundColor: Colors.primary[100],
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.gray[900],
      marginBottom: 2,
    },
    titleSelected: {
      color: Colors.primary[700],
    },
    description: {
      fontSize: 14,
      color: Colors.gray[600],
      lineHeight: 20,
    },
    descriptionSelected: {
      color: Colors.primary[600],
    },
    checkContainer: {
      marginLeft: 12,
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: Colors.gray[300],
      backgroundColor: Colors.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkContainerSelected: {
      borderColor: Colors.primary[500],
      backgroundColor: Colors.primary[500],
    },
    checkMark: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: Colors.white,
    },
  });