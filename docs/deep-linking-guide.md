# GuauMiau Deep Linking Guide

## 📱 Overview

Deep linking allows users to open specific screens in the GuauMiau app directly from external sources like emails, SMS, push notifications, or web browsers.

## 🔗 Supported URL Schemes

### Custom URL Scheme
- **Format**: `guaumiau://[path]`
- **Platform**: iOS & Android
- **Use Case**: Push notifications, SMS, email

### Universal Links (iOS)
- **Format**: `https://guaumiau.app/[path]`
- **Platform**: iOS (requires domain verification)
- **Use Case**: Web links, social media sharing

### App Links (Android)
- **Format**: `https://guaumiau.app/[path]`
- **Platform**: Android (requires domain verification)
- **Use Case**: Web links, social media sharing

---

## 📋 Available Deep Links

### Authentication Routes

| Route | Custom Scheme | Universal Link |
|-------|---------------|----------------|
| Login | `guaumiau://login` | `https://guaumiau.app/login` |
| Register | `guaumiau://register` | `https://guaumiau.app/register` |
| Forgot Password | `guaumiau://forgot-password` | `https://guaumiau.app/forgot-password` |
| Reset Password | `guaumiau://reset-password?token=xxx` | `https://guaumiau.app/reset-password?token=xxx` |

### Main App Routes

| Route | Custom Scheme | Universal Link |
|-------|---------------|----------------|
| Home | `guaumiau://home` | `https://guaumiau.app/home` |
| Schedule | `guaumiau://schedule` | `https://guaumiau.app/schedule` |
| Achievements | `guaumiau://achievements` | `https://guaumiau.app/achievements` |
| Profile | `guaumiau://profile` | `https://guaumiau.app/profile` |
| Settings | `guaumiau://settings` | `https://guaumiau.app/settings` |

### Dynamic Routes

| Route | Custom Scheme | Universal Link |
|-------|---------------|----------------|
| Booking Details | `guaumiau://booking/[id]` | `https://guaumiau.app/booking/[id]` |

**Example**: `guaumiau://booking/abc123` or `https://guaumiau.app/booking/abc123`

---

## 🧪 Testing Deep Links

### iOS Simulator

```bash
# Test custom URL scheme
xcrun simctl openurl booted "guaumiau://home"
xcrun simctl openurl booted "guaumiau://booking/123"
xcrun simctl openurl booted "guaumiau://reset-password?token=abc123"

# Test universal links (requires configured domain)
xcrun simctl openurl booted "https://guaumiau.app/home"
```

### Android Emulator

```bash
# Test custom URL scheme
adb shell am start -W -a android.intent.action.VIEW -d "guaumiau://home"
adb shell am start -W -a android.intent.action.VIEW -d "guaumiau://booking/123"

# Test app links
adb shell am start -W -a android.intent.action.VIEW -d "https://guaumiau.app/home"
```

### Physical Devices

#### iOS
1. Send yourself an email or message with the deep link
2. Or use Safari browser and type the URL directly
3. Tap the link to open the app

#### Android
1. Send yourself an email or message with the deep link
2. Or use Chrome browser and type the URL directly
3. Tap the link to open the app

---

## 💻 Programmatic Usage

### Import the utility

```typescript
import {
  DeepLinks,
  UniversalLinks,
  openURL,
  addLinkingListener,
  getInitialURL,
} from '@/utils/deepLinking';
```

### Generate Deep Links

```typescript
// Generate custom scheme links
const loginLink = DeepLinks.login();
// Returns: "guaumiau://login"

const bookingLink = DeepLinks.bookingDetails('abc123');
// Returns: "guaumiau://booking/abc123"

const resetLink = DeepLinks.resetPassword('token-xyz');
// Returns: "guaumiau://reset-password?token=token-xyz"
```

### Generate Universal Links (HTTPS)

```typescript
const shareableLink = UniversalLinks.bookingDetails('abc123');
// Returns: "https://guaumiau.app/booking/abc123"
```

### Open URLs Programmatically

```typescript
import {openURL} from '@/utils/deepLinking';

// Open external URL
await openURL('https://google.com');

// Open deep link within app
await openURL('guaumiau://home');
```

### Listen to Incoming Links

```typescript
import {addLinkingListener} from '@/utils/deepLinking';
import {useEffect} from 'react';

function MyComponent() {
  useEffect(() => {
    // Add listener
    const removeListener = addLinkingListener((url) => {
      console.log('Received URL:', url);
      // Handle the URL
    });

    // Cleanup on unmount
    return removeListener;
  }, []);
}
```

### Get Initial URL

```typescript
import {getInitialURL} from '@/utils/deepLinking';

async function checkInitialLink() {
  const url = await getInitialURL();
  if (url) {
    console.log('App opened with:', url);
  }
}
```

---

## 🔧 Configuration Files

### iOS Configuration
**File**: `mobile/ios/Guaumiau/Info.plist`

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>guaumiau</string>
    </array>
  </dict>
</array>
```

### Android Configuration
**File**: `mobile/android/app/src/main/AndroidManifest.xml`

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="guaumiau" />
</intent-filter>
```

### React Navigation Configuration
**File**: `mobile/src/navigation/linking.ts`

The linking configuration maps URLs to screen components.

---

## 🌐 Universal Links / App Links Setup

### Requirements

To use HTTPS links (`https://guaumiau.app/...`), you need:

1. **Own the domain** `guaumiau.app`
2. **Host verification files** on your web server:
   - iOS: `apple-app-site-association` file
   - Android: `assetlinks.json` file

### iOS Universal Links

1. Create `apple-app-site-association` file (no extension):

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.guaumiau",
        "paths": ["*"]
      }
    ]
  }
}
```

2. Host at: `https://guaumiau.app/.well-known/apple-app-site-association`
3. Add Associated Domains in Xcode:
   - Open `Guaumiau.xcworkspace`
   - Select target → Signing & Capabilities
   - Add "Associated Domains" capability
   - Add domain: `applinks:guaumiau.app`

### Android App Links

1. Generate key fingerprint:

```bash
cd mobile/android
./gradlew signingReport
```

2. Create `assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.guaumiau",
      "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
    }
  }
]
```

3. Host at: `https://guaumiau.app/.well-known/assetlinks.json`

4. Verify with:
```bash
adb shell pm get-app-links com.guaumiau
```

---

## 📧 Use Cases

### 1. Password Reset Emails

```typescript
// Backend: Generate reset link
const resetToken = generateToken();
const resetLink = `https://guaumiau.app/reset-password?token=${resetToken}`;

// Send email with link
await sendEmail({
  to: user.email,
  subject: 'Reset Your Password',
  html: `<a href="${resetLink}">Reset Password</a>`,
});
```

### 2. Booking Confirmations

```typescript
// Backend: Send booking confirmation
const bookingLink = `https://guaumiau.app/booking/${booking.id}`;

await sendEmail({
  to: user.email,
  subject: 'Booking Confirmed',
  html: `View your booking: <a href="${bookingLink}">Click here</a>`,
});
```

### 3. Push Notifications

```typescript
// Backend: Send push notification with deep link
await sendPushNotification({
  userId: user.id,
  title: 'New Booking Request',
  body: 'You have a new booking request',
  data: {
    deepLink: 'guaumiau://booking/123',
  },
});
```

### 4. Share Links

```typescript
// Mobile: Share a booking
import {Share} from 'react-native';
import {UniversalLinks} from '@/utils/deepLinking';

const shareBooking = async (bookingId: string) => {
  const link = UniversalLinks.bookingDetails(bookingId);

  await Share.share({
    message: `Check out this booking: ${link}`,
    url: link,
  });
};
```

---

## 🐛 Troubleshooting

### Links Not Opening on iOS

1. **Check Info.plist**: Ensure `CFBundleURLSchemes` includes `guaumiau`
2. **Rebuild the app**: Clean build folder (Cmd+Shift+K) and rebuild
3. **Universal Links**: Verify `apple-app-site-association` file is accessible
4. **Test with Safari**: Type the URL directly in Safari address bar

### Links Not Opening on Android

1. **Check AndroidManifest.xml**: Verify intent filters are correct
2. **Reinstall app**: `adb uninstall com.guaumiau && react-native run-android`
3. **App Links**: Use `adb shell pm get-app-links` to verify verification
4. **Test with Chrome**: Type the URL in Chrome address bar

### Navigation Not Working

1. **Check linking config**: Ensure path matches in `linking.ts`
2. **Console logs**: Check for navigation errors in Metro bundler
3. **Screen names**: Verify screen names match between linking config and navigators

---

## 📚 Additional Resources

- [React Navigation Deep Linking Docs](https://reactnavigation.org/docs/deep-linking/)
- [iOS Universal Links](https://developer.apple.com/ios/universal-links/)
- [Android App Links](https://developer.android.com/training/app-links)

---

**Last Updated**: January 2025
**Version**: 1.0.0
