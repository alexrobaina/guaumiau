# Guaumiau

A full-stack mobile application built with React Native and NestJS, featuring user authentication, profile management, pet tracking, and location-based services.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Mobile Setup](#mobile-setup)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Environment Configuration](#environment-configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Project Overview

Guaumiau is a mobile-first application that combines:

- User authentication and profile management
- Pet creation and management with image upload
- Location-based services with Google Maps integration
- Push notifications via Firebase
- RESTful API with JWT authentication

## Technology Stack

### Backend

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Storage**: S3-compatible (LocalStack for local development)
- **Email**: Nodemailer
- **Push Notifications**: Firebase Admin SDK

### Mobile

- **Framework**: React Native 0.81.4
- **Language**: TypeScript 5.8.3
- **State Management**: MobX
- **Data Fetching**: TanStack React Query
- **Navigation**: React Navigation v7
- **Maps**: React Native Maps with Google Maps
- **HTTP Client**: Axios

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: >= 20.x
- **pnpm**: Latest version (this project uses pnpm as package manager)
- **Docker & Docker Compose**: For running PostgreSQL and LocalStack
- **Ruby**: For iOS CocoaPods (macOS only)
- **Xcode**: 14+ with iOS 16+ SDK (macOS only, for iOS development)
- **Android Studio**: With Android SDK 31+ (for Android development)
- **Java**: JDK 17+ (for Android development)

**Install pnpm globally**:

```bash
npm install -g pnpm
```

## Getting Started

### Backend Setup

1. **Navigate to the backend directory**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure environment variables**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:

   - `DATABASE_URL`: PostgreSQL connection string (default: `postgresql://guaumiau:guaumiau@localhost:5433/guaumiau_db?schema=public`)
   - `JWT_SECRET` and `JWT_REFRESH_SECRET`: Generate secure random strings
   - `FIREBASE_SERVICE_ACCOUNT`: Your Firebase service account JSON
   - `EMAIL_*`: SMTP configuration for email services
   - AWS S3 settings (LocalStack is pre-configured for local development)

4. **Start infrastructure services** (PostgreSQL + LocalStack):

   ```bash
   pnpm docker:up
   ```

5. **Generate Prisma client**:

   ```bash
   pnpm prisma:generate
   ```

6. **Run database migrations**:

   ```bash
   pnpm prisma:migrate
   ```

7. **Start the development server**:
   ```bash
   pnpm start:dev
   ```

The backend API will be available at `http://localhost:3000`.

### Mobile Setup

1. **Navigate to the mobile directory**:

   ```bash
   cd mobile
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure environment variables**:

   The `.env` file should already exist with:

   ```env
   CURRENT_ENV=development
   ANDROID_BACKEND_URL=http://10.0.2.2:3000
   BACKEND_URL=http://localhost:3000
   GOOGLE_MAP_API_KEY=your-google-maps-api-key
   ```

   Update `GOOGLE_MAP_API_KEY` with your actual Google Maps API key.

4. **iOS Setup** (macOS only):

   ```bash
   # Install Ruby dependencies
   bundle install

   # Install CocoaPods dependencies
   bundle exec pod install
   ```

5. **Start Metro bundler** (on port 8082):

   ```bash
   pnpm start
   ```

   The Metro bundler will run on port 8082 by default.

6. **Run the app**:

   In a new terminal window:

   **For iOS**:

   ```bash
   pnpm ios
   ```

   **For Android**:

   ```bash
   pnpm android
   ```

## Development Workflow

### Starting the Full Application

1. **Start backend services** (in `backend/` directory):

   ```bash
   pnpm docker:up      # Start PostgreSQL and LocalStack
   pnpm start:dev      # Start NestJS server in watch mode
   ```

2. **Start mobile app** (in `mobile/` directory):
   ```bash
   pnpm start          # Start Metro bundler on port 8082
   pnpm ios            # Run on iOS simulator
   # OR
   pnpm android        # Run on Android emulator
   ```

### Backend Development

The backend runs in watch mode with `pnpm start:dev`, automatically recompiling on file changes.

**Key Commands**:

```bash
pnpm start:dev        # Development with hot reload
pnpm prisma:studio    # Open Prisma Studio (database GUI)
pnpm lint             # Lint code
pnpm test             # Run tests
pnpm docker:logs      # View Docker container logs
```

### Mobile Development

Metro bundler runs on **port 8082** and provides fast refresh for instant feedback.

**Key Commands**:

```bash
pnpm start                # Start Metro on port 8082
pnpm dev                  # Start Metro with cache reset
pnpm ios                  # Run iOS app
pnpm android              # Run Android app
pnpm ios:logs             # View iOS device logs
pnpm lint                 # Lint code
```

**Deep Linking**:

```bash
pnpm deeplink:test:ios       # Test all iOS deep links
pnpm deeplink:test:android   # Test all Android deep links
```

## Project Structure

```
guaumiau/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── pets/           # Pet management
│   │   ├── places/         # Location services
│   │   ├── s3/             # File storage
│   │   ├── email/          # Email service
│   │   ├── notifications/  # Push notifications
│   │   └── prisma/         # Database client
│   ├── prisma/             # Database schema and migrations
│   ├── docker-compose.yml  # Docker services configuration
│   └── package.json
│
└── mobile/                  # React Native app
    ├── src/
    │   ├── components/     # UI components (Atomic Design)
    │   │   ├── atoms/      # Basic UI elements
    │   │   ├── molecules/  # Component compositions
    │   │   └── organisms/  # Complex components
    │   ├── screens/        # Screen components
    │   ├── navigation/     # Navigation configuration
    │   ├── hooks/          # Custom React hooks
    │   ├── services/       # API services
    │   ├── stores/         # MobX stores
    │   ├── contexts/       # React contexts
    │   └── utils/          # Utility functions
    ├── ios/                # iOS native code
    ├── android/            # Android native code
    └── package.json
```

## Available Scripts

### Backend (`backend/` directory)

| Command                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `pnpm install`         | Install dependencies                             |
| `pnpm setup`           | Start Docker services and generate Prisma client |
| `pnpm start:dev`       | Start development server with hot reload         |
| `pnpm start:prod`      | Start production server                          |
| `pnpm build`           | Build for production                             |
| `pnpm docker:up`       | Start PostgreSQL and LocalStack containers       |
| `pnpm docker:down`     | Stop all containers                              |
| `pnpm docker:logs`     | View container logs                              |
| `pnpm docker:restart`  | Restart containers                               |
| `pnpm prisma:generate` | Generate Prisma client                           |
| `pnpm prisma:migrate`  | Run database migrations                          |
| `pnpm prisma:studio`   | Open Prisma Studio GUI                           |
| `pnpm lint`            | Lint and auto-fix code                           |
| `pnpm format`          | Format code with Prettier                        |
| `pnpm test`            | Run unit tests                                   |
| `pnpm test:watch`      | Run tests in watch mode                          |
| `pnpm test:cov`        | Generate test coverage report                    |
| `pnpm test:e2e`        | Run end-to-end tests                             |

### Mobile (`mobile/` directory)

| Command                      | Description                          |
| ---------------------------- | ------------------------------------ |
| `pnpm install`               | Install dependencies                 |
| `pnpm start`                 | Start Metro bundler on port 8082     |
| `pnpm dev`                   | Start Metro with cache reset         |
| `pnpm ios`                   | Build and run iOS app                |
| `pnpm android`               | Build and run Android app            |
| `pnpm ios:logs`              | View iOS device logs                 |
| `pnpm lint`                  | Lint code                            |
| `pnpm test`                  | Run tests                            |
| `bundle install`             | Install Ruby dependencies (iOS)      |
| `bundle exec pod install`    | Install CocoaPods dependencies (iOS) |
| `pnpm deeplink:test:ios`     | Test iOS deep links                  |
| `pnpm deeplink:test:android` | Test Android deep links              |

## Environment Configuration

### Backend Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
# Database
DATABASE_URL="postgresql://guaumiau:guaumiau@localhost:5433/guaumiau_db?schema=public"

# JWT Authentication
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=refresh-secret-change-in-production

# Server
PORT=3000
NODE_ENV=development

# AWS S3 (LocalStack for local dev)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_S3_ENDPOINT=http://localhost:4566
AWS_S3_FORCE_PATH_STYLE=true
AWS_S3_BUCKET_NAME=guaumiau-bucket

# CORS
ALLOWED_ORIGINS=http://localhost:8082,http://localhost:19000

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Guaumiau <noreply@guaumiau.com>

# Firebase
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'

# URLs
FRONTEND_URL=guaumiau://
BACKEND_URL=http://localhost:3000
```

### Mobile Environment Variables

Edit `mobile/.env`:

```env
CURRENT_ENV=development
ANDROID_BACKEND_URL=http://10.0.2.2:3000
BACKEND_URL=http://localhost:3000
GOOGLE_MAP_API_KEY=your-google-maps-api-key
```

**Note**:

- iOS simulator uses `localhost:3000`
- Android emulator uses `10.0.2.2:3000` (maps to host's localhost)
- Metro bundler always runs on **port 8082**

## Testing

### Backend Tests

```bash
cd backend

# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:cov

# E2E tests
pnpm test:e2e
```

### Mobile Tests

```bash
cd mobile

# Run tests
pnpm test

# Deep link testing
pnpm deeplink:test:ios
pnpm deeplink:test:android
```

## Troubleshooting

### Port Already in Use

If Metro bundler port 8082 or backend port 3000 is in use:

```bash
# Find process using port
lsof -i :8082
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Backend Issues

**Database connection error**:

```bash
# Restart Docker containers
cd backend
pnpm docker:restart

# Check container status
docker ps
```

**Prisma client out of sync**:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

### Mobile Issues

**iOS build fails**:

```bash
cd mobile
bundle exec pod install
pnpm ios
```

**Android build fails**:

```bash
cd mobile/android
./gradlew clean
cd ..
pnpm android
```

**Metro bundler cache issues**:

```bash
pnpm dev  # Starts Metro with cache reset
```

**Native module issues**:

```bash
# iOS
cd ios && bundle exec pod install && cd ..

# Android
cd android && ./gradlew clean && cd ..
```

### Common Issues

1. **Port 8082 conflict**: Kill any process using port 8082 before starting Metro
2. **Backend not connecting**: Ensure Docker containers are running (`pnpm docker:up`)
3. **Authentication errors**: Check JWT secrets are set in backend `.env`
4. **Image upload fails**: Verify LocalStack S3 is running on port 4566
5. **Deep links not working**: Check URL scheme configuration in Xcode/AndroidManifest.xml

---

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Deep Linking Guide](mobile/docs/deep-linking-guide.md)

## License

Private project - All rights reserved
