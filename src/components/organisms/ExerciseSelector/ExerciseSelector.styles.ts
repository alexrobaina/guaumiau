import { StyleSheet } from 'react-native';
import { Colors } from '@/lib/colors';

export const makeStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray[900],
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    marginTop: 16,
  },
  searchInput: {
    backgroundColor: Colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  filtersContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  filterRow: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 8,
  },
  filterScroll: {
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterChipInactive: {
    backgroundColor: Colors.gray[100],
    borderColor: Colors.gray[300],
  },
  filterChipActive: {
    backgroundColor: Colors.primary[100],
    borderColor: Colors.primary[300],
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextInactive: {
    color: Colors.gray[700],
  },
  filterChipTextActive: {
    color: Colors.primary[700],
  },
  activityTypeChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  exercisesList: {
    paddingBottom: 40,
  },
  exerciseCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: Colors.gray[100],
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  exerciseEquipment: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 2,
  },
  exerciseMuscleGroups: {
    fontSize: 14,
    color: Colors.primary[600],
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyBadgeBeginner: {
    backgroundColor: Colors.success + '20',
  },
  difficultyBadgeIntermediate: {
    backgroundColor: Colors.warning + '20',
  },
  difficultyBadgeAdvanced: {
    backgroundColor: Colors.error + '20',
  },
  difficultyBadgeElite: {
    backgroundColor: Colors.gray[900] + '20',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyTextBeginner: {
    color: Colors.success,
  },
  difficultyTextIntermediate: {
    color: Colors.warning,
  },
  difficultyTextAdvanced: {
    color: Colors.error,
  },
  difficultyTextElite: {
    color: Colors.gray[900],
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  exerciseDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  exerciseDetailText: {
    fontSize: 12,
    color: Colors.gray[700],
    marginLeft: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: Colors.gray[600],
    lineHeight: 20,
    marginBottom: 12,
  },
  selectButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  createCustomButton: {
    backgroundColor: Colors.secondary[500],
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  createCustomButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.secondary[500],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});