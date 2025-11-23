import React from 'react'
import { TextInput, View } from 'react-native'
import { Text } from '../Text'
import { styles } from './styles'
import type { TextareaProps } from './Textarea.types'

export const Textarea: React.FC<TextareaProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  numberOfLines = 4,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}
