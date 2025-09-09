import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/lib/colors';
import { ButtonVariant, ButtonSize, ButtonStyleType } from './Button.types';

export const makeStyles = () => StyleSheet.create({
  // Base styles
  base: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 0,
    justifyContent: 'center',
  } as ViewStyle,

  baseText: {
    fontWeight: '600',
    textAlign: 'center',
  } as TextStyle,

  // Variant styles - Solid
  primarysolid: {
    backgroundColor: Colors.primary[500],
  } as ViewStyle,
  primaryText: {
    color: Colors.white,
  } as TextStyle,

  secondarysolid: {
    backgroundColor: Colors.secondary[500],
  } as ViewStyle,
  secondaryText: {
    color: Colors.white,
  } as TextStyle,

  tertiarysolid: {
    backgroundColor: Colors.tertiary[500],
  } as ViewStyle,
  tertiaryText: {
    color: Colors.black,
  } as TextStyle,

  ghostsolid: {
    backgroundColor: Colors.transparent,
  } as ViewStyle,
  ghostText: {
    color: Colors.gray[900],
  } as TextStyle,

  dangersolid: {
    backgroundColor: Colors.error,
  } as ViewStyle,
  dangerText: {
    color: Colors.white,
  } as TextStyle,

  // Variant styles - Outline
  primaryoutline: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.primary[500],
    borderWidth: 2,
  } as ViewStyle,

  secondaryoutline: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.secondary[500],
    borderWidth: 2,
  } as ViewStyle,

  tertiaryoutline: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.tertiary[500],
    borderWidth: 2,
  } as ViewStyle,

  ghostoutline: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.gray[300],
    borderWidth: 2,
  } as ViewStyle,

  dangeroutline: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.error,
    borderWidth: 2,
  } as ViewStyle,

  // Variant styles - Soft
  primarysoft: {
    backgroundColor: `${Colors.primary[500]}33`, // 20% opacity
  } as ViewStyle,

  secondarysoft: {
    backgroundColor: `${Colors.secondary[500]}33`,
  } as ViewStyle,

  tertiarysoft: {
    backgroundColor: `${Colors.tertiary[500]}33`,
  } as ViewStyle,

  ghostsoft: {
    backgroundColor: `${Colors.gray[500]}33`,
  } as ViewStyle,

  dangersoft: {
    backgroundColor: `${Colors.error}33`,
  } as ViewStyle,

  // Size styles
  smButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  } as ViewStyle,
  smText: {
    fontSize: 14,
  } as TextStyle,

  mdButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  } as ViewStyle,
  mdText: {
    fontSize: 16,
  } as TextStyle,

  lgButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  } as ViewStyle,
  lgText: {
    fontSize: 18,
  } as TextStyle,

  xlButton: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  } as ViewStyle,
  xlText: {
    fontSize: 20,
  } as TextStyle,

  // Modifiers
  fullWidth: {
    width: '100%',
  } as ViewStyle,

  disabled: {
    opacity: 0.5,
  } as ViewStyle,
});

export const getButtonStyle = (
  styles: ReturnType<typeof makeStyles>,
  variant: ButtonVariant,
  size: ButtonSize,
  buttonStyle: ButtonStyleType,
  fullWidth: boolean,
  disabled: boolean
): ViewStyle => {
  const baseStyle = styles.base;
  const variantStyle = styles[
    `${variant}${buttonStyle}` as keyof ReturnType<typeof makeStyles>
  ] as ViewStyle;
  const sizeStyle = styles[
    `${size}Button` as keyof ReturnType<typeof makeStyles>
  ] as ViewStyle;

  return {
    ...baseStyle,
    ...variantStyle,
    ...sizeStyle,
    ...(fullWidth && styles.fullWidth),
    ...(disabled && styles.disabled),
  };
};

export const getTextStyle = (
  styles: ReturnType<typeof makeStyles>,
  variant: ButtonVariant,
  size: ButtonSize
): TextStyle => {
  const baseTextStyle = styles.baseText;
  const variantTextStyle = styles[
    `${variant}Text` as keyof ReturnType<typeof makeStyles>
  ] as TextStyle;
  const sizeTextStyle = styles[
    `${size}Text` as keyof ReturnType<typeof makeStyles>
  ] as TextStyle;

  return {
    ...baseTextStyle,
    ...variantTextStyle,
    ...sizeTextStyle,
  };
};