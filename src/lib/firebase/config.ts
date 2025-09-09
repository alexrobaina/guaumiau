import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App
let firebaseApp;
if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

// Initialize Auth 
let auth: Auth;
try {
  // Use regular getAuth for both web and mobile
  auth = getAuth(firebaseApp);
} catch (error) {
  // If auth is already initialized, just get it
  auth = getAuth(firebaseApp);
}

// Export auth instance
export { auth };
export default firebaseApp;

// Configuration validation
export const validateFirebaseConfig = () => {
  const requiredKeys = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID',
  ];

  const missingKeys = requiredKeys.filter(
    (key) => !process.env[key]
  );

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing Firebase environment variables: ${missingKeys.join(', ')}\n` +
      'Please check your .env file or environment configuration.'
    );
  }

  return true;
};

// Helper function to check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  try {
    validateFirebaseConfig();
    return true;
  } catch (error) {
    console.warn('Firebase configuration issue:', error);
    return false;
  }
};

// Development helper - log configuration status
if (__DEV__ && Platform.OS !== 'web') {
  if (isFirebaseConfigured()) {
    console.log('✅ Firebase configured successfully');
  } else {
    console.warn('❌ Firebase configuration incomplete');
  }
}