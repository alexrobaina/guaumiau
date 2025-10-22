import {TextInputProps} from 'react-native';

export interface IFormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}
