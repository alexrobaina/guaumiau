export interface IPhoneInputProps {
  value: string;
  onChangePhoneNumber: (phoneNumber: string) => void;
  onChangeCountryCode?: (countryCode: string) => void;
  onChangeFormattedPhoneNumber?: (formattedPhoneNumber: string) => void;
  defaultCountry?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoDetectCountry?: boolean;
}

export interface ICountryInfo {
  callingCode: string;
  cca2: string;
  flag: string;
  name: string;
}
