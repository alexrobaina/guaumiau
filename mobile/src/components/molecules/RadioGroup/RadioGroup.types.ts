export interface IRadioOption<T = string> {
  value: T;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface IRadioGroupProps<T = string> {
  options: IRadioOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  layout?: 'horizontal' | 'vertical';
  testID?: string;
}
