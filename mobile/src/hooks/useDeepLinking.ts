import {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {addLinkingListener, getInitialURL} from '@/utils/deepLinking';

/**
 * Custom hook for handling deep links in React components
 *
 * Usage:
 * ```typescript
 * function MyComponent() {
 *   const { initialUrl, lastUrl } = useDeepLinking((url) => {
 *     console.log('Received deep link:', url);
 *     // Handle the URL
 *   });
 * }
 * ```
 */
export const useDeepLinking = (onLinkReceived?: (url: string) => void) => {
  const [initialUrl, setInitialUrl] = useState<string | null>(null);
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get the initial URL that opened the app
    getInitialURL().then(url => {
      if (url) {
        setInitialUrl(url);
        setLastUrl(url);
        onLinkReceived?.(url);
      }
    });

    // Listen for incoming links while app is open
    const removeListener = addLinkingListener(url => {
      setLastUrl(url);
      onLinkReceived?.(url);
    });

    return removeListener;
  }, [onLinkReceived]);

  return {
    initialUrl,
    lastUrl,
  };
};

/**
 * Hook for handling authentication deep links
 * Automatically navigates to auth screens based on deep links
 */
export const useAuthDeepLinks = () => {
  const navigation = useNavigation<any>();

  useDeepLinking(url => {
    // Parse the URL to extract the path and params
    try {
      const urlObj = new URL(url.replace('guaumiau://', 'https://temp.com/'));
      const path = urlObj.pathname.replace('/', '');
      const params: Record<string, string> = {};

      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      // Handle auth-related deep links
      switch (path) {
        case 'login':
          navigation.navigate('Login');
          break;
        case 'register':
          navigation.navigate('Register');
          break;
        case 'forgot-password':
          navigation.navigate('ForgotPassword');
          break;
        case 'reset-password':
          if (params.token) {
            navigation.navigate('ResetPassword', {token: params.token});
          }
          break;
      }
    } catch (error) {
      console.error('Error handling auth deep link:', error);
    }
  });
};

/**
 * Hook for handling main app deep links
 * Automatically navigates to app screens based on deep links
 */
export const useAppDeepLinks = () => {
  const navigation = useNavigation<any>();

  useDeepLinking(url => {
    try {
      const urlObj = new URL(url.replace('guaumiau://', 'https://temp.com/'));
      const pathParts = urlObj.pathname.replace('/', '').split('/');
      const [mainPath, ...subPaths] = pathParts;

      // Handle main app deep links
      switch (mainPath) {
        case 'home':
          navigation.navigate('Home');
          break;
        case 'schedule':
          navigation.navigate('Schedule');
          break;
        case 'achievements':
          navigation.navigate('Achievements');
          break;
        case 'profile':
          navigation.navigate('Profile');
          break;
        case 'settings':
          navigation.navigate('Settings');
          break;
        case 'booking':
          if (subPaths[0]) {
            navigation.navigate('BookingDetails', {id: subPaths[0]});
          }
          break;
      }
    } catch (error) {
      console.error('Error handling app deep link:', error);
    }
  });
};
