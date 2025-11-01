import {LinkingOptions} from '@react-navigation/native';

/**
 * Deep Linking Configuration for GuauMiau App
 *
 * Supported URL patterns:
 *
 * Authentication:
 * - guaumiau://login
 * - guaumiau://register
 * - guaumiau://forgot-password
 * - guaumiau://reset-password?token=xxx
 * - guaumiau://verify-email?token=xxx
 *
 * Main Navigation:
 * - guaumiau://home
 * - guaumiau://schedule
 * - guaumiau://achievements
 * - guaumiau://profile
 * - guaumiau://settings
 *
 * Bookings:
 * - guaumiau://booking/:id
 *
 * Universal Links (when domain is configured):
 * - https://guaumiau.app/login
 * - https://guaumiau.app/verify-email?token=xxx
 * - https://guaumiau.app/reset-password?token=xxx
 * - https://guaumiau.app/booking/123
 */

export const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [
    'guaumiau://',
    'https://guaumiau.app',
    'https://www.guaumiau.app',
    'http://localhost:8081',
    'http://localhost:3000',
  ],
  config: {
    screens: {
      // Auth screens
      Login: {
        path: 'login',
      },
      Register: {
        path: 'register',
      },
      ForgotPassword: {
        path: 'forgot-password',
      },
      VerifyEmail: {
        path: 'verify-email',
        parse: {
          token: (token: string) => token,
          email: (email: string) => email,
        },
      },
      ResetPassword: {
        path: 'reset-password',
        parse: {
          token: (token: string) => token,
        },
      },

      // Main app screens
      Home: {
        path: 'home',
      },
      Schedule: {
        path: 'schedule',
      },
      Achievements: {
        path: 'achievements',
      },
      Profile: {
        path: 'profile',
      },
      Settings: {
        path: 'settings',
      },

      // Booking details (dynamic parameter)
      BookingDetails: {
        path: 'booking/:id',
        parse: {
          id: (id: string) => id,
        },
      },

      // Fallback for unmatched routes
      NotFound: '*',
    },
  },
};
