import { StyleSheet } from 'react-native';
import { Colors } from '@/lib/colors';

export const makeStyles = () => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.gray[100],
  },
  scrollContent: {
    maxHeight: 400,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 12,
  },
  daySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.white,
  },
  dayButtonSelected: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[700],
  },
  dayButtonTextSelected: {
    color: Colors.white,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputGroupHalf: {
    flex: 0.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[700],
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.gray[900],
    backgroundColor: Colors.white,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  rpeContainer: {
    marginBottom: 16,
  },
  rpeSlider: {
    marginTop: 8,
  },
  rpeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rpeLabel: {
    fontSize: 12,
    color: Colors.gray[500],
  },
  rpeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[600],
    textAlign: 'center',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[700],
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: Colors.gray[300],
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  saveButtonTextDisabled: {
    color: Colors.gray[500],
  },
  measurementTypeInfo: {
    backgroundColor: Colors.primary[50],
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  measurementTypeText: {
    fontSize: 14,
    color: Colors.primary[700],
    fontWeight: '500',
  },
});