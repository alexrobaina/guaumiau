# CruxClimb - Firebase Authentication Implementation Prompt

## Prompt for Claude

I need you to create a complete Firebase authentication flow for my React Native Expo app called CruxClimb. Here are the technical requirements and context:

### Tech Stack
- **Framework**: React Native with Expo SDK 51
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS) with tailwind-variants
- **State Management**: Zustand for client state
- **Forms**: Formik with Yup validation
- **Backend**: Firebase Authentication
- **TypeScript**: Strict mode enabled

### Project Structure
```
app/
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── register.tsx
│   ├── forgot-password.tsx
│   └── verify-phone.tsx
├── (tabs)/
│   └── [protected routes]
lib/
├── firebase/
│   ├── config.ts
│   └── auth.ts
components/
├── atoms/
├── molecules/
└── organisms/
store/
└── slices/
    └── auth.slice.ts
```

### Authentication Requirements

1. **Email/Password Authentication**
   - Registration with email validation
   - Login with remember me option
   - Password strength requirements (min 8 chars, uppercase, lowercase, number)
   - Email verification after registration

2. **Social Login**
   - Google Sign-In integration
   - Apple Sign-In (iOS only)
   - Handle account linking for same email

3. **Phone Authentication (Optional)**
   - Phone number verification with SMS OTP
   - Can be added as secondary authentication
   - International phone number support

4. **Password Recovery**
   - Send password reset email
   - Custom reset email template
   - Redirect handling after reset

### Firebase Configuration Needed

I need complete implementation including:

1. **Firebase Configuration File** (`lib/firebase/config.ts`)
   - Initialize Firebase app
   - Configure authentication with persistence
   - Setup emulators for local development
   - Handle environment variables

2. **Authentication Service** (`lib/firebase/auth.ts`)
   - All auth methods (register, login, logout, etc.)
   - Error handling with user-friendly messages
   - Social provider setup
   - Phone auth setup

3. **Auth Store Slice** (`store/slices/auth.slice.ts`)
   - User state management
   - Authentication status
   - Loading states
   - Error states
   - Persist auth state with AsyncStorage

4. **Login Screen** (`app/(auth)/login.tsx`)
   - Formik form with Yup validation
   - Email and password inputs
   - Social login buttons
   - Remember me checkbox
   - Forgot password link
   - Navigate to register
   - Loading states with NativeWind styling

5. **Register Screen** (`app/(auth)/register.tsx`)
   - Full name, email, password, confirm password
   - Terms acceptance checkbox
   - Social sign-up options
   - Form validation with Yup
   - Success message and email verification notice

6. **Forgot Password Screen** (`app/(auth)/forgot-password.tsx`)
   - Email input with validation
   - Success/error messages
   - Back to login navigation

7. **Phone Verification Screen** (`app/(auth)/verify-phone.tsx`)
   - Phone number input with country code
   - OTP input (6 digits)
   - Resend OTP functionality
   - Timer for resend

8. **Auth Layout** (`app/(auth)/_layout.tsx`)
   - Redirect authenticated users to main app
   - Consistent styling across auth screens
   - Handle deep links for email verification

9. **Protected Route Wrapper**
   - HOC or component to protect authenticated routes
   - Redirect to login if not authenticated
   - Loading state while checking auth

### Styling Requirements

Use these NativeWind classes and tailwind-variants:
- Dark mode support (dark: prefix)
- Primary color: #FF6B35 (orange)
- Form inputs with error states
- Loading spinners
- Social button styles (Google, Apple)

### Color Palette
```javascript
primary: '#FF6B35' // Orange
secondary: '#00A5A5' // Teal  
tertiary: '#FFC911' // Yellow
error: '#EF4444'
success: '#10B981'
```

### Form Validation Schemas (Yup)

```typescript
loginSchema: {
  email: email().required(),
  password: string().min(8).required()
}

registerSchema: {
  name: string().min(2).required(),
  email: email().required(),
  password: string().min(8).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
  confirmPassword: oneOf([ref('password')]).required(),
  acceptTerms: boolean().oneOf([true]).required()
}
```

### Error Handling

Handle these Firebase auth errors with user-friendly messages:
- auth/email-already-in-use
- auth/invalid-email
- auth/weak-password
- auth/user-not-found
- auth/wrong-password
- auth/too-many-requests
- auth/network-request-failed
- auth/invalid-verification-code

### Environment Variables

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=

# For Google Sign In
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
```

### Additional Requirements

1. **Security Rules** - Provide Firebase security rules for authentication
2. **Email Templates** - Custom email templates for verification and password reset
3. **Deep Linking** - Handle email verification and password reset links
4. **Persistence** - Keep users logged in across app restarts
5. **Token Refresh** - Handle token expiration automatically
6. **Anonymous Auth** - Option to try app without registration

### Code Quality Requirements

- TypeScript with proper types for all Firebase methods
- Error boundaries for auth screens
- Loading states for all async operations
- Accessibility labels for screen readers
- Proper keyboard handling (next button, dismiss)
- Safe area handling for different devices

Please provide complete, production-ready code with all error handling, loading states, and edge cases covered. Include comments explaining complex logic and Firebase-specific configurations.

---

## Firebase Project Setup Instructions

### 1. Create Firebase Project

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Authentication
# - Firestore
# - Storage
# - Emulators (for local development)
```

### 2. Enable Authentication Methods

In Firebase Console (https://console.firebase.google.com):

1. Go to Authentication → Sign-in method
2. Enable:
   - Email/Password
   - Google
   - Phone
   - Anonymous (optional)

### 3. Configure OAuth Providers

#### Google Sign-In Setup:
1. Go to Google Cloud Console
2. Create OAuth 2.0 Client IDs for:
   - Web application
   - iOS application (add bundle ID)
   - Android application (add SHA-1 fingerprint)

#### iOS Configuration:
1. Add `GoogleService-Info.plist` to iOS project
2. Configure URL schemes in `app.json`:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "app.cruxclimb.mobile",
      "googleServicesFile": "./GoogleService-Info.plist",
      "config": {
        "googleSignIn": {
          "reservedClientId": "YOUR_REVERSED_CLIENT_ID"
        }
      }
    }
  }
}
```

#### Android Configuration:
1. Add `google-services.json` to Android project
2. Add SHA-1 fingerprint to Firebase Console:

```bash
# Get debug SHA-1
cd android && ./gradlew signingReport

# Get production SHA-1
keytool -list -v -keystore your-release-key.keystore
```

### 4. Install Required Packages

```bash
# Core Firebase
npm install firebase

# Firebase Auth
npm install @react-native-firebase/auth
npm install @react-native-firebase/app

# Google Sign In
npm install @react-native-google-signin/google-signin

# Apple Sign In (iOS only)
npm install @invertase/react-native-apple-authentication

# Phone Auth Dependencies
npm install react-native-otp-textinput
npm install react-native-confirmation-code-field

# Async Storage for persistence
npm install @react-native-async-storage/async-storage
```

### 5. iOS Additional Setup

Add to `ios/Podfile`:

```ruby
pod 'Firebase/Auth'
pod 'GoogleSignIn'
```

Add to `Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>YOUR_REVERSED_CLIENT_ID</string>
    </array>
  </dict>
</array>
```

### 6. Security Rules

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public workout templates
    match /workouts/{workoutId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 7. Email Templates

In Firebase Console → Authentication → Templates:

**Email Verification Template:**
```html
Subject: Verify your CruxClimb account

Hi %DISPLAY_NAME%,

Welcome to CruxClimb! Please verify your email address by clicking the link below:

%LINK%

This link will expire in 24 hours.

Happy climbing!
The CruxClimb Team
```

**Password Reset Template:**
```html
Subject: Reset your CruxClimb password

Hi %DISPLAY_NAME%,

We received a request to reset your password. Click the link below to create a new password:

%LINK%

If you didn't request this, you can safely ignore this email.

Best regards,
The CruxClimb Team
```

### 8. Test Configuration

```typescript
// Test Firebase connection
const testFirebase = async () => {
  try {
    // Test auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'test@example.com',
      'Test1234!'
    );
    console.log('Auth working:', userCredential.user.uid);
    
    // Cleanup
    await userCredential.user.delete();
  } catch (error) {
    console.error('Firebase test failed:', error);
  }
};
```

---

## Expected Deliverables

Please provide:

1. ✅ Complete Firebase configuration file with error handling
2. ✅ Authentication service with all methods
3. ✅ Zustand auth store implementation
4. ✅ All auth screens with Formik forms
5. ✅ Validation schemas with Yup
6. ✅ Protected route wrapper
7. ✅ Error handling utilities
8. ✅ Loading states and animations
9. ✅ TypeScript types for all auth objects
10. ✅ Comments and documentation

The code should be production-ready with proper error handling, loading states, and user feedback for all scenarios.