import { StyleSheet } from 'react-native';
import { Colors } from '@/lib/colors';

export const makeStyles = () => {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: Colors.gray[50],
    },
    container: {
      flex: 1,
      backgroundColor: Colors.gray[50],
    },
    content: {
      flex: 1,
      backgroundColor: Colors.gray[50],
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.gray[50],
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: Colors.gray[600],
      fontWeight: '500',
    },
    header: {
      paddingBottom: 24,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 12,
      marginBottom: 12,
      gap: 12,
    },
    menuButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerContent: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.white,
      marginBottom: 2,
    },
    headerSubtitle: {
      fontSize: 14,
      color: Colors.white,
      opacity: 0.9,
    },
    monthNavigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingBottom: 16,
    },
    monthNavButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    monthTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.white,
    },
    calendarSection: {
      backgroundColor: Colors.white,
      margin: 16,
      marginBottom: 8,
      borderRadius: 16,
      padding: 20,
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
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.gray[900],
      marginBottom: 16,
    },
    weekDaysHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    weekDayText: {
      width: 40,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '600',
      color: Colors.gray[500],
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    calendarDay: {
      width: 40,
      height: 40,
      margin: 2,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.gray[50],
      position: 'relative',
    },
    calendarDayWithWorkout: {
      backgroundColor: Colors.primary[100],
      borderWidth: 2,
      borderColor: Colors.primary[300],
    },
    calendarDayToday: {
      backgroundColor: Colors.primary[600],
      borderWidth: 2,
      borderColor: Colors.primary[700],
    },
    calendarDayText: {
      fontSize: 14,
      fontWeight: '500',
      color: Colors.gray[700],
    },
    calendarDayTextWithWorkout: {
      color: Colors.primary[700],
      fontWeight: '600',
    },
    calendarDayTextToday: {
      color: Colors.white,
      fontWeight: 'bold',
    },
    workoutIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: Colors.gray[200],
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
    },
    legendDotWorkout: {
      backgroundColor: Colors.primary[300],
      borderWidth: 2,
      borderColor: Colors.primary[500],
    },
    legendDotToday: {
      backgroundColor: Colors.primary[600],
    },
    legendText: {
      fontSize: 12,
      color: Colors.gray[600],
      fontWeight: '500',
    },
    historySection: {
      backgroundColor: Colors.white,
      margin: 16,
      marginTop: 8,
      borderRadius: 16,
      padding: 20,
      shadowColor: Colors.gray[900],
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    workoutHistoryItem: {
      padding: 16,
      backgroundColor: Colors.gray[50],
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: Colors.gray[200],
    },
    workoutHistoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    workoutHistoryDate: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.gray[900],
    },
    workoutHistoryStats: {
      flexDirection: 'row',
      gap: 12,
    },
    workoutHistoryStat: {
      fontSize: 12,
      color: Colors.gray[600],
      fontWeight: '500',
      backgroundColor: Colors.white,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.gray[200],
    },
    exerciseList: {
      marginTop: 4,
    },
    exerciseName: {
      fontSize: 14,
      color: Colors.gray[700],
      marginBottom: 2,
    },
    exerciseMore: {
      fontSize: 12,
      color: Colors.gray[500],
      fontStyle: 'italic',
      marginTop: 4,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.gray[600],
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: Colors.gray[500],
      textAlign: 'center',
    },
  });
};