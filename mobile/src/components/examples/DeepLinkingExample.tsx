/**
 * Deep Linking Usage Example Component
 *
 * This component demonstrates how to use deep linking features
 * in the GuauMiau app. You can use this as a reference or add it
 * to a screen for testing purposes.
 */

import React from 'react';
import {View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {Text} from '@/components/atoms/Text';
import {
  DeepLinks,
  UniversalLinks,
  openURL,
  useDeepLinking,
} from '@/utils/deepLinking';

export const DeepLinkingExample: React.FC = () => {
  // Listen to incoming deep links
  const {initialUrl, lastUrl} = useDeepLinking(url => {
    console.log('Received deep link:', url);
    Alert.alert('Deep Link Received', url);
  });

  const handleOpenLogin = async () => {
    const link = DeepLinks.login();
    console.log('Opening:', link);
    await openURL(link);
  };

  const handleShareBooking = async () => {
    const bookingId = 'example-123';
    const link = UniversalLinks.bookingDetails(bookingId);

    // In a real app, you'd use the Share API
    Alert.alert('Shareable Link', link, [
      {text: 'Copy', onPress: () => console.log('Copied:', link)},
      {text: 'Open', onPress: () => openURL(link)},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const handleGenerateResetLink = () => {
    const token = 'sample-reset-token-xyz';
    const customScheme = DeepLinks.resetPassword(token);
    const universalLink = UniversalLinks.resetPassword(token);

    Alert.alert(
      'Password Reset Links',
      `Custom Scheme:\n${customScheme}\n\nUniversal Link:\n${universalLink}`,
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deep Linking Examples</Text>

      {initialUrl && (
        <View style={styles.infoBox}>
          <Text style={styles.label}>App opened with:</Text>
          <Text style={styles.value}>{initialUrl}</Text>
        </View>
      )}

      {lastUrl && lastUrl !== initialUrl && (
        <View style={styles.infoBox}>
          <Text style={styles.label}>Last link received:</Text>
          <Text style={styles.value}>{lastUrl}</Text>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleOpenLogin}>
          <Text style={styles.buttonText}>Open Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleShareBooking}>
          <Text style={styles.buttonText}>Share Booking Link</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleGenerateResetLink}>
          <Text style={styles.buttonText}>Generate Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => openURL(DeepLinks.home())}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.codeExample}>
        <Text style={styles.codeTitle}>Quick Reference:</Text>
        <Text style={styles.code}>
          {`import { DeepLinks } from '@/utils/deepLinking';

// Generate links
const homeLink = DeepLinks.home();
const bookingLink = DeepLinks.bookingDetails(id);

// Open a link
await openURL(homeLink);`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  buttonsContainer: {
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  codeExample: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  codeTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  code: {
    color: '#a9dc76',
    fontSize: 12,
    fontFamily: 'Courier',
  },
});
