import { IGooglePlaceDetails } from '@components/atoms/GooglePlacesInput/GooglePlacesInput.types';

interface ParsedAddress {
  city: string | undefined;
  country: string | undefined;
}

/**
 * Extracts city and country from Google Places address_components
 * @param details Google Places details object
 * @returns ParsedAddress object with city and country
 */
export const parseGooglePlaceAddress = (details: IGooglePlaceDetails | null): ParsedAddress => {
  if (!details || !details.address_components) {
    return {
      city: undefined,
      country: undefined,
    };
  }

  let city: string | undefined;
  let country: string | undefined;

  // Iterate through address components to find city and country
  details.address_components.forEach(component => {
    // Extract city - check multiple possible types
    if (component.types.includes('locality')) {
      // Most common type for city
      city = component.long_name;
    } else if (!city && component.types.includes('administrative_area_level_2')) {
      // Fallback: administrative area level 2 (sometimes used for city)
      city = component.long_name;
    } else if (!city && component.types.includes('administrative_area_level_1')) {
      // Further fallback: state/province (better than nothing)
      city = component.long_name;
    }

    // Extract country
    if (component.types.includes('country')) {
      country = component.long_name;
    }
  });

  return {
    city,
    country,
  };
};

/**
 * Extracts country code (short_name) from Google Places address_components
 * @param details Google Places details object
 * @returns Country code (e.g., 'AR' for Argentina) or undefined
 */
export const getCountryCode = (details: IGooglePlaceDetails | null): string | undefined => {
  if (!details || !details.address_components) {
    return undefined;
  }

  const countryComponent = details.address_components.find(component =>
    component.types.includes('country'),
  );

  return countryComponent?.short_name;
};
