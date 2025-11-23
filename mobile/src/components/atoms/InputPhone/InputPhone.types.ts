export interface IInputPhoneProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onChangeFormattedText?: (text: string) => void;
  error?: string;
  placeholder?: string;
  editable?: boolean;
  disabled?: boolean;
}
