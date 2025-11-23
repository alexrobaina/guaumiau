import React, { useState } from 'react'
import { View, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { MapPin } from 'lucide-react-native'
import { Text } from '../../atoms/Text'
import { styles } from './styles'
import type { GooglePlacesInputProps, PlaceSuggestion } from './GooglePlacesInput.types'

export const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  value,
  onChangeText,
  onSelectPlace,
  placeholder = 'Ingresa la dirección',
  apiKey,
}) => {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const fetchPlaces = async (input: string) => {
    if (input.length < 3) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input,
        )}&key=${apiKey}&components=country:ar&language=es`,
      )
      const data = await response.json()

      if (data.predictions) {
        setSuggestions(
          data.predictions.map((prediction: any) => ({
            place_id: prediction.place_id,
            description: prediction.description,
          })),
        )
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error('Error fetching places:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTextChange = (text: string) => {
    onChangeText(text)
    fetchPlaces(text)
  }

  const handleSelectPlace = async (place: PlaceSuggestion) => {
    onChangeText(place.description)
    setShowSuggestions(false)
    setSuggestions([])

    // Fetch place details to get coordinates
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${apiKey}&fields=geometry`,
      )
      const data = await response.json()

      if (data.result?.geometry?.location) {
        onSelectPlace({
          address: place.description,
          latitude: data.result.geometry.location.lat,
          longitude: data.result.geometry.location.lng,
        })
      }
    } catch (error) {
      console.error('Error fetching place details:', error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <MapPin size={20} color="#6B7280" style={styles.icon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
        />
        {isLoading && <ActivityIndicator size="small" color="#F97316" />}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectPlace(item)}
              >
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.suggestionText}>{item.description}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  )
}
