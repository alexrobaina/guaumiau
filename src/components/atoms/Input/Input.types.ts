import { TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  error?: string | boolean;
}

export type InputVariant = InputProps['variant'];
export type InputSize = InputProps['size'];