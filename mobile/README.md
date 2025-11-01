# GuauMiau Mobile App

React Native mobile application for the GuauMiau pet services platform.

## 🚀 Quick Start

> **Note**: Make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

### Prerequisites
- Node.js >= 20
- npm or pnpm (package manager)
- iOS: Xcode and CocoaPods
- Android: Android Studio and SDK

### Installation

```bash
# Install dependencies
npm install

# iOS: Install CocoaPods dependencies
cd ios && bundle install && bundle exec pod install && cd ..
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# View iOS logs
npm run ios:logs
```

## 📱 Features

- ✅ User Authentication (Login, Register, Password Reset)
- ✅ Profile Management
- ✅ Schedule & Bookings
- ✅ Achievements & Gamification
- ✅ Settings & Preferences
- ✅ **Deep Linking Support** (URL schemes & Universal Links)

## 🔗 Deep Linking

The app supports deep linking for seamless navigation from external sources.

### Quick Test

```bash
# Test all deep links on iOS
npm run deeplink:test:ios

# Test all deep links on Android
npm run deeplink:test:android

# Test authentication links only
npm run deeplink:ios:auth
npm run deeplink:android:auth
```

### Supported URLs

**Authentication:**
- `guaumiau://login`
- `guaumiau://register`
- `guaumiau://forgot-password`
- `guaumiau://reset-password?token=xxx`

**Main Navigation:**
- `guaumiau://home`
- `guaumiau://schedule`
- `guaumiau://achievements`
- `guaumiau://profile`
- `guaumiau://settings`

**Dynamic Routes:**
- `guaumiau://booking/:id`

**📚 Full Documentation**: [DEEP_LINKING_SETUP.md](./DEEP_LINKING_SETUP.md) | [Deep Linking Guide](../docs/deep-linking-guide.md)

## 🛠️ Available Scripts

### Development
- `npm start` - Start Metro bundler
- `npm run dev` - Start with cache reset
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run ios:logs` - View iOS logs

### Deep Link Testing
- `npm run deeplink:test:ios` - Test all iOS deep links
- `npm run deeplink:test:android` - Test all Android deep links
- `npm run deeplink:ios:auth` - Test iOS auth links
- `npm run deeplink:android:auth` - Test Android auth links

### Code Quality
- `npm run lint` - Lint TypeScript files
- `npm test` - Run tests

## 🏗️ Project Architecture

### Component Structure (Atomic Design)

```
src/components/
├── atoms/          # Basic UI elements (Button, Text, Input)
├── molecules/      # Simple combinations (FormField, Card)
├── organisms/      # Complex components (Header, LoginForm, Sidebar)
├── templates/      # Page layouts
└── screens/        # Complete screens
```

### Path Aliases

```typescript
import { Component } from '@/components/atoms/Component';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
```

## 📁 Project Structure

```
mobile/
├── src/
│   ├── components/       # UI components (atoms, molecules, organisms)
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation configuration
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API and external services
│   ├── stores/           # MobX stores
│   ├── contexts/         # React contexts
│   ├── utils/            # Utility functions
│   ├── theme/            # Theme configuration
│   └── types/            # TypeScript types
├── scripts/              # Development scripts
├── android/              # Android native code
├── ios/                  # iOS native code
└── docs/                 # Documentation
```

## 🧪 Testing Deep Links

### iOS Simulator

```bash
xcrun simctl openurl booted "guaumiau://home"
xcrun simctl openurl booted "guaumiau://booking/123"
```

### Android Emulator

```bash
adb shell am start -W -a android.intent.action.VIEW -d "guaumiau://home"
adb shell am start -W -a android.intent.action.VIEW -d "guaumiau://booking/123"
```

## 📚 Documentation

- **Deep Linking Setup**: [DEEP_LINKING_SETUP.md](./DEEP_LINKING_SETUP.md)
- **Deep Linking Guide**: [docs/deep-linking-guide.md](../docs/deep-linking-guide.md)
- **Project Roadmap**: [docs/Steps by step app.md](../docs/Steps%20by%20step%20app.md)
- **Main Project Docs**: [../CLAUDE.md](../CLAUDE.md)

## 🔧 Tech Stack

- **Framework**: React Native 0.81.4
- **Language**: TypeScript 5.8
- **State Management**: MobX 6.15
- **Data Fetching**: TanStack React Query 5.90
- **Navigation**: React Navigation 7
- **Icons**: Lucide React Native
- **Storage**: AsyncStorage

## 🐛 Troubleshooting

### App won't build
- Clean and rebuild: Delete `node_modules`, run `npm install`
- iOS: Delete `ios/Pods`, run `bundle exec pod install`
- Android: Run `cd android && ./gradlew clean`

### Deep links not working
- iOS: Rebuild the app after Info.plist changes
- Android: Reinstall the app after AndroidManifest.xml changes
- Check logs for navigation errors

### More help
- [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting)
- [iOS Setup](https://reactnative.dev/docs/environment-setup?platform=ios)
- [Android Setup](https://reactnative.dev/docs/environment-setup?platform=android)

---

**Tech Stack**: React Native 0.81.4 • TypeScript 5.8 • MobX 6.15 • React Query 5.90 • React Navigation 7
