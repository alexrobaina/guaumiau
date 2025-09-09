import * as yup from 'yup';

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

// Common validation messages
export const ValidationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  password: {
    min: 'Password must be at least 8 characters long',
    pattern: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  },
  name: {
    min: 'Name must be at least 2 characters long',
    max: 'Name must not exceed 50 characters',
  },
  terms: 'You must accept the terms and conditions',
  passwordMatch: 'Passwords must match',
} as const;

// Login validation schema
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email(ValidationMessages.email)
    .required(ValidationMessages.required),
  password: yup
    .string()
    .min(8, ValidationMessages.password.min)
    .required(ValidationMessages.required),
  rememberMe: yup.boolean().default(false),
});

// Register validation schema
export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, ValidationMessages.name.min)
    .max(50, ValidationMessages.name.max)
    .required(ValidationMessages.required),
  email: yup
    .string()
    .email(ValidationMessages.email)
    .required(ValidationMessages.required),
  password: yup
    .string()
    .min(8, ValidationMessages.password.min)
    .matches(PASSWORD_REGEX, ValidationMessages.password.pattern)
    .required(ValidationMessages.required),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], ValidationMessages.passwordMatch)
    .required(ValidationMessages.required),
  acceptTerms: yup
    .boolean()
    .oneOf([true], ValidationMessages.terms)
    .required(ValidationMessages.required),
});

// Forgot password validation schema
export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email(ValidationMessages.email)
    .required(ValidationMessages.required),
});

// Phone verification validation schema
export const phoneVerificationSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(
      /^\+[1-9]\d{1,14}$/,
      'Please enter a valid phone number with country code (e.g., +1234567890)'
    )
    .required(ValidationMessages.required),
});

// OTP validation schema
export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{6}$/, 'OTP must be exactly 6 digits')
    .required(ValidationMessages.required),
});

// TypeScript types inferred from schemas
export type LoginFormValues = yup.InferType<typeof loginSchema>;
export type RegisterFormValues = yup.InferType<typeof registerSchema>;
export type ForgotPasswordFormValues = yup.InferType<typeof forgotPasswordSchema>;
export type PhoneVerificationFormValues = yup.InferType<typeof phoneVerificationSchema>;
export type OtpFormValues = yup.InferType<typeof otpSchema>;

// Form initial values
export const loginInitialValues: LoginFormValues = {
  email: '',
  password: '',
  rememberMe: false,
};

export const registerInitialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
};

export const forgotPasswordInitialValues: ForgotPasswordFormValues = {
  email: '',
};

export const phoneVerificationInitialValues: PhoneVerificationFormValues = {
  phoneNumber: '',
};

export const otpInitialValues: OtpFormValues = {
  otp: '',
};

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  return yup.string().email().isValidSync(email);
};

export const validatePassword = (password: string): boolean => {
  return yup
    .string()
    .min(8)
    .matches(PASSWORD_REGEX)
    .isValidSync(password);
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  return yup
    .string()
    .matches(/^\+[1-9]\d{1,14}$/)
    .isValidSync(phoneNumber);
};

export const validateOtp = (otp: string): boolean => {
  return yup
    .string()
    .matches(/^\d{6}$/)
    .isValidSync(otp);
};