import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  FirestoreError,
} from 'firebase/firestore';
import { firestore } from './config';
import { OnboardingData } from '@/store/slices/onboarding.slice';
import { AuthService } from './auth';

export interface UserProfileData extends OnboardingData {
  userId: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const getErrorMessage = (error: FirestoreError): string => {
  switch (error.code) {
    case 'permission-denied':
      return 'You do not have permission to access this data.';
    case 'unavailable':
      return 'The service is currently unavailable. Please try again later.';
    case 'not-found':
      return 'The requested data was not found.';
    case 'already-exists':
      return 'This data already exists.';
    case 'resource-exhausted':
      return 'Too many requests. Please try again later.';
    case 'failed-precondition':
      return 'Operation failed due to precondition error.';
    case 'aborted':
      return 'Operation was aborted. Please try again.';
    case 'out-of-range':
      return 'Operation was attempted past the valid range.';
    case 'unimplemented':
      return 'Operation is not implemented or supported.';
    case 'internal':
      return 'Internal error occurred. Please try again.';
    case 'deadline-exceeded':
      return 'Operation timed out. Please try again.';
    case 'cancelled':
      return 'Operation was cancelled.';
    case 'invalid-argument':
      return 'Invalid argument provided.';
    case 'unauthenticated':
      return 'You must be logged in to perform this action.';
    default:
      if (error.message && error.message.includes('WebChannelConnection')) {
        console.warn('Firestore network connection warning (non-critical):', error.message);
        return 'Network connection issue. Data will be saved when connection is restored.';
      }
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

export class FirestoreService {
  // Test Firestore connection
  static async testConnection(): Promise<boolean> {
    try {
      const testDocRef = doc(firestore, 'test', 'connection');
      await getDoc(testDocRef);
      console.log('✅ Firestore connection test successful');
      return true;
    } catch (error) {
      console.warn('⚠️ Firestore connection test failed (non-critical):', error);
      return false;
    }
  }

  // Save user onboarding data
  static async saveOnboardingData(onboardingData: OnboardingData): Promise<UserProfileData> {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        throw new Error('User must be authenticated to save onboarding data');
      }

      const now = serverTimestamp() as Timestamp;
      const userProfileData: UserProfileData = {
        ...onboardingData,
        userId: user.uid,
        createdAt: now,
        updatedAt: now,
        // Only include these fields if they have non-null values
        ...(user.email && { email: user.email }),
        ...(user.displayName && { displayName: user.displayName }),
        ...(user.photoURL && { photoURL: user.photoURL }),
      };

      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, userProfileData, { merge: true });

      console.log('✅ Onboarding data saved successfully for user:', user.uid);
      return userProfileData;
    } catch (error) {
      console.error('❌ Error saving onboarding data:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(getErrorMessage(error as FirestoreError));
    }
  }

  // Get user profile data
  static async getUserProfile(userId?: string): Promise<UserProfileData | null> {
    try {
      const user = AuthService.getCurrentUser();
      const targetUserId = userId || user?.uid;

      if (!targetUserId) {
        console.error('❌ getUserProfile: No user ID provided');
        throw new Error('User ID is required to get profile data');
      }

      console.log('🔍 getUserProfile: Fetching profile for userId:', targetUserId);
      const userDocRef = doc(firestore, 'users', targetUserId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfileData;
        console.log('✅ User profile retrieved successfully for user:', targetUserId, {
          hasCompletedField: 'completed' in data,
          completedValue: data.completed,
        });
        return data;
      } else {
        console.warn('⚠️ No profile document found for user:', targetUserId);
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting user profile:', {
        userId: userId || 'from auth',
        error,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
      });

      // Don't throw in production - return null instead to prevent app crashes
      if (__DEV__) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(getErrorMessage(error as FirestoreError));
      } else {
        console.error('❌ PRODUCTION: Swallowing Firestore error to prevent crash');
        return null;
      }
    }
  }

  // Update user profile data
  static async updateUserProfile(
    updates: Partial<Omit<UserProfileData, 'userId' | 'createdAt' | 'updatedAt'>>,
    userId?: string
  ): Promise<void> {
    try {
      const user = AuthService.getCurrentUser();
      const targetUserId = userId || user?.uid;

      if (!targetUserId) {
        throw new Error('User ID is required to update profile data');
      }

      const userDocRef = doc(firestore, 'users', targetUserId);
      await updateDoc(userDocRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      console.log('✅ User profile updated successfully for user:', targetUserId);
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(getErrorMessage(error as FirestoreError));
    }
  }

  // Check if user has completed onboarding
  static async hasCompletedOnboarding(userId?: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(userId);
      return profile?.completed || false;
    } catch (error) {
      console.error('❌ Error checking onboarding status:', error);
      return false;
    }
  }

  // Initialize new user document (called after registration)
  static async initializeUserDocument(user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  }): Promise<void> {
    try {
      const now = serverTimestamp() as Timestamp;
      const initialUserData: Partial<UserProfileData> = {
        userId: user.uid,
        completed: false,
        createdAt: now,
        updatedAt: now,
        // Only include these fields if they have non-null values
        ...(user.email && { email: user.email }),
        ...(user.displayName && { displayName: user.displayName }),
        ...(user.photoURL && { photoURL: user.photoURL }),
      };

      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, initialUserData, { merge: true });

      console.log('✅ User document initialized for user:', user.uid);
    } catch (error) {
      console.error('❌ Error initializing user document:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(getErrorMessage(error as FirestoreError));
    }
  }
}

export default FirestoreService;