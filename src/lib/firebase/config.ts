import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, Auth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
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

// Initialize Auth with persistence
let auth: Auth;
try {
  if (Platform.OS !== 'web') {
    // For React Native - use initializeAuth with AsyncStorage persistence
    try {
      auth = initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
      console.log('🔐 Firebase Auth initialized with AsyncStorage persistence');
    } catch (error) {
      // Auth might already be initialized
      console.log('ℹ️ Auth already initialized, using existing instance');
      auth = getAuth(firebaseApp);
    }
  } else {
    // For web - use regular getAuth
    auth = getAuth(firebaseApp);
  }
} catch (error) {
  // Fallback to regular getAuth
  console.warn('⚠️ Failed to initialize auth with persistence, using default:', error);
  auth = getAuth(firebaseApp);
}

// Initialize Firestore
const firestore: Firestore = getFirestore(firebaseApp);

// Enable Firestore offline persistence for better connectivity
try {
  // Only enable in development for debugging
  if (__DEV__) {
    // Import and enable network logging in development
    import('firebase/firestore').then(({ enableNetwork, disableNetwork }) => {
      // This helps with connection debugging
      console.log('🔥 Firestore network enabled for development');
    }).catch((error) => {
      console.warn('Firestore network configuration warning:', error.message);
    });
  }
} catch (error) {
  console.warn('Firestore configuration warning (non-critical):', error);
}

// Export auth and firestore instances
export { auth, firestore };
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