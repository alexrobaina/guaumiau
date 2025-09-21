import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface OnboardingScreenProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  nextButtonText?: string;
  previousButtonText?: string;
  nextDisabled?: boolean;
  showProgress?: boolean;
  contentStyle?: ViewStyle;
  showLoginOption?: boolean;
  onLogin?: () => void;
  loginButtonText?: string;
}