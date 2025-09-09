import { TextProps } from 'react-native';

export interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'muted'
    | 'error'
    | 'success';
}

export type TextVariant = CustomTextProps['variant'];
export type TextColor = CustomTextProps['color'];