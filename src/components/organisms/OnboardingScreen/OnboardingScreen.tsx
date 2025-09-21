import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { Text } from '@/components/atoms';
import { Button } from '@/components/atoms';
import { OnboardingScreenProps } from './OnboardingScreen.types';
import { makeStyles } from './OnboardingScreen.styles';

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  title,
  subtitle,
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  nextButtonText = 'Continue',
  previousButtonText = 'Back',
  nextDisabled = false,
  showProgress = true,
  contentStyle,
  showLoginOption = false,
  onLogin,
  loginButtonText = 'Login Instead',
}) => {
  const styles = makeStyles();
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          {showProgress && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progress}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                Step {currentStep + 1} of {totalSteps}
              </Text>
            </View>
          )}
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && (
              <Text style={styles.subtitle}>{subtitle}</Text>
            )}
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        <View style={styles.buttonContainer}>
          {showLoginOption && onLogin && (
            <View style={styles.loginContainer}>
              <Text style={styles.loginPrompt}>Already have an account?</Text>
              <Button
                variant="secondary"
                buttonStyle="text"
                style={styles.loginButton}
                onPress={onLogin}
              >
                {loginButtonText}
              </Button>
            </View>
          )}

          <View style={styles.buttonRow}>
            {currentStep > 0 && onPrevious && (
              <Button
                variant="secondary"
                buttonStyle="outline"
                style={styles.previousButton}
                onPress={onPrevious}
              >
                {previousButtonText}
              </Button>
            )}

            {onNext && (
              <Button
                variant="primary"
                style={currentStep === 0 ? undefined : styles.nextButton}
                disabled={nextDisabled}
                onPress={onNext}
              >
                {nextButtonText}
              </Button>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};