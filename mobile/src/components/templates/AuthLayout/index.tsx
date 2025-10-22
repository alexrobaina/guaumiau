import React, {memo} from 'react';
import {View, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from '@components/atoms/Text';
import {IAuthLayoutProps} from './AuthLayout.types';
import {styles} from './AuthLayout.styles';

export const AuthLayout = memo<IAuthLayoutProps>(
  ({children, title, subtitle}) => {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Text variant="h1" align="center" style={styles.title}>{title}</Text>
              {subtitle && <Text variant="body" color="textSecondary" align="center" style={styles.subtitle}>{subtitle}</Text>}
            </View>
            <View style={styles.content}>{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  },
);
