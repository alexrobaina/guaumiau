import {Linking} from 'react-native';

/**
 * Deep Linking Utility Functions
 *
 * This module provides helper functions for handling deep links
 * and generating shareable links for the app.
 */

/**
 * Opens a URL in the app or external browser
 * @param url - The URL to open
 */
export const openURL = async (url: string): Promise<boolean> => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      return true;
    } else {
      console.warn(`Cannot open URL: ${url}`);
      return false;
    }
  } catch (error) {
    console.error('Error opening URL:', error);
    return false;
  }
};

/**
 * Generates a deep link URL for the app
 * @param path - The path within the app (e.g., 'home', 'booking/123')
 * @param useHTTPS - Whether to use HTTPS universal link instead of custom scheme
 */
export const generateDeepLink = (
  path: string,
  useHTTPS: boolean = false,
): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  if (useHTTPS) {
    return `https://guaumiau.app/${cleanPath}`;
  }

  return `guaumiau://${cleanPath}`;
};

/**
 * Parses query parameters from a URL
 * @param url - The URL to parse
 */
export const parseURLParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};

  try {
    const urlObj = new URL(url);
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
  } catch (error) {
    console.error('Error parsing URL params:', error);
  }

  return params;
};

/**
 * Deep link generators for common app routes
 */
export const DeepLinks = {
  // Auth links
  login: () => generateDeepLink('login'),
  register: () => generateDeepLink('register'),
  forgotPassword: () => generateDeepLink('forgot-password'),
  resetPassword: (token: string) =>
    generateDeepLink(`reset-password?token=${token}`),

  // Main navigation
  home: () => generateDeepLink('home'),
  schedule: () => generateDeepLink('schedule'),
  achievements: () => generateDeepLink('achievements'),
  profile: () => generateDeepLink('profile'),
  settings: () => generateDeepLink('settings'),

  // Dynamic routes
  bookingDetails: (bookingId: string) =>
    generateDeepLink(`booking/${bookingId}`),
};

/**
 * Universal link generators (HTTPS)
 */
export const UniversalLinks = {
  login: () => generateDeepLink('login', true),
  register: () => generateDeepLink('register', true),
  resetPassword: (token: string) =>
    generateDeepLink(`reset-password?token=${token}`, true),
  bookingDetails: (bookingId: string) =>
    generateDeepLink(`booking/${bookingId}`, true),
};

/**
 * Listen to incoming deep links
 * @param callback - Function to call when a link is received
 * @returns Cleanup function to remove listener
 */
export const addLinkingListener = (
  callback: (url: string) => void,
): (() => void) => {
  const subscription = Linking.addEventListener('url', ({url}) => {
    callback(url);
  });

  return () => {
    subscription.remove();
  };
};

/**
 * Get the initial URL that opened the app
 */
export const getInitialURL = async (): Promise<string | null> => {
  try {
    const url = await Linking.getInitialURL();
    return url;
  } catch (error) {
    console.error('Error getting initial URL:', error);
    return null;
  }
};
