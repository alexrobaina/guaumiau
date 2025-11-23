import React, {memo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import {ChevronDown, X} from 'lucide-react-native';
import {styles} from './styles';
import {theme} from '@/theme';
import {DropdownProps, DropdownOption} from './Dropdown.types';

export const Dropdown = memo(<T extends string | number>(props: DropdownProps<T>) => {
  const {
    options,
    value,
    placeholder = 'Seleccionar...',
    onSelect,
    error,
    disabled = false,
    style,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(true);
      setIsFocused(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleSelect = (selectedValue: T) => {
    onSelect(selectedValue);
    handleClose();
  };

  const renderOption = ({item}: {item: DropdownOption<T>}) => {
    const isSelected = item.value === value;

    return (
      <TouchableOpacity
        style={[styles.optionItem, isSelected && styles.optionItemSelected]}
        onPress={() => handleSelect(item.value)}>
        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={handleOpen}
        disabled={disabled}
        style={[
          styles.dropdownContainer,
          isFocused && styles.focused,
          error && styles.error,
          disabled && styles.disabled,
        ]}>
        <Text
          style={
            selectedOption ? styles.selectedText : styles.placeholderText
          }>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <View style={styles.iconContainer}>
          <ChevronDown size={20} color={theme.colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {placeholder || 'Seleccionar opción'}
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              style={styles.optionsList}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}) as <T extends string | number>(props: DropdownProps<T>) => JSX.Element;
