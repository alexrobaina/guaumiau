// User Model
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
  avatar: string | null;
  address: string | null;
  city: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  termsAccepted: boolean;
  termsAcceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Request Types
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  userRole: 'PET_OWNER' | 'SERVICE_PROVIDER';
  termsAccepted: boolean;
  avatar?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Response Types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordResponse {
  message: string;
  resetToken?: string; // Only in development
}

export interface ResetPasswordResponse {
  message: string;
}

export interface MeResponse {
  user: User;
}

// Error Response
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}
