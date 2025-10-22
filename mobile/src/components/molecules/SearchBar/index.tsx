import { memo, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { styles } from './styles';
import { theme } from '@/theme';

interface ISearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  showCancelButton?: boolean;
  onCancel?: () => void;
  testID?: string;
}

export const SearchBar = memo<ISearchBarProps>(
  ({ value, onChangeText, placeholder = 'Search', showCancelButton = false, onCancel, testID }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleClear = () => {
      onChangeText('');
    };

    const handleCancel = () => {
      onChangeText('');
      onCancel?.();
    };

    return (
      <View style={styles.container} testID={testID}>
        <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
          <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {value.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <X size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        {showCancelButton && isFocused && (
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);
