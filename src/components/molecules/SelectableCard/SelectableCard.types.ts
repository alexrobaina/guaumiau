import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface SelectableCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  selected: boolean;
  onSelect: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}