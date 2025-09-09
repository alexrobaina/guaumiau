import { StyleSheet } from 'react-native';
import { Colors } from '@/lib/colors';

export const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.white,
    },
    safeArea: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 16,
    },
    progressContainer: {
      marginBottom: 24,
    },
    progressBar: {
      height: 4,
      backgroundColor: Colors.gray[200],
      borderRadius: 2,
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: Colors.primary[500],
      borderRadius: 2,
    },
    progressText: {
      textAlign: 'center',
      fontSize: 12,
      color: Colors.gray[600],
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    titleContainer: {
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: Colors.gray[900],
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: Colors.gray[600],
      textAlign: 'center',
      lineHeight: 24,
    },
    scrollContent: {
      flexGrow: 1,
    },
    buttonContainer: {
      paddingHorizontal: 24,
      paddingBottom: 34,
      paddingTop: 16,
      backgroundColor: Colors.white,
      borderTopWidth: 1,
      borderTopColor: Colors.gray[200],
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
    },
    previousButton: {
      flex: 1,
    },
    nextButton: {
      flex: 2,
    },
  });