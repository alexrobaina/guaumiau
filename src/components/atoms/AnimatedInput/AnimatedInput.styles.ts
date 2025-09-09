import { StyleSheet } from 'react-native';
import { Colors } from '@/lib/colors';

export const makeStyles = () => StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputContainer: {
    position: 'relative',
    borderRadius: 12,
    backgroundColor: Colors.white,
    minHeight: 56,
  },
  input: {
    fontSize: 16,
    color: Colors.gray[900],
    paddingTop: 20,
    paddingBottom: 8,
    height: 56,
  },
  leftIconContainer: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 2,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 16,
    top: 18,
    zIndex: 2,
    padding: 4,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
  helperText: {
    color: Colors.gray[500],
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});

export const getLabelStyle = (
  animatedLabelPosition: any,
  leftIcon: boolean,
  error: boolean,
  isFocused: boolean
) => ({
  position: 'absolute' as const,
  left: leftIcon ? 48 : 16,
  fontSize: animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  }),
  top: animatedLabelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 8],
  }),
  color: error
    ? Colors.error
    : isFocused
    ? Colors.primary[500]
    : Colors.gray[500],
  backgroundColor: Colors.white,
  paddingHorizontal: 4,
  zIndex: 1,
});

export const getContainerBorderColor = (
  animatedBorderColor: any,
  error: boolean
) => 
  animatedBorderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? Colors.error : Colors.gray[300],
      error ? Colors.error : Colors.primary[500],
    ],
  });