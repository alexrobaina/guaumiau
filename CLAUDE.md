# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Guaumiau is a full-stack application with a NestJS backend and React Native mobile frontend. The project appears to be a timer/schedule app with user authentication, achievements, and profile management.

## Architecture

### Backend (NestJS)
- **Framework**: NestJS with TypeScript (ES2023)
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: S3-compatible storage (LocalStack for local development)
- **Authentication**: JWT-based auth with refresh tokens and password reset functionality
- **Modules**:
  - `auth`: Authentication and authorization (JWT strategy, guards, decorators)
  - `prisma`: Database client wrapper
  - `s3`: File storage operations
  - `email`: Email service (using nodemailer)
  - `notifications`: Push notifications (Firebase Admin)
- **Key Features**:
  - Rate limiting via `@nestjs/throttler` (10 requests per 60 seconds)
  - Global validation pipes with class-validator
  - CORS enabled
  - Custom Prisma client output path: `backend/generated/prisma`

### Mobile (React Native)
- **Framework**: React Native 0.81.4 with TypeScript
- **State Management**: MobX (stores in `src/stores`)
- **Data Fetching**: TanStack React Query (config in `src/config/queryClient.ts`)
- **Navigation**: React Navigation (stack and bottom tabs)
  - `AppNavigator`: Root navigation setup
  - `AuthNavigator`: Authentication flow (Login, Register, ForgotPassword)
  - `MainNavigator`: Authenticated user navigation (Home, Schedule, Achievements, Profile, Settings)
  - `RootNavigator`: Conditional rendering based on auth state
- **Key Features**:
  - Path aliases via babel-plugin-module-resolver (`@`, `@components`, `@screens`, etc.)
  - API client in `src/services/api`
  - Screens: Home, Schedule, Achievements, Profile, Settings, Login, Register, ForgotPassword

## Development Commands

### Backend (run from `backend/` directory)

**Setup and Infrastructure:**
```bash
npm run setup              # Start Docker services and generate Prisma client
npm run docker:up          # Start PostgreSQL and LocalStack containers
npm run docker:down        # Stop all containers
npm run docker:logs        # View container logs
npm run docker:restart     # Restart containers
```

**Database (Prisma):**
```bash
npm run prisma:generate    # Generate Prisma client (outputs to generated/prisma)
npm run prisma:migrate     # Run database migrations
npm run prisma:studio      # Open Prisma Studio GUI
```

**Development:**
```bash
npm install                # Install dependencies
npm run start:dev          # Start in watch mode (recommended for development)
npm run start              # Start normally
npm run start:debug        # Start with debugger
npm run build              # Build for production
npm run start:prod         # Run production build
```

**Code Quality:**
```bash
npm run lint               # Lint and auto-fix TypeScript files
npm run format             # Format code with Prettier
```

**Testing:**
```bash
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Generate coverage report
npm run test:e2e           # Run end-to-end tests
npm run test:debug         # Debug tests
```

### Mobile (run from `mobile/` directory)

**Setup:**
```bash
npm install                # Install dependencies
bundle install             # Install Ruby dependencies (for CocoaPods)
bundle exec pod install    # Install iOS native dependencies (required before first iOS run)
```

**Development:**
```bash
npm start                  # Start Metro bundler
npm run dev                # Start Metro with cache reset
npm run ios                # Build and run iOS app
npm run ios:logs           # View iOS logs
npm run android            # Build and run Android app
```

**Code Quality:**
```bash
npm run lint               # Lint code
npm run test               # Run tests
```

## Important Notes

### Backend
- **Port Configuration**: Backend runs on port 3000 by default (configurable via `PORT` env var)
- **PostgreSQL**: Exposed on port 5433 (maps to container's 5432)
- **LocalStack S3**: Runs on port 4566 for local S3 operations
- **Environment Variables**: Copy `.env.example` to `.env` and configure:
  - `DATABASE_URL`: PostgreSQL connection string
  - `FIREBASE_SERVICE_ACCOUNT`: Firebase service account JSON for push notifications
  - AWS S3 settings for file storage (uses LocalStack locally)
- **Prisma Client**: Generated to `backend/generated/prisma` instead of default location
- **User Model**: Includes email, username, password (hashed with bcryptjs), avatar, refresh tokens, and password reset tokens

### Mobile
- **iOS Development**: Always run `bundle exec pod install` when native dependencies change
- **Path Aliases**: Use `@/path` or `@components`, `@screens`, etc. for imports
- **API Integration**: Configure backend URL in API client (`src/services/api/client.ts`)
- **Navigation Structure**:
  - Authenticated users see bottom tabs (Home, Schedule, Achievements, Profile, Settings)
  - Unauthenticated users see auth stack (Login, Register, ForgotPassword)

### Development Workflow
1. Start backend infrastructure: `cd backend && npm run setup`
2. Start backend dev server: `npm run start:dev`
3. Start mobile Metro: `cd mobile && npm start`
4. Run mobile app: `npm run ios` or `npm run android`

### Testing
- After running tests or the app, always kill any ports that may still be running to avoid conflicts

## Database Schema

The Prisma schema uses:
- UUID primary keys
- PostgreSQL as the database provider
- User model with authentication fields (email, username, password, refreshToken, resetPasswordToken)
- Timestamps (createdAt, updatedAt)

## Authentication Integration

The backend and mobile app are fully integrated for authentication:

### Backend API Endpoints
- `POST /auth/register` - Register new user (returns user + tokens)
- `POST /auth/login` - Login user (returns user + tokens)
- `POST /auth/logout` - Logout user (requires auth)
- `POST /auth/refresh` - Refresh access token using refresh token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/me` - Get current user info (requires auth)

### Mobile Authentication Flow
1. **Login/Register**: User credentials sent to backend → receives user data + access/refresh tokens
2. **Token Storage**: Tokens stored in AsyncStorage via `storage` utility ([mobile/src/utils/storage.ts](mobile/src/utils/storage.ts))
3. **Auth Context**: [mobile/src/contexts/AuthContext.tsx](mobile/src/contexts/AuthContext.tsx) manages auth state globally
4. **API Client**: [mobile/src/services/api/client.ts](mobile/src/services/api/client.ts) automatically:
   - Adds Bearer token to all requests
   - Refreshes expired tokens automatically (on 401 errors)
   - Handles logout on refresh failure
5. **Navigation**: [mobile/src/navigation/RootNavigator.tsx](mobile/src/navigation/RootNavigator.tsx) shows auth screens or main app based on auth state

### Token Management
- **Access Token**: 15-minute expiry, used for API requests
- **Refresh Token**: 7-day expiry, used to get new access tokens
- **Auto-refresh**: API client automatically refreshes tokens when access token expires
- **Concurrent Requests**: Token refresh queues multiple requests to avoid race conditions

### Key Files
- Backend: [backend/src/auth/](backend/src/auth/) - Auth module with controllers, services, DTOs, guards
- Mobile Auth Hooks: [mobile/src/hooks/api/](mobile/src/hooks/api/) - React Query hooks for auth operations
- Mobile Auth Service: [mobile/src/services/api/auth.service.ts](mobile/src/services/api/auth.service.ts) - API methods
- Auth Screens: [mobile/src/screens/LoginScreen/](mobile/src/screens/LoginScreen/), [RegisterScreen/](mobile/src/screens/RegisterScreen/), [ForgotPasswordScreen/](mobile/src/screens/ForgotPasswordScreen/)
