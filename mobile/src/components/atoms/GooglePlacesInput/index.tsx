import { memo, useState, useCallback, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { IGooglePlacesInputProps } from './GooglePlacesInput.types';
import { styles } from './GooglePlacesInput.styles';
import { theme } from '@/theme';
import { ENV } from '@/config/env';
import { Platform } from 'react-native';

interface Prediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export const GooglePlacesInput = memo<IGooglePlacesInputProps>(
  ({
    placeholder = 'Buscar dirección',
    value,
    error,
    onPlaceSelected,
    onChangeText,
    disabled = false,
    required = false,
  }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [showPredictions, setShowPredictions] = useState(false);

    const fetchPredictions = useCallback(async (input: string) => {
      if (!input || input.length < 2) {
        setPredictions([]);
        return;
      }

      setLoading(true);
      try {
        // Use backend proxy instead of calling Google API directly
        const backendUrl = Platform.OS === 'android' ? ENV.ANDROID_BACKEND_URL : ENV.BACKEND_URL;
        const response = await fetch(
          `${backendUrl}/places/autocomplete?input=${encodeURIComponent(input)}&language=es&country=ar`,
        );
        const data = await response.json();
        if (data.predictions) {
          setPredictions(data.predictions);
          setShowPredictions(true);
        }
      } catch (err) {
        console.error('Error fetching predictions:', err);
      } finally {
        setLoading(false);
      }
    }, []);

    const fetchPlaceDetails = useCallback(async (placeId: string) => {
      if (!placeId) return null;

      try {
        // Use backend proxy instead of calling Google API directly
        const backendUrl = Platform.OS === 'android' ? ENV.ANDROID_BACKEND_URL : ENV.BACKEND_URL;
        const response = await fetch(`${backendUrl}/places/details?placeId=${placeId}&language=es`);
        const data = await response.json();
        return data.result;
      } catch (err) {
        console.error('Error fetching place details:', err);
        return null;
      }
    }, []);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (value) {
          fetchPredictions(value);
        }
      }, 300);

      return () => clearTimeout(timer);
    }, [value, fetchPredictions]);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
      // Delay hiding predictions to allow selection
      setTimeout(() => {
        setIsFocused(false);
        setShowPredictions(false);
      }, 200);
    }, []);

    const handleTextChange = useCallback(
      (text: string) => {
        onChangeText?.(text);
        if (!text) {
          setPredictions([]);
          setShowPredictions(false);
        }
      },
      [onChangeText],
    );

    const handleSelectPrediction = useCallback(
      async (prediction: Prediction) => {
        const details = await fetchPlaceDetails(prediction.place_id);

        onPlaceSelected(
          {
            description: prediction.description,
            place_id: prediction.place_id,
            structured_formatting: prediction.structured_formatting,
          },
          details,
        );

        setShowPredictions(false);
        setPredictions([]);
      },
      [fetchPlaceDetails, onPlaceSelected],
    );

    const getInputStyle = () => {
      return [
        styles.textInput,
        isFocused && styles.textInputFocused,
        error && styles.textInputError,
        disabled && styles.textInputDisabled,
      ];
    };

    return (
      <View style={styles.container}>
        <View style={styles.textInputContainer}>
          <TextInput
            style={getInputStyle()}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            value={value}
            onChangeText={handleTextChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!disabled}
            autoCapitalize="words"
          />
          {loading && (
            <ActivityIndicator
              style={{ position: 'absolute', right: 12, top: 12 }}
              size="small"
              color={theme.colors.primary}
            />
          )}
        </View>

        {showPredictions && predictions.length > 0 && (
          <View style={styles.listView}>
            <FlatList
              data={predictions}
              keyExtractor={item => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.row} onPress={() => handleSelectPrediction(item)}>
                  <Text style={styles.description}>{item.description}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        )}
      </View>
    );
  },
);
