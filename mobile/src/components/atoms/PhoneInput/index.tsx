import React, {memo, useState, useEffect, useMemo} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Text,
} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import {styles} from './PhoneInput.styles';
import {IPhoneInputProps, ICountryInfo} from './PhoneInput.types';
import {theme} from '@/theme';
import {COUNTRIES} from './countries.data';

export const PhoneInput = memo<IPhoneInputProps>(
  ({
    value,
    onChangePhoneNumber,
    onChangeCountryCode,
    onChangeFormattedPhoneNumber,
    defaultCountry,
    placeholder = 'Número de teléfono',
    error,
    disabled = false,
    autoDetectCountry = true,
  }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<ICountryInfo | null>(
      null,
    );

    // Auto-detect country on mount
    useEffect(() => {
      if (autoDetectCountry && !selectedCountry) {
        const countryCode = RNLocalize.getCountry();
        const detectedCountry = COUNTRIES.find(c => c.cca2 === countryCode);

        if (detectedCountry) {
          setSelectedCountry(detectedCountry);
          onChangeCountryCode?.(detectedCountry.callingCode);
        } else {
          // Fallback to default or first country
          const fallbackCountry = defaultCountry
            ? COUNTRIES.find(c => c.cca2 === defaultCountry)
            : COUNTRIES[0];

          if (fallbackCountry) {
            setSelectedCountry(fallbackCountry);
            onChangeCountryCode?.(fallbackCountry.callingCode);
          }
        }
      } else if (defaultCountry && !selectedCountry) {
        const country = COUNTRIES.find(c => c.cca2 === defaultCountry);
        if (country) {
          setSelectedCountry(country);
          onChangeCountryCode?.(country.callingCode);
        }
      }
    }, [autoDetectCountry, defaultCountry, selectedCountry, onChangeCountryCode]);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const handleCountrySelect = (country: ICountryInfo) => {
      setSelectedCountry(country);
      onChangeCountryCode?.(country.callingCode);
      setIsModalVisible(false);
      setSearchQuery('');

      // Update formatted phone number
      if (value) {
        const formatted = `+${country.callingCode} ${value}`;
        onChangeFormattedPhoneNumber?.(formatted);
      }
    };

    const handlePhoneChange = (text: string) => {
      // Only allow numbers
      const cleaned = text.replace(/[^0-9]/g, '');
      onChangePhoneNumber(cleaned);

      // Update formatted phone number
      if (selectedCountry) {
        const formatted = `+${selectedCountry.callingCode} ${cleaned}`;
        onChangeFormattedPhoneNumber?.(formatted);
      }
    };

    const filteredCountries = useMemo(() => {
      if (!searchQuery) {
        return COUNTRIES;
      }

      const query = searchQuery.toLowerCase();
      return COUNTRIES.filter(
        country =>
          country.name.toLowerCase().includes(query) ||
          country.cca2.toLowerCase().includes(query) ||
          country.callingCode.includes(query),
      );
    }, [searchQuery]);

    const renderCountryItem = ({item}: {item: ICountryInfo}) => (
      <TouchableOpacity
        style={styles.countryItem}
        onPress={() => handleCountrySelect(item)}>
        <Text style={styles.countryItemFlag}>{item.flag}</Text>
        <View style={styles.countryItemContent}>
          <Text style={styles.countryItemName}>{item.name}</Text>
          <Text style={styles.countryItemCode}>+{item.callingCode}</Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.inputContainer,
            isFocused && styles.focused,
            error && styles.error,
            disabled && styles.disabled,
          ]}>
          <TouchableOpacity
            style={styles.countryPickerButton}
            onPress={() => !disabled && setIsModalVisible(true)}
            disabled={disabled}>
            {selectedCountry && (
              <>
                <Text style={styles.flagText}>{selectedCountry.flag}</Text>
                <Text style={styles.countryCodeText}>
                  +{selectedCountry.callingCode}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={value}
            onChangeText={handlePhoneChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="phone-pad"
            editable={!disabled}
            maxLength={15}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar país</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setIsModalVisible(false);
                    setSearchQuery('');
                  }}>
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar país..."
                placeholderTextColor={theme.colors.textSecondary}
              />

              <FlatList
                data={filteredCountries}
                renderItem={renderCountryItem}
                keyExtractor={item => item.cca2}
                style={styles.countryList}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  },
);
