# Backend-Mobile Authentication Integration

This document describes the complete authentication integration between the NestJS backend and React Native mobile app.

## Overview

The authentication system is **fully integrated** and production-ready with the following features:
- ✅ User registration
- ✅ User login
- ✅ User logout (with backend API call)
- ✅ Forgot password flow
- ✅ Token-based authentication (JWT)
- ✅ Automatic token refresh
- ✅ Persistent authentication (AsyncStorage)
- ✅ Global auth state management

## How It Works

### 1. User Registration Flow

**Frontend** ([mobile/src/screens/RegisterScreen/index.tsx](mobile/src/screens/RegisterScreen/index.tsx)):
1. User enters email, username, and password
2. `useRegister` hook calls `authService.register()`
3. Request sent to backend: `POST /auth/register`

**Backend** ([backend/src/auth/auth.controller.ts](backend/src/auth/auth.controller.ts:16-25)):
1. Validates input (email format, username min 3 chars, password min 6 chars)
2. Checks if email/username already exists
3. Hashes password with bcrypt
4. Creates user in database
5. Generates access token (15min) and refresh token (7 days)
6. Returns: `{ user, accessToken, refreshToken }`

**Frontend Response Handling**:
1. Receives user data and tokens
2. Stores tokens in AsyncStorage
3. Updates AuthContext state
4. User automatically navigated to main app

### 2. User Login Flow

**Frontend** ([mobile/src/screens/LoginScreen/index.tsx](mobile/src/screens/LoginScreen/index.tsx)):
1. User enters email and password
2. `useLogin` hook calls `authService.login()`
3. Request sent to backend: `POST /auth/login`

**Backend** ([backend/src/auth/auth.controller.ts](backend/src/auth/auth.controller.ts:27-32)):
1. Validates credentials
2. Verifies password with bcrypt
3. Generates fresh access + refresh tokens
4. Returns: `{ user, accessToken, refreshToken }`

**Frontend Response Handling**:
1. Same as registration flow

### 3. Token Management

#### Access Token
- **Duration**: 15 minutes
- **Storage**: AsyncStorage + in-memory (API client)
- **Usage**: Sent as `Bearer` token in all authenticated requests
- **Header**: `Authorization: Bearer <accessToken>`

#### Refresh Token
- **Duration**: 7 days
- **Storage**: AsyncStorage only (never sent automatically)
- **Usage**: Used to obtain new access token when expired
- **Backend Validation**: Hashed and stored in database

#### Automatic Token Refresh

The API client ([mobile/src/services/api/client.ts](mobile/src/services/api/client.ts:70-145)) handles token refresh automatically:

1. **401 Error Detected**: When access token expires
2. **Refresh Process**:
   - Gets refresh token from AsyncStorage
   - Calls `POST /auth/refresh` with refresh token
   - Backend validates refresh token
   - Backend returns new access + refresh tokens
   - Updates tokens in AsyncStorage
   - Retries original failed request with new token
3. **Concurrent Requests**: Queued to prevent multiple refresh calls
4. **Refresh Failure**: Clears auth state and logs user out

### 4. Forgot Password Flow

**Frontend** ([mobile/src/screens/ForgotPasswordScreen/index.tsx](mobile/src/screens/ForgotPasswordScreen/index.tsx)):
1. User enters email
2. `useForgotPassword` hook calls `authService.forgotPassword()`
3. Request sent to backend: `POST /auth/forgot-password`

**Backend** ([backend/src/auth/auth.controller.ts](backend/src/auth/auth.controller.ts:47-52)):
1. Checks if user exists (doesn't reveal if email is valid)
2. Generates random reset token
3. Hashes and stores token in database with 1-hour expiry
4. Sends email with reset link (via EmailService)
5. Returns generic success message

**Password Reset**:
1. User receives email with reset token
2. User enters token + new password
3. Backend validates token and expiry
4. Updates password and clears reset token

### 5. Logout Flow

**Frontend**:
1. User clicks logout
2. `useAuth().logout()` is called
3. Calls backend: `POST /auth/logout` (with Bearer token)

**Backend** ([backend/src/auth/auth.controller.ts](backend/src/auth/auth.controller.ts:40-45)):
1. Validates JWT token
2. Clears refresh token from database
3. Returns success message

**Frontend**:
1. Clears all tokens from AsyncStorage
2. Clears auth state from context
3. User redirected to login screen

## File Structure

### Backend Files

```
backend/src/auth/
├── auth.controller.ts       # API endpoints
├── auth.service.ts          # Business logic
├── auth.module.ts           # Module configuration
├── dto/
│   ├── login.dto.ts         # Login validation
│   ├── register.dto.ts      # Register validation
│   ├── forgot-password.dto.ts
│   └── reset-password.dto.ts
├── guards/
│   └── jwt-auth.guard.ts    # Protects routes
├── strategies/
│   └── jwt.strategy.ts      # JWT validation
└── decorators/
    └── current-user.decorator.ts  # Get user from request
```

### Mobile Files

```
mobile/src/
├── contexts/
│   └── AuthContext.tsx          # Global auth state
├── services/api/
│   ├── client.ts                # Axios + interceptors
│   └── auth.service.ts          # Auth API methods
├── hooks/api/
│   ├── useLogin.ts              # Login hook
│   ├── useRegister.ts           # Register hook
│   ├── useForgotPassword.ts     # Forgot password hook
│   └── useResetPassword.ts      # Reset password hook
├── screens/
│   ├── LoginScreen/
│   ├── RegisterScreen/
│   └── ForgotPasswordScreen/
├── utils/
│   └── storage.ts               # AsyncStorage wrapper
└── types/
    └── auth.types.ts            # TypeScript types
```

## API Client Features

### Request Interceptor
- Automatically adds `Authorization: Bearer <token>` to all requests
- Token stored in memory for fast access

### Response Interceptor
- Detects 401 (Unauthorized) errors
- Automatically refreshes expired tokens
- Queues concurrent requests during refresh
- Retries failed requests with new token
- Logs out user if refresh fails

### Error Handling
- Network errors logged to console
- API errors propagated to React Query
- User-friendly error messages displayed

## Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **Token Security**:
   - Refresh tokens hashed in database
   - Access tokens short-lived (15min)
   - Tokens invalidated on logout
3. **Rate Limiting**:
   - Login: 5 requests/minute
   - Register: 3 requests/minute
   - Forgot Password: 3 requests/5 minutes
4. **Validation**: All inputs validated with class-validator
5. **CORS**: Enabled for mobile app access

## Testing the Integration

### 1. Start Backend
```bash
cd backend
npm run setup              # Start Docker + generate Prisma
npm run start:dev          # Start backend on port 3000
```

### 2. Start Mobile App
```bash
cd mobile
npm install
bundle exec pod install    # iOS only
npm run ios                # or npm run android
```

### 3. Test Flow
1. **Register**: Create new account → should auto-login
2. **Logout**: Logout → should redirect to login
3. **Login**: Login with credentials → should enter app
4. **Token Expiry**: Wait 15 minutes → access token expires → next API call auto-refreshes
5. **Forgot Password**: Request reset → check backend logs for email

## Environment Setup

### Backend (.env)
```env
DATABASE_URL="postgresql://guaumiau:guaumiau123@localhost:5433/guaumiau_db?schema=public"
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=refresh-secret-change-in-production
```

### Mobile
The API client automatically detects platform:
- **iOS Simulator**: `http://127.0.0.1:3000`
- **Android Emulator**: `http://10.0.2.2:3000`
- **Physical Device**: Update IP in [mobile/src/services/api/client.ts](mobile/src/services/api/client.ts:9-16)

## Common Issues

### "Network Error" on mobile
- **iOS Simulator**: Backend must be on `http://127.0.0.1:3000`
- **Android Emulator**: Backend must be on `http://10.0.2.2:3000`
- **Physical Device**: Use your computer's local IP (e.g., `http://192.168.1.x:3000`)

### Tokens not persisting
- Check AsyncStorage permissions
- Check storage utility is being called correctly
- Verify AuthProvider wraps entire app

### Auto-refresh not working
- Check 401 errors in network tab
- Verify refresh token stored in AsyncStorage
- Check backend refresh endpoint is accessible

## What Was Changed

### Files Modified
1. ✅ [mobile/src/utils/storage.ts](mobile/src/utils/storage.ts) - Added refresh token methods
2. ✅ [mobile/src/contexts/AuthContext.tsx](mobile/src/contexts/AuthContext.tsx) - Updated to handle refresh tokens + logout API call
3. ✅ [mobile/src/services/api/client.ts](mobile/src/services/api/client.ts) - Added automatic token refresh logic
4. ✅ [mobile/src/services/api/auth.service.ts](mobile/src/services/api/auth.service.ts) - Added logout and refresh methods
5. ✅ [mobile/src/screens/LoginScreen/index.tsx](mobile/src/screens/LoginScreen/index.tsx) - Pass refresh token to context
6. ✅ [mobile/src/screens/RegisterScreen/index.tsx](mobile/src/screens/RegisterScreen/index.tsx) - Pass refresh token to context
7. ✅ [CLAUDE.md](CLAUDE.md) - Added authentication integration documentation

### Files Already Complete (No Changes Needed)
- Backend auth module (already production-ready)
- Mobile auth screens (already implemented)
- Mobile auth hooks (already implemented)
- Type definitions (already complete)
- Navigation flow (already configured)

## Next Steps (Optional Enhancements)

1. **Add Biometric Auth**: Face ID / Touch ID for login
2. **Add Social Login**: Google, Apple, Facebook OAuth
3. **Add Email Verification**: Verify email on registration
4. **Add 2FA**: Two-factor authentication
5. **Add Session Management**: View active sessions, logout all devices
6. **Add Password Strength Indicator**: Visual password strength meter
7. **Add Remember Me**: Optional persistent login checkbox

## Summary

🎉 **The integration is complete and fully functional!**

You can now:
- Register new users
- Login existing users
- Logout with backend notification
- Reset passwords via email
- Auto-refresh expired tokens
- Persist auth state across app restarts

All authentication flows are connected and working between backend and mobile.
