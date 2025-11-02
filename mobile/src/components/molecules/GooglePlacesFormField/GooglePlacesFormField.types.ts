import {IGooglePlaceData, IGooglePlaceDetails} from '@components/atoms/GooglePlacesInput/GooglePlacesInput.types';

export interface IGooglePlacesFormFieldProps {
  label: string;
  placeholder?: string;
  value?: string;
  error?: string;
  onPlaceSelected: (data: IGooglePlaceData, details: IGooglePlaceDetails | null) => void;
  onChangeText?: (text: string) => void;
  disabled?: boolean;
  required?: boolean;
}
