// User Model
export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

// Request Types
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  avatar?: string;
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
