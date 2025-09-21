# Firebase Complete Best Practices & Implementation Guide for CruxClimb

## 📋 Document Purpose

This document serves as the definitive Firebase implementation guide for the CruxClimb app. When implementing any Firebase feature, follow these patterns exactly to ensure consistency, security, and reliability. This guide covers authentication, Firestore database operations, security rules, error handling, and performance optimization.

---

## 🏗️ Firebase Project Architecture

### Project Structure Overview

```
Firebase Project: CruxClimb
├── Authentication (Firebase Auth)
├── Database (Firestore)
├── Storage (Firebase Storage)
├── Analytics (Firebase Analytics)
└── Hosting (Firebase Hosting)
```

### Environment Configuration

```javascript
// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration object from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only once
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth with React Native persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore with offline persistence
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: true, // Enable multi-tab synchronization
  }),
});

// Initialize other services
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { auth, db, storage, analytics };
```

---

## 🔐 Authentication Best Practices

### Complete Authentication Service Implementation

```typescript
// src/lib/firebase/auth.service.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User,
  AuthError,
  sendEmailVerification,
  reload,
} from 'firebase/auth';
import { auth, db } from './config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Custom error handling for Firebase Auth errors
class AuthErrorHandler {
  static handle(error: AuthError): string {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use':
        'This email is already registered. Please sign in instead.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/operation-not-allowed':
        'Email/password accounts are not enabled. Please contact support.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/user-disabled':
        'This account has been disabled. Please contact support.',
      'auth/user-not-found':
        'No account found with this email. Please sign up first.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-credential':
        'The login credentials are invalid. Please check and try again.',
      'auth/too-many-requests':
        'Too many failed attempts. Please try again later.',
      'auth/network-request-failed':
        'Network error. Please check your connection.',
      'auth/popup-closed-by-user':
        'Sign-in popup was closed. Please try again.',
      'auth/unauthorized-domain':
        'This domain is not authorized. Please contact support.',
      'auth/requires-recent-login':
        'Please sign in again to complete this action.',
    };

    return (
      errorMessages[error.code] || `Authentication error: ${error.message}`
    );
  }
}

// User data interface
interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: any;
  updatedAt: any;
  onboardingCompleted: boolean;
  role: 'user' | 'admin' | 'coach';
  subscription: {
    type: 'free' | 'premium' | 'pro';
    validUntil: Date | null;
  };
}

class AuthService {
  // Sign up with email and password
  async signUp(
    email: string,
    password: string,
    displayName?: string
  ): Promise<User> {
    try {
      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update display name if provided
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Send email verification
      await sendEmailVerification(user);

      // Create user profile document in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: displayName || null,
        photoURL: null,
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        onboardingCompleted: false,
        role: 'user',
        subscription: {
          type: 'free',
          validUntil: null,
        },
      };

      // Save to Firestore with proper error handling
      await this.createUserProfile(user.uid, userProfile);

      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(AuthErrorHandler.handle(error as AuthError));
      }
      throw new Error('An unexpected error occurred during sign up');
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update last login timestamp
      await this.updateLastLogin(user.uid);

      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(AuthErrorHandler.handle(error as AuthError));
      }
      throw new Error('An unexpected error occurred during sign in');
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
  }

  // Password reset
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(AuthErrorHandler.handle(error as AuthError));
      }
      throw new Error('Failed to send password reset email');
    }
  }

  // Create user profile in Firestore
  private async createUserProfile(
    uid: string,
    profile: UserProfile
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);

      // Check if user already exists
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        console.log('User profile already exists, skipping creation');
        return;
      }

      // Create new user profile
      await setDoc(userRef, profile);
    } catch (error) {
      console.error('Firestore error creating user profile:', error);
      throw new Error('Failed to create user profile. Please try again.');
    }
  }

  // Update last login timestamp
  private async updateLastLogin(uid: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(
        userRef,
        {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Failed to update last login:', error);
      // Non-critical error, don't throw
    }
  }

  // Get current user profile from Firestore
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        return userSnapshot.data() as UserProfile;
      }

      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to load user profile');
    }
  }

  // Auth state observer
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Check if email is verified
  async checkEmailVerification(): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      // Reload user to get latest email verification status
      await reload(user);
      return user.emailVerified;
    } catch (error) {
      console.error('Error checking email verification:', error);
      return false;
    }
  }

  // Resend verification email
  async resendVerificationEmail(): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No user is currently signed in');

    try {
      await sendEmailVerification(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(AuthErrorHandler.handle(error as AuthError));
      }
      throw new Error('Failed to send verification email');
    }
  }
}

export const authService = new AuthService();
```

---

## 📚 Firestore Database Best Practices

### Complete Firestore Service Implementation

```typescript
// src/lib/firebase/firestore.service.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  runTransaction,
  QueryConstraint,
  DocumentData,
  FirestoreError,
  enableNetwork,
  disableNetwork,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// Custom error handler for Firestore errors
class FirestoreErrorHandler {
  static handle(error: FirestoreError): string {
    const errorMessages: Record<string, string> = {
      cancelled: 'Operation was cancelled.',
      unknown: 'An unknown error occurred.',
      'invalid-argument': 'Invalid data provided.',
      'deadline-exceeded': 'Operation took too long. Please try again.',
      'not-found': 'The requested document was not found.',
      'already-exists': 'Document already exists.',
      'permission-denied': 'You do not have permission to perform this action.',
      'resource-exhausted': 'Too many requests. Please slow down.',
      'failed-precondition': 'Operation requirements not met.',
      aborted: 'Operation was aborted. Please try again.',
      'out-of-range': 'Operation was attempted past the valid range.',
      unimplemented: 'This feature is not implemented yet.',
      internal: 'Internal server error. Please try again.',
      unavailable: 'Service temporarily unavailable. Please try again.',
      'data-loss': 'Unrecoverable data loss or corruption.',
      unauthenticated: 'Please sign in to continue.',
    };

    return errorMessages[error.code] || `Database error: ${error.message}`;
  }
}

// Base document interface
interface BaseDocument {
  id?: string;
  createdAt?: Timestamp | any;
  updatedAt?: Timestamp | any;
  createdBy?: string;
  updatedBy?: string;
}

// Generic Firestore service class
class FirestoreService<T extends BaseDocument> {
  constructor(private collectionName: string) {}

  // Create document with automatic ID
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    try {
      const docRef = doc(collection(db, this.collectionName));
      const timestamp = serverTimestamp();

      const documentData = {
        ...data,
        id: docRef.id,
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: auth.currentUser?.uid || 'system',
        updatedBy: auth.currentUser?.uid || 'system',
      };

      await setDoc(docRef, documentData);

      return {
        ...documentData,
        id: docRef.id,
      } as T;
    } catch (error) {
      if (error instanceof FirestoreError) {
        throw new Error(FirestoreErrorHandler.handle(error));
      }
      throw new Error('Failed to create document');
    }
  }

  // Create document with specific ID
  async createWithId(
    id: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<T> {
    try {
      const docRef = doc(db, this.collectionName, id);

      // Check if document already exists
      const existingDoc = await getDoc(docRef);
      if (existingDoc.exists()) {
        throw new Error('Document already exists with this ID');
      }

      const timestamp = serverTimestamp();
      const documentData = {
        ...data,
        id,
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: auth.currentUser?.uid || 'system',
        updatedBy: auth.currentUser?.uid || 'system',
      };

      await setDoc(docRef, documentData);

      return documentData as T;
    } catch (error) {
      if (error instanceof FirestoreError) {
        throw new Error(FirestoreErrorHandler.handle(error));
      }
      throw error;
    }
  }

  // Get single document
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        return null;
      }

      return {
        ...snapshot.data(),
        id: snapshot.id,
      } as T;
    } catch (error) {
      if (error instanceof FirestoreError) {
        throw new Error(FirestoreErrorHandler.handle(error));
      }
      throw new Error('Failed to fetch document');
    }
  }

  // Get all documents with optional filtering
  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const q = query(collection(db, this.collectionName), ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(
        doc =>
          ({
            ...doc.data(),
            id: doc.id,
          }) as T
      );
    } catch (error) {
      if (error instanceof FirestoreError) {
        throw new Error(FirestoreErrorHandler.handle(error));
      }
      throw new Error('Failed to fetch documents');
    }
  }

  // Update document
  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);

      // Check if document exists
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        throw new Error('Document does not exist');
      }

      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser?.uid || 'system',
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      await updateDoc(docRef, updateData);
    } catch (error) {
      if (error instanceof FirestoreError) {
        throw new Error(FirestoreErrorHandler.handle(error));
      }
      throw error;
    }
  }

  // Delete document
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);

      // Check if document exists
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        throw new Error('Document does not exist');
      }

      await deleteDoc(docRef);
    } catch (error) {
      if (error instanceof FirestoreError) {
        throw new Error(FirestoreErrorHandler.handle(error));
      }
      throw error;
    }
  }

  // Batch write operations
  async batchWrite(
    operations: Array<{
      type: 'create' | 'update' | 'delete';
      id?: string;
      data?: Partial<T>;
    }>
  ): Promise<void> {
    try {
      const batch = writeBatch(db);

      for (const operation of operations) {
        if (operation.type === 'create' && operation.data) {
          const docRef = operation.id
            ? doc(db, this.collectionName, operation.id)
            : doc(collection(db, this.collectionName));

          batch.set(docRef, {
            ...operation.data,
            id: docRef.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else if (
          operation.type === 'update' &&
          operation.id &&
          operation.data
        ) {
          const docRef = doc(db, this.collectionName, operation.id);
          batch.update(docRef, {
            ...operation.data,
            updatedAt: serverTimestamp(),
          });
        } else if (operation.type === 'delete' && operation.id) {
          const docRef = doc(db, this.collectionName, operation.id);
          batch.delete(docRef);
        }
      }

      await batch.commit();
    } catch (error) {
      if (error instanceof FirestoreError) {
        throw new Error(FirestoreErrorHandler.handle(error));
      }
      throw new Error('Batch operation failed');
    }
  }

  // Transaction operations
  async runTransaction<R>(
    updateFunction: (transaction: any) => Promise<R>
  ): Promise<R> {
    try {
      return await runTransaction(db, updateFunction);
    } catch (error) {
      if (error instanceof FirestoreError) {
        throw new Error(FirestoreErrorHandler.handle(error));
      }
      throw new Error('Transaction failed');
    }
  }

  // Real-time listener
  subscribe(
    constraints: QueryConstraint[],
    onNext: (data: T[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    const q = query(collection(db, this.collectionName), ...constraints);

    return onSnapshot(
      q,
      snapshot => {
        const data = snapshot.docs.map(
          doc =>
            ({
              ...doc.data(),
              id: doc.id,
            }) as T
        );
        onNext(data);
      },
      error => {
        console.error('Subscription error:', error);
        if (onError) {
          onError(new Error(FirestoreErrorHandler.handle(error)));
        }
      }
    );
  }

  // Pagination support
  async getPaginated(
    pageSize: number,
    lastDocument?: DocumentData,
    constraints: QueryConstraint[] = []
  ): Promise<{ data: T[]; lastDoc: DocumentData | null }> {
    try {
      const baseConstraints = [...constraints, limit(pageSize)];

      if (lastDocument) {
        baseConstraints.push(startAfter(lastDocument));
      }

      const q = query(collection(db, this.collectionName), ...baseConstraints);
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(
        doc =>
          ({
            ...doc.data(),
            id: doc.id,
          }) as T
      );

      const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

      return { data, lastDoc };
    } catch (error) {
      if (error instanceof FirestoreError) {
        throw new Error(FirestoreErrorHandler.handle(error));
      }
      throw new Error('Failed to fetch paginated data');
    }
  }

  // Offline mode management
  async goOffline(): Promise<void> {
    try {
      await disableNetwork(db);
    } catch (error) {
      console.error('Failed to go offline:', error);
    }
  }

  async goOnline(): Promise<void> {
    try {
      await enableNetwork(db);
    } catch (error) {
      console.error('Failed to go online:', error);
    }
  }
}

// Export service instances for each collection
export const usersService = new FirestoreService<UserProfile>('users');
export const trainingPlansService = new FirestoreService<TrainingPlan>(
  'training_plans'
);
export const workoutsService = new FirestoreService<Workout>('workouts');
export const exercisesService = new FirestoreService<Exercise>('exercises');
```

---

## 🛡️ Security Rules

### Comprehensive Firestore Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    function hasRole(role) {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }

    function isValidEmail(email) {
      return email.matches('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    }

    function isValidUser() {
      return isAuthenticated() &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid));
    }

    // Users collection
    match /users/{userId} {
      // Users can read their own profile
      allow read: if isOwner(userId) || isAdmin();

      // Users can create their own profile on signup
      allow create: if isOwner(userId) &&
        request.resource.data.email == request.auth.token.email &&
        request.resource.data.uid == userId;

      // Users can update their own profile (except role and subscription)
      allow update: if isOwner(userId) &&
        request.resource.data.role == resource.data.role &&
        request.resource.data.subscription == resource.data.subscription;

      // Only admins can delete user profiles
      allow delete: if isAdmin();
    }

    // Training Plans collection
    match /training_plans/{planId} {
      // Users can read their own plans
      allow read: if isAuthenticated() &&
        resource.data.userId == request.auth.uid || isAdmin();

      // Users can create their own plans
      allow create: if isValidUser() &&
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.createdBy == request.auth.uid;

      // Users can update their own plans
      allow update: if isValidUser() &&
        resource.data.userId == request.auth.uid &&
        request.resource.data.userId == resource.data.userId;

      // Users can delete their own plans
      allow delete: if isValidUser() &&
        resource.data.userId == request.auth.uid;
    }

    // Workouts collection
    match /workouts/{workoutId} {
      // Users can read their own workouts or public templates
      allow read: if isAuthenticated() &&
        (resource.data.userId == request.auth.uid ||
         resource.data.isPublic == true);

      // Users can create workouts
      allow create: if isValidUser() &&
        request.resource.data.userId == request.auth.uid;

      // Users can update their own workouts
      allow update: if isValidUser() &&
        resource.data.userId == request.auth.uid;

      // Users can delete their own workouts
      allow delete: if isValidUser() &&
        resource.data.userId == request.auth.uid;
    }

    // Exercises collection (read-only for users)
    match /exercises/{exerciseId} {
      // All authenticated users can read exercises
      allow read: if isAuthenticated();

      // Only admins or coaches can create/update/delete exercises
      allow create, update, delete: if hasRole('admin') || hasRole('coach');
    }

    // User statistics subcollection
    match /users/{userId}/statistics/{statId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);
    }

    // User workout sessions subcollection
    match /users/{userId}/workout_sessions/{sessionId} {
      allow read: if isOwner(userId);
      allow create: if isOwner(userId) &&
        request.resource.data.userId == userId;
      allow update: if isOwner(userId) &&
        resource.data.userId == userId;
      allow delete: if false; // Sessions should not be deleted
    }

    // Shared plans collection
    match /shared_plans/{planId} {
      allow read: if isAuthenticated();
      allow create: if isValidUser() &&
        request.resource.data.createdBy == request.auth.uid;
      allow update: if resource.data.createdBy == request.auth.uid;
      allow delete: if resource.data.createdBy == request.auth.uid || isAdmin();
    }
  }
}
```

---

## 🎯 Common Implementation Patterns

### Pattern 1: Creating User Data on Signup

```typescript
// Implementation in your signup flow
async function handleSignup(
  email: string,
  password: string,
  userData: UserData
) {
  try {
    // Step 1: Create auth account
    const user = await authService.signUp(
      email,
      password,
      userData.displayName
    );

    // Step 2: Create user profile (already handled in authService)
    // The authService.signUp method creates the profile automatically

    // Step 3: Create additional user collections
    await createUserCollections(user.uid);

    // Step 4: Navigate to onboarding or main app
    navigation.navigate('Onboarding');
  } catch (error) {
    console.error('Signup error:', error);
    showErrorAlert(error.message);
  }
}

async function createUserCollections(userId: string) {
  try {
    // Create initial statistics document
    const statsRef = doc(db, `users/${userId}/statistics/initial`);
    await setDoc(statsRef, {
      totalWorkouts: 0,
      totalHours: 0,
      currentStreak: 0,
      longestStreak: 0,
      createdAt: serverTimestamp(),
    });

    // Create initial preferences
    const prefsRef = doc(db, `users/${userId}/preferences/settings`);
    await setDoc(prefsRef, {
      notifications: true,
      darkMode: false,
      units: 'metric',
      language: 'en',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating user collections:', error);
    // Non-critical error, log but don't throw
  }
}
```

### Pattern 2: Saving Complex Training Plan Data

```typescript
// Saving a training plan with proper error handling
async function saveTrainingPlan(planData: TrainingPlanInput) {
  try {
    // Validate data first
    if (!planData.name || !planData.duration || !planData.daysPerWeek) {
      throw new Error('Missing required plan information');
    }

    // Prepare the plan document
    const trainingPlan = {
      userId: auth.currentUser!.uid,
      name: planData.name,
      description: planData.description || '',
      duration: planData.duration,
      daysPerWeek: planData.daysPerWeek,
      goals: planData.goals || [],
      equipment: planData.equipment || [],
      difficulty: planData.difficulty,
      status: 'active',
      currentWeek: 1,
      progress: 0,
      weeklySchedule: planData.weeklySchedule,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: auth.currentUser!.uid,
    };

    // Save using the service
    const savedPlan = await trainingPlansService.create(trainingPlan);

    // Create weekly breakdown subcollection
    await createWeeklyBreakdown(savedPlan.id, planData.weeklySchedule);

    return savedPlan;
  } catch (error) {
    console.error('Error saving training plan:', error);
    throw error;
  }
}

async function createWeeklyBreakdown(
  planId: string,
  weeklySchedule: WeeklySchedule
) {
  const batch = writeBatch(db);

  try {
    // Create a document for each week
    for (let week = 1; week <= planData.duration; week++) {
      const weekRef = doc(db, `training_plans/${planId}/weeks/week_${week}`);

      batch.set(weekRef, {
        weekNumber: week,
        schedule: weeklySchedule,
        completed: false,
        completedWorkouts: [],
        notes: '',
        createdAt: serverTimestamp(),
      });
    }

    await batch.commit();
  } catch (error) {
    console.error('Error creating weekly breakdown:', error);
    throw new Error('Failed to create weekly schedule');
  }
}
```

### Pattern 3: Real-time Data Synchronization

```typescript
// Subscribe to user's active training plans
function useActiveTrainingPlans() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const constraints = [
      where('userId', '==', auth.currentUser.uid),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
    ];

    const unsubscribe = trainingPlansService.subscribe(
      constraints,
      data => {
        setPlans(data);
        setLoading(false);
        setError(null);
      },
      error => {
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [auth.currentUser]);

  return { plans, loading, error };
}
```

### Pattern 4: Handling Offline Mode

```typescript
// Offline-aware data operations
class OfflineAwareService {
  private isOnline = true;

  constructor() {
    // Monitor network status
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  private async handleOnline() {
    this.isOnline = true;
    console.log('App is online, syncing data...');

    try {
      await enableNetwork(db);
      // Force sync any pending writes
      await this.syncPendingData();
    } catch (error) {
      console.error('Error going online:', error);
    }
  }

  private async handleOffline() {
    this.isOnline = false;
    console.log('App is offline, using cached data');

    try {
      await disableNetwork(db);
    } catch (error) {
      console.error('Error going offline:', error);
    }
  }

  async saveWithOfflineSupport(collection: string, data: any) {
    try {
      // Mark document with offline flag if offline
      if (!this.isOnline) {
        data.savedOffline = true;
        data.pendingSync = true;
      }

      const docRef = doc(collection(db, collection));
      await setDoc(docRef, data);

      // If offline, store reference for later sync
      if (!this.isOnline) {
        await this.storePendingSync(docRef.id, collection);
      }

      return docRef.id;
    } catch (error) {
      console.error('Save error:', error);
      throw error;
    }
  }

  private async storePendingSync(docId: string, collectionName: string) {
    const pending = (await AsyncStorage.getItem('pendingSync')) || '[]';
    const pendingArray = JSON.parse(pending);
    pendingArray.push({
      docId,
      collection: collectionName,
      timestamp: Date.now(),
    });
    await AsyncStorage.setItem('pendingSync', JSON.stringify(pendingArray));
  }

  private async syncPendingData() {
    const pending = (await AsyncStorage.getItem('pendingSync')) || '[]';
    const pendingArray = JSON.parse(pending);

    for (const item of pendingArray) {
      try {
        // Update document to remove offline flags
        const docRef = doc(db, item.collection, item.docId);
        await updateDoc(docRef, {
          savedOffline: false,
          pendingSync: false,
          syncedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Sync error for document:', item.docId, error);
      }
    }

    // Clear pending sync queue
    await AsyncStorage.removeItem('pendingSync');
  }
}
```

---

## ⚠️ Critical Error Scenarios & Solutions

### Scenario 1: Permission Denied Errors

```typescript
// Always check authentication before Firestore operations
async function safeFirestoreOperation() {
  // Check if user is authenticated
  if (!auth.currentUser) {
    throw new Error('Please sign in to continue');
  }

  try {
    // Attempt the operation
    const result = await someFirestoreOperation();
    return result;
  } catch (error) {
    if (error.code === 'permission-denied') {
      // Check if user profile exists
      const userProfile = await checkUserProfile(auth.currentUser.uid);
      if (!userProfile) {
        // Create missing profile
        await createUserProfile(auth.currentUser.uid);
        // Retry operation
        return await someFirestoreOperation();
      }
    }
    throw error;
  }
}
```

### Scenario 2: Data Not Saving

```typescript
// Comprehensive save operation with retry logic
async function robustSave(data: any, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Ensure user is authenticated
      if (!auth.currentUser) {
        await waitForAuth();
      }

      // Validate data
      validateData(data);

      // Attempt save
      const result = await saveToFirestore(data);

      // Verify save was successful
      const verification = await verifyDataSaved(result.id);
      if (verification) {
        return result;
      }

    } catch (error) {
      lastError = error;
      console.error(`Save attempt ${attempt} failed:`, error);

      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  throw new Error(`Failed to save after ${maxRetries
```
