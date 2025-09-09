import { TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface AnimatedInputProps extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: any;
}

export type AnimatedInputIconName = keyof typeof Ionicons.glyphMap;