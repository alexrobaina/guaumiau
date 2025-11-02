export interface IGooglePlaceData {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

export interface IGooglePlaceDetails {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

export interface IGooglePlacesInputProps {
  placeholder?: string;
  value?: string;
  error?: string;
  onPlaceSelected: (data: IGooglePlaceData, details: IGooglePlaceDetails | null) => void;
  onChangeText?: (text: string) => void;
  disabled?: boolean;
  required?: boolean;
}
