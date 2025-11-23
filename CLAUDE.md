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
  - **Deep Linking**: Full support for custom URL schemes (`guaumiau://`) and universal links (`https://guaumiau.app`)
    - Configuration in `src/navigation/linking.ts`
    - Utilities in `src/utils/deepLinking.ts`
    - Hooks in `src/hooks/useDeepLinking.ts`
    - Testing script: `npm run deeplink:test:ios` or `npm run deeplink:test:android`
    - Documentation: `docs/deep-linking-guide.md`

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

### FRONTEND

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native 0.81.4 mobile application called "ZHMobile" built with TypeScript. The project uses pnpm for package management and includes Apollo Client for GraphQL operations, MobX for state management, and React Native Safe Area Context for safe area handling.

## Technology Stack

- **React Native**: 0.81.4
- **Use icons lucide for icons**
- **React**: 19.1.0
- **TypeScript**: 5.8.3
- **State Management**: MobX 6.15.0 with mobx-react-lite
- **API Client**: Apollo Client 4.0.7 with GraphQL support and file upload capabilities (apollo-upload-client)
- **Package Manager**: pnpm (requires Node.js >=20)

## Essential Commands

### Development

```bash
# Install dependencies
pnpm install

# Start Metro bundler
pnpm start

# Run on Android (requires Android emulator or connected device)
pnpm run android

# Run on iOS (requires Xcode and simulator setup)
pnpm run ios
```

### iOS Setup

iOS development requires CocoaPods dependencies to be installed:

```bash
# First time setup (install Ruby bundler)
bundle install

# Install/update CocoaPods dependencies (run after updating native deps)
bundle exec pod install
```

### Testing and Quality

```bash
# Run all tests
pnpm test

# Lint code
pnpm run lint
```

## Code Architecture

### Directory Structure

```
src/
├── components/       # Reusable UI components
├── screens/          # Screen-level components
├── navigation/       # Navigation configuration
├── stores/           # MobX stores
├── services/         # External services (API, GraphQL, etc.)
│   └── apollo/       # Apollo Client configuration
├── types/            # TypeScript type definitions
└── utils/            # Utility functions and helpers
```

### Path Aliases

The following TypeScript path aliases are configured for cleaner imports:

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@screens/*` → `src/screens/*`
- `@stores/*` → `src/stores/*`
- `@services/*` → `src/services/*`
- `@navigation/*` → `src/navigation/*`
- `@types/*` → `src/types/*`
- `@utils/*` → `src/utils/*`

Example: `import { HomeScreen } from '@screens/HomeScreen';`

### State Management (MobX)

- **Root Store Pattern**: [src/stores/RootStore.ts](src/stores/RootStore.ts) aggregates all domain stores
- **Provider**: [src/stores/RootStoreProvider.tsx](src/stores/RootStoreProvider.tsx) wraps the app with React context
- **Hook**: Use `useRootStore()` to access stores in components
- **Auto Observable**: Stores use `makeAutoObservable` for reactive state
- Add new domain stores to `RootStore` (e.g., `userStore`, `authStore`)

### GraphQL Integration (Apollo Client)

- **Configuration**: [src/services/apollo/client.ts](src/services/apollo/client.ts)
- **File Upload Support**: Uses `apollo-upload-client` for multipart uploads
- **Default Policies**: Cache-and-network for queries, network-only for mutations
- **Environment**: Set `GRAPHQL_ENDPOINT` in your environment or update the default endpoint
- **Usage**: Access via `useQuery`, `useMutation` hooks from `@apollo/client`

### Application Entry

- **Main App**: [src/App.tsx](src/App.tsx) - Wraps app with providers (Apollo, MobX, SafeArea)
- **Navigation**: [src/navigation/AppNavigator.tsx](src/navigation/AppNavigator.tsx) - Main navigation container
- **Screens**: Located in [src/screens/](src/screens/) directory

## Code Standards

### TypeScript Configuration

- Uses `@react-native/typescript-config` as base
- JSX mode: `react-jsx`
- Includes all `.ts` and `.tsx` files
- Excludes `node_modules` and `Pods`

### Linting and Formatting

- **ESLint**: Extends `@react-native` and Prettier configs with TypeScript support
- **Prettier**: Configured with single quotes, trailing commas, 100 character line width, 2-space tabs
- **Rules**:
  - Prettier violations are errors
  - Unused TypeScript variables are errors (except those prefixed with `_`)
  - Inline styles trigger warnings

### Testing

- Jest with `react-native` preset
- Use `react-test-renderer` for component testing
- Tests are located in `__tests__/` directory

## Platform-Specific Considerations

### Android

Build configuration is in [android/](android/) directory.

### iOS

- Native code is in [ios/](ios/) directory
- Requires CocoaPods for dependency management
- Always run `bundle exec pod install` after modifying native dependencies

### Atomic Design Architecture

The UI components must follow the Atomic Design methodology with this strict hierarchy:
src/components/
├── atoms/ # Basic building blocks
│ ├── Button/
│ ├── Text/
│ ├── Input/
│ ├── Icon/
│ └── Spinner/
├── molecules/ # Combinations of atoms
│ ├── FormField/
│ ├── ListItem/
│ ├── Card/
│ └── SearchBar/
├── organisms/ # Complex components
│ ├── Header/
│ ├── LoginForm/
│ ├── MapView/
│ └── ImageUploader/
├── templates/ # Page layouts
│ ├── AuthLayout/
│ ├── MainLayout/
│ └── ModalLayout/
└── screens/ # Final pages
├── LoginScreen/
├── HomeScreen/
└── MapScreen/

### Rules for Atomic Components:

Atoms are pure, stateless components that receive only props
Molecules can have local state but no business logic
Organisms can connect to stores and contain business logic
Templates define layout structure only
Screens compose everything and handle navigation

### Component File Structure:

components/atoms/Button/
├── index.tsx # Main component
├── Button.types.ts # TypeScript interfaces
├── Button.styles.ts # StyleSheet styles
└── Button.test.tsx # Unit tests

### Functional Programming Principles

- All code must follow functional programming paradigms:
- Pure Functions
- Immutability
- Function Composition
- Higher-Order Functions

### Custom Hooks Architecture

All API calls and business logic must be encapsulated in custom hooks:
Folder Structure:
src/
├── hooks/
│ ├── api/ # API-related hooks
│ │ ├── useQuery.ts
│ │ ├── useMutation.ts
│ │ └── useSubscription.ts
│ ├── auth/ # Authentication hooks
│ │ ├── useAuth.ts
│ │ ├── useLogin.ts
│ │ └── useLogout.ts
│ ├── common/ # Shared hooks
│ │ ├── useDebounce.ts
│ │ ├── useThrottle.ts
│ │ └── usePrevious.ts
│ └── features/ # Feature-specific hooks
│ ├── useGeolocation.ts
│ ├── useImageUpload.ts
│ └── useMapData.ts
├── queries/ # GraphQL queries
│ ├── user.queries.ts
│ ├── map.queries.ts
│ └── auth.queries.ts
└── services/ # API service layer
├── api.service.ts
├── auth.service.ts
├── upload.service.ts
└── location.service.ts

- Run the project in the background and pay attention to the logs. Don't kill the project; only kill it if I tell you to.
  Bash
- All text of the UI needs to be in spanish.
