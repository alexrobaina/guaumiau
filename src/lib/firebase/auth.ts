import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User,
  AuthError,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { auth } from './config';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// User transformation helper
const transformUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  emailVerified: user.emailVerified,
  phoneNumber: user.phoneNumber,
});

// Error message mapping
const getErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email address is already registered. Please use a different email or try logging in.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 8 characters long and contain uppercase, lowercase, and numbers.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/invalid-verification-code':
      return 'Invalid verification code. Please try again.';
    case 'auth/code-expired':
      return 'Verification code has expired. Please request a new one.';
    case 'auth/missing-verification-code':
      return 'Please enter the verification code.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    case 'auth/credential-already-in-use':
      return 'This credential is already associated with a different account.';
    case 'auth/unauthorized-continue-url':
      return 'Unable to send password reset email. Please try again or contact support.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

// Authentication Service
export class AuthService {
  // Register with email and password
  static async register({ email, password, name }: RegisterData): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      return transformUser(userCredential.user);
    } catch (error) {
      throw new Error(getErrorMessage(error as AuthError));
    }
  }

  // Login with email and password
  static async login({ email, password }: LoginData): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      return transformUser(userCredential.user);
    } catch (error) {
      throw new Error(getErrorMessage(error as AuthError));
    }
  }

  // Google Sign-In
  static async signInWithGoogle(): Promise<AuthUser> {
    try {
      // Configure Google provider
      googleProvider.addScope('email');
      googleProvider.addScope('profile');
      
      // Check if running on web
      if (Platform.OS === 'web') {
        // Use popup method for web
        const userCredential: UserCredential = await signInWithPopup(auth, googleProvider);
        return transformUser(userCredential.user);
      } else {
        // For React Native, use Expo AuthSession with PKCE
        const { AuthRequest, CodeChallengeMethod } = await import('expo-auth-session');
        const { makeRedirectUri } = await import('expo-auth-session');
        const { digestStringAsync, CryptoDigestAlgorithm, CryptoEncoding } = await import('expo-crypto');
        
        // Get the client IDs from environment
        const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
        const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
        
        if (!androidClientId || !iosClientId) {
          throw new Error(
            'Google Sign-In requires EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID and EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ' +
            'environment variables to be set. Please check your .env file.'
          );
        }
        
        // Generate PKCE verifier and challenge
        const codeVerifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const codeChallenge = await digestStringAsync(
          CryptoDigestAlgorithm.SHA256,
          codeVerifier,
          { encoding: CryptoEncoding.BASE64 }
        );
        
        // Configure AuthRequest with PKCE
        const request = new AuthRequest({
          clientId: Platform.OS === 'android' ? androidClientId : iosClientId,
          scopes: ['openid', 'profile', 'email'],
          redirectUri: makeRedirectUri({
            scheme: 'com.wayex.cruxclimb'
          }),
          responseType: 'code',
          codeChallenge,
          codeChallengeMethod: CodeChallengeMethod.S256,
        });
        
        const result = await request.promptAsync({
          authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        });
        
        if (result.type === 'success' && result.params.code) {
          // Exchange authorization code for tokens
          const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: Platform.OS === 'android' ? androidClientId : iosClientId,
              code: result.params.code,
              redirect_uri: makeRedirectUri({
                scheme: 'com.wayex.cruxclimb'
              }),
              grant_type: 'authorization_code',
              code_verifier: codeVerifier,
            }).toString(),
          });
          
          const tokens = await tokenResponse.json();
          
          if (tokens.id_token) {
            // Create Firebase credential from Google ID token
            const credential = GoogleAuthProvider.credential(tokens.id_token);
            const userCredential = await signInWithCredential(auth, credential);
            return transformUser(userCredential.user);
          } else {
            throw new Error('Failed to get ID token from Google');
          }
        } else {
          throw new Error('Google Sign-In was cancelled or failed');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(getErrorMessage(error as AuthError));
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(getErrorMessage(error as AuthError));
    }
  }

  // Send password reset email
  static async resetPassword(email: string): Promise<void> {
    try {
      // For development and testing, use Firebase's default continue URL
      // In production, you'll need to add your domain to Firebase's authorized domains
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(getErrorMessage(error as AuthError));
    }
  }

  // Resend email verification
  static async resendEmailVerification(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }

      if (user.emailVerified) {
        throw new Error('Email is already verified');
      }

      await sendEmailVerification(user);
    } catch (error) {
      throw new Error(getErrorMessage(error as AuthError));
    }
  }

  // Update user profile
  static async updateUserProfile(data: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }

      await updateProfile(user, data);
    } catch (error) {
      throw new Error(getErrorMessage(error as AuthError));
    }
  }

  // Get current user
  static getCurrentUser(): AuthUser | null {
    const user = auth.currentUser;
    return user ? transformUser(user) : null;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  // Check if user email is verified
  static isEmailVerified(): boolean {
    return auth.currentUser?.emailVerified ?? false;
  }

  // Get auth token
  static async getIdToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }

  // Refresh auth token
  static async refreshToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      return await user.getIdToken(true); // Force refresh
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }
}

export default AuthService;