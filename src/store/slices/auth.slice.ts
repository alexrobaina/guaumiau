import { StateCreator } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser, AuthService } from '@/lib/firebase/auth';
import { auth } from '@/lib/firebase/config';
import { RootState } from '../types';

export interface AuthSlice {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendEmailVerification: () => Promise<void>;
  debugAutoLogin: () => Promise<void>;
  
  // State management
  setUser: (user: AuthUser | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  clearError: () => void;
  
  // Auth state listener
  initializeAuth: () => void;
}

const AUTH_STORAGE_KEY = 'cruxclimb_auth_user';

export const createAuthSlice: StateCreator<
  RootState,
  [['zustand/immer', never]],
  [],
  AuthSlice
> = (set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  // DEBUG: Auto-login function
  debugAutoLogin: async () => {
    console.log('🔧 DEBUG: Auto-login attempt with stored credentials...');
    try {
      await get().login('alexrobainaph@gmail.com', 'salsamora3000');
      console.log('✅ DEBUG: Auto-login successful!');
    } catch (error) {
      console.error('❌ DEBUG: Auto-login failed:', error);
    }
  },

  // Actions
  login: async (email: string, password: string) => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    try {
      const user = await AuthService.login({ email, password });
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      
      set((state) => {
        state.user = user;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      });
    } catch (error) {
      set((state) => {
        state.error = error instanceof Error ? error.message : 'Login failed';
        state.isLoading = false;
      });
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    try {
      const user = await AuthService.register({ email, password, name });
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      
      set((state) => {
        state.user = user;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      });
    } catch (error) {
      set((state) => {
        state.error = error instanceof Error ? error.message : 'Registration failed';
        state.isLoading = false;
      });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    try {
      const user = await AuthService.signInWithGoogle();
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      
      set((state) => {
        state.user = user;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      });
    } catch (error) {
      set((state) => {
        state.error = error instanceof Error ? error.message : 'Google sign-in failed';
        state.isLoading = false;
      });
      throw error;
    }
  },

  logout: async () => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    try {
      await AuthService.logout();
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      
      set((state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
    } catch (error) {
      set((state) => {
        state.error = error instanceof Error ? error.message : 'Logout failed';
        state.isLoading = false;
      });
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    try {
      await AuthService.resetPassword(email);
      set((state) => {
        state.isLoading = false;
      });
    } catch (error) {
      set((state) => {
        state.error = error instanceof Error ? error.message : 'Password reset failed';
        state.isLoading = false;
      });
      throw error;
    }
  },

  resendEmailVerification: async () => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    try {
      await AuthService.resendEmailVerification();
      set((state) => {
        state.isLoading = false;
      });
    } catch (error) {
      set((state) => {
        state.error = error instanceof Error ? error.message : 'Failed to resend verification email';
        state.isLoading = false;
      });
      throw error;
    }
  },

  // State management
  setUser: (user: AuthUser | null) =>
    set((state) => {
      state.user = user;
      state.isAuthenticated = !!user;
    }),

  setAuthLoading: (loading: boolean) =>
    set((state) => {
      state.isLoading = loading;
    }),

  setError: (error: string | null) =>
    set((state) => {
      state.error = error;
    }),

  setInitialized: (initialized: boolean) =>
    set((state) => {
      state.isInitialized = initialized;
    }),

  clearError: () =>
    set((state) => {
      state.error = null;
    }),

  // Auth state listener
  initializeAuth: async () => {
    const authSlice = get();
    
    // First, try to restore user from AsyncStorage
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser) as AuthUser;
        authSlice.setUser(user);
        console.log('✅ User restored from AsyncStorage:', user.email);
        
        // 🔧 DEBUG: Check Firebase Auth current user
        console.log('🔍 Firebase Auth current user:', auth.currentUser?.email || 'null');
        console.log('⚠️ WARNING: User in AsyncStorage but not in Firebase Auth - need to login!');
      }
    } catch (error) {
      console.warn('⚠️ Failed to restore user from AsyncStorage:', error);
    }
    
    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const user: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          phoneNumber: firebaseUser.phoneNumber,
        };

        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        authSlice.setUser(user);
        
        // Sync onboarding data to Firebase if user has completed onboarding locally
        try {
          const rootState = get();
          if (rootState.syncOnboardingToFirebase) {
            await rootState.syncOnboardingToFirebase();
          }
        } catch (error) {
          console.warn('Failed to sync onboarding data after login:', error);
        }
      } else {
        // User is signed out
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        authSlice.setUser(null);
      }
      
      authSlice.setInitialized(true);
      authSlice.setAuthLoading(false);
    });

    // Return unsubscribe function
    return unsubscribe;
  },
});
