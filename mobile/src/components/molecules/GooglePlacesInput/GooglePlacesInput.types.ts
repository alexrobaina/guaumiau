export interface PlaceSuggestion {
  place_id: string
  description: string
}

export interface PlaceDetails {
  address: string
  latitude: number
  longitude: number
}

export interface GooglePlacesInputProps {
  value: string
  onChangeText: (text: string) => void
  onSelectPlace: (place: PlaceDetails) => void
  placeholder?: string
  apiKey: string
}
