import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  required: {
    color: '#DC2626',
    marginLeft: 4,
  },
  optionsHorizontal: {
    flexDirection: 'row',
    gap: 12,
  },
  optionsVertical: {
    gap: 8,
  },
  option: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionVertical: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  optionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  optionDisabled: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  optionIconVertical: {
    marginBottom: 0,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  optionLabelVertical: {
    textAlign: 'left',
  },
  optionLabelSelected: {
    color: '#2563EB',
  },
  error: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
});
