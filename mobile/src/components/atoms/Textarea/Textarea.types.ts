import type { TextInputProps } from 'react-native'

export interface TextareaProps extends Omit<TextInputProps, 'multiline'> {
  label?: string
  error?: string
  numberOfLines?: number
}
