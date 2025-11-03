import {Platform} from 'react-native';

/**
 * Get the API base URL based on platform
 */
export const getAPIBaseURL = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  // For iOS simulator, use 127.0.0.1
  // For iOS physical device, you should use your Mac's IP address
  return 'http://127.0.0.1:3000';
};

/**
 * Convert a relative image path or full URL to an absolute URL
 * @param imagePath - The image path from the API (e.g., "/uploads/pets/...")
 * @returns Full image URL
 */
export const getImageURL = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) {
    return null;
  }

  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a relative path, prepend the base URL
  const baseURL = getAPIBaseURL();
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseURL}${path}`;
};

/**
 * Get the primary photo URL for a pet, or return null for placeholder
 * @param photos - Array of photo URLs from pet data
 * @returns Full image URL or null for placeholder
 */
export const getPetPhotoURL = (photos?: string[]): string | null => {
  if (!photos || photos.length === 0) {
    return null;
  }

  return getImageURL(photos[0]);
};
