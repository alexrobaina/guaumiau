# Google Maps Setup Guide

This guide explains how to set up Google Maps API keys for the SearchWalkersScreen in the Guaumiau mobile app.

## Prerequisites

1. A Google Cloud Platform account
2. Billing enabled on your GCP project

## Getting Your API Keys

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for the project

### 2. Enable Required APIs

Enable these APIs in your GCP project:

- **Maps SDK for Android**
- **Maps SDK for iOS**
- **Geolocation API** (optional, for better location services)
- **Places API** (optional, for future features)

To enable:
1. Go to APIs & Services > Library
2. Search for each API
3. Click "Enable"

### 3. Create API Keys

1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "API Key"
3. Create **two separate API keys**:
   - One for Android
   - One for iOS

### 4. Restrict Your API Keys (Recommended)

#### For Android API Key:
1. Edit the Android API key
2. Under "Application restrictions", select "Android apps"
3. Add your app's package name: `com.guaumiau`
4. Add your SHA-1 certificate fingerprint (see below)

#### For iOS API Key:
1. Edit the iOS API key
2. Under "Application restrictions", select "iOS apps"
3. Add your app's bundle identifier: `com.guaumiau` (or your actual bundle ID)

#### Get SHA-1 Fingerprint for Android:

Debug keystore:
```bash
cd android/app
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Release keystore:
```bash
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
```

## Installation

### iOS Setup

1. Open `ios/Guaumiau/Info.plist`
2. Add your iOS API key:

```xml
<key>GMSApiKey</key>
<string>YOUR_IOS_API_KEY_HERE</string>
```

The key should be added inside the `<dict>` element, somewhere before the closing `</dict>` tag.

### Android Setup

1. Open `android/app/src/main/AndroidManifest.xml`
2. Add your Android API key inside the `<application>` tag:

```xml
<application
    android:name=".MainApplication"
    ...>

    <!-- Add this meta-data tag -->
    <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="YOUR_ANDROID_API_KEY_HERE"/>

    <activity
        android:name=".MainActivity"
        ...>
    </activity>
</application>
```

## Environment Variables (Alternative Method)

For better security, you can use environment variables:

### 1. Create a `.env` file in the mobile directory:

```env
GOOGLE_MAPS_API_KEY_IOS=your_ios_api_key_here
GOOGLE_MAPS_API_KEY_ANDROID=your_android_api_key_here
```

### 2. Add `.env` to `.gitignore`:

```
.env
.env.local
.env.*.local
```

### 3. Use a package like `react-native-config` to load the keys

## Testing

After setting up the API keys:

1. **Rebuild the app** (keys are read at build time):
   ```bash
   # iOS
   cd ios && pod install && cd ..
   npm run ios

   # Android
   npm run android
   ```

2. Navigate to the SearchWalkersScreen
3. The map should load and show your current location
4. You should see walker markers on the map

## Troubleshooting

### Map shows a gray screen (Android)
- Check that the API key is correct
- Ensure "Maps SDK for Android" is enabled
- Verify the SHA-1 fingerprint is correct
- Check restrictions on the API key

### Map doesn't load (iOS)
- Check that the API key is correct in Info.plist
- Ensure "Maps SDK for iOS" is enabled
- Verify bundle identifier restriction matches your app

### Location not working
- Check that location permissions are granted
- iOS: Check `NSLocationWhenInUseUsageDescription` in Info.plist
- Android: Check location permissions in AndroidManifest.xml

### "This app has made too many requests" error
- You've exceeded the free tier quota
- Check your GCP billing and quotas

## Cost Management

Google Maps Platform offers a $200 monthly credit. For typical usage:

- **Maps SDK**: $7 per 1,000 loads (free up to 28,500 loads/month)
- **Geolocation API**: $5 per 1,000 requests (free up to 40,000 requests/month)

Set up budget alerts in GCP to monitor usage.

## Security Best Practices

1. **Never commit API keys** to version control
2. Use **API key restrictions** (app bundle IDs, SHA-1 fingerprints)
3. Use **API restrictions** (limit to only the APIs you need)
4. Set up **quota limits** to prevent abuse
5. Consider using **Firebase** for additional security

## Current Implementation

The SearchWalkersScreen currently:
- Uses `@react-native-community/geolocation` for location services
- Shows user location with a blue circle
- Displays walker markers with orange pins
- Supports marker selection (tap to highlight)
- Animates map to selected walker when card is tapped

For production, you'll want to:
- Replace mock walker data with real API calls
- Implement proper error handling
- Add loading states
- Implement filter functionality
- Add search capabilities
