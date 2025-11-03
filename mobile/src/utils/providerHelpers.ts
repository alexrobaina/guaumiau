/**
 * Provider utility functions following functional programming principles
 */

/**
 * Formats a service type string from UPPER_SNAKE_CASE to Title Case
 *
 * @param serviceType - Service type in UPPER_SNAKE_CASE format
 * @returns Formatted string in Title Case
 *
 * @example
 * formatServiceType('DOG_WALKING') // Returns 'Dog Walking'
 * formatServiceType('PET_SITTING') // Returns 'Pet Sitting'
 */
export const formatServiceType = (serviceType: string): string =>
  serviceType
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');

/**
 * Formats a full name from first and last name
 *
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Full name string
 */
export const formatFullName = (firstName: string, lastName: string): string =>
  `${firstName} ${lastName}`;

/**
 * Formats a location string from city and country
 *
 * @param city - City name
 * @param country - Country name
 * @returns Formatted location string
 */
export const formatLocation = (city: string, country: string): string =>
  `${city}, ${country}`;

/**
 * Formats distance with units
 *
 * @param distance - Distance in kilometers
 * @returns Formatted distance string
 */
export const formatDistance = (distance: number): string =>
  `${distance.toFixed(1)} km`;

/**
 * Checks if an error is a network-related error
 *
 * @param errorMessage - Error message string
 * @returns True if error is network-related
 */
export const isNetworkError = (errorMessage: string): boolean =>
  errorMessage.toLowerCase().includes('network') ||
  errorMessage.toLowerCase().includes('timeout') ||
  errorMessage.toLowerCase().includes('connection');

/**
 * Gets a user-friendly error message
 *
 * @param error - Error object or message
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: Error | string | null): string => {
  if (!error) return 'Something went wrong';

  const message = typeof error === 'string' ? error : error.message;

  if (isNetworkError(message)) {
    return 'Unable to connect. Please check your internet connection.';
  }

  return message || 'Something went wrong';
};
