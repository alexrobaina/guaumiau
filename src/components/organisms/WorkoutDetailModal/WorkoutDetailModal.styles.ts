import { StyleSheet } from 'react-native';
import { Colors } from '@/lib/colors';

export const makeStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.gray[50],
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      paddingTop: 60,
      backgroundColor: Colors.white,
      borderBottomWidth: 1,
      borderBottomColor: Colors.gray[200],
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.gray[900],
    },
    subtitle: {
      fontSize: 16,
      color: Colors.gray[600],
      marginTop: 4,
    },
    closeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: Colors.gray[100],
    },
    content: {
      flex: 1,
      padding: 16,
    },
    summaryCard: {
      backgroundColor: Colors.white,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: Colors.gray[900],
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.gray[900],
      marginBottom: 16,
    },
    summaryStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    summaryStatItem: {
      alignItems: 'center',
    },
    summaryStatValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.primary[600],
      marginBottom: 4,
    },
    summaryStatLabel: {
      fontSize: 12,
      color: Colors.gray[600],
      fontWeight: '500',
    },
    exercisesSection: {
      marginBottom: 16,
    },
    exerciseCard: {
      backgroundColor: Colors.white,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: Colors.gray[900],
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 2,
    },
    exerciseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    exerciseName: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.gray[900],
      flex: 1,
    },
    exerciseStats: {
      backgroundColor: Colors.gray[100],
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    exerciseStat: {
      fontSize: 12,
      color: Colors.gray[600],
      fontWeight: '500',
    },
    setsContainer: {
      gap: 8,
    },
    setItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
    },
    setCompleted: {
      backgroundColor: Colors.green[50],
      borderColor: Colors.green[200],
    },
    setIncomplete: {
      backgroundColor: Colors.gray[50],
      borderColor: Colors.gray[200],
    },
    setNumber: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.gray[700],
      minWidth: 50,
    },
    setDetails: {
      flex: 1,
      flexDirection: 'row',
      gap: 12,
    },
    setDetail: {
      fontSize: 14,
      color: Colors.gray[600],
      backgroundColor: Colors.white,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: Colors.gray[200],
    },
    setStatus: {
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    setStatusCompleted: {
      backgroundColor: Colors.green[100],
    },
    setStatusIncomplete: {
      backgroundColor: Colors.gray[200],
    },
    notesSection: {
      backgroundColor: Colors.white,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: Colors.gray[900],
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    notesText: {
      fontSize: 16,
      color: Colors.gray[700],
      lineHeight: 24,
    },
  });
};