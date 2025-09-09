import { PressableProps } from 'react-native';

export interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  buttonStyle?: 'solid' | 'outline' | 'soft';
  fullWidth?: boolean;
  disabled?: boolean;
}

export type ButtonVariant = ButtonProps['variant'];
export type ButtonSize = ButtonProps['size'];
export type ButtonStyleType = ButtonProps['buttonStyle'];