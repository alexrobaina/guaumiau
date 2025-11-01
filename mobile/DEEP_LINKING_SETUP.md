# Deep Linking Setup Summary

## ✅ What's Been Configured

Deep linking has been fully configured for the GuauMiau mobile app with support for:

1. **Custom URL Schemes**: `guaumiau://`
2. **Universal Links (iOS)**: `https://guaumiau.app`
3. **App Links (Android)**: `https://guaumiau.app`

## 📁 Files Created/Modified

### New Files
- ✨ `src/navigation/linking.ts` - React Navigation linking configuration
- ✨ `src/utils/deepLinking.ts` - Deep linking utility functions
- ✨ `src/hooks/useDeepLinking.ts` - React hooks for deep linking
- ✨ `scripts/test-deeplinks.sh` - Testing script for deep links
- ✨ `docs/deep-linking-guide.md` - Complete documentation

### Modified Files
- 🔧 `ios/Guaumiau/Info.plist` - iOS URL scheme configuration
- 🔧 `android/app/src/main/AndroidManifest.xml` - Android intent filters
- 🔧 `src/navigation/RootNavigator.tsx` - Added linking to NavigationContainer
- 🔧 `package.json` - Added deep link testing scripts
- 🔧 `CLAUDE.md` - Updated project documentation

## 🔗 Available Deep Links

### Authentication
- `guaumiau://login`
- `guaumiau://register`
- `guaumiau://forgot-password`
- `guaumiau://reset-password?token=xxx`

### Main Navigation
- `guaumiau://home`
- `guaumiau://schedule`
- `guaumiau://achievements`
- `guaumiau://profile`
- `guaumiau://settings`

### Dynamic Routes
- `guaumiau://booking/:id`

## 🧪 Testing

### Quick Test Commands

```bash
# iOS - Test all links
npm run deeplink:test:ios

# Android - Test all links
npm run deeplink:test:android

# iOS - Test auth links only
npm run deeplink:ios:auth

# Android - Test auth links only
npm run deeplink:android:auth
```

### Manual Testing

**iOS Simulator:**
```bash
xcrun simctl openurl booted "guaumiau://home"
```

**Android Emulator:**
```bash
adb shell am start -W -a android.intent.action.VIEW -d "guaumiau://home"
```

## 💻 Usage in Code

### Generate Links

```typescript
import {DeepLinks, UniversalLinks} from '@/utils/deepLinking';

// Custom scheme
const link = DeepLinks.bookingDetails('123');
// Returns: "guaumiau://booking/123"

// Universal link (HTTPS)
const shareableLink = UniversalLinks.bookingDetails('123');
// Returns: "https://guaumiau.app/booking/123"
```

### Listen to Links

```typescript
import {useDeepLinking} from '@/hooks/useDeepLinking';

function MyComponent() {
  useDeepLinking((url) => {
    console.log('Received:', url);
  });
}
```

## 🌐 Universal Links Setup (Optional)

To enable HTTPS links (`https://guaumiau.app/...`), you need to:

1. Own the domain `guaumiau.app`
2. Host verification files on your web server:
   - **iOS**: `https://guaumiau.app/.well-known/apple-app-site-association`
   - **Android**: `https://guaumiau.app/.well-known/assetlinks.json`

See `docs/deep-linking-guide.md` for detailed setup instructions.

## 📧 Common Use Cases

### Password Reset Emails
```typescript
const resetLink = UniversalLinks.resetPassword(token);
// Use in email: https://guaumiau.app/reset-password?token=xxx
```

### Booking Confirmations
```typescript
const bookingLink = UniversalLinks.bookingDetails(bookingId);
// Use in email/SMS: https://guaumiau.app/booking/123
```

### Push Notifications
```typescript
await sendPushNotification({
  title: 'New Booking',
  body: 'You have a new booking',
  data: {
    deepLink: 'guaumiau://booking/123'
  }
});
```

## 📚 Documentation

For complete documentation, see:
- **Full Guide**: [docs/deep-linking-guide.md](../docs/deep-linking-guide.md)
- **Testing Guide**: Run `./scripts/test-deeplinks.sh --help`

## ✅ Next Steps

1. **Test the setup** using the testing scripts
2. **Implement backend integration** for password reset and booking links
3. **Configure universal links** when domain is ready
4. **Add deep linking to push notifications**

---

**Status**: ✅ Complete and ready for testing
**Last Updated**: January 2025
