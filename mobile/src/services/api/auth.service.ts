import apiClient from './client';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  AuthResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  MeResponse,
} from '@/types/auth.types';

/**
 * Auth Service - All authentication related API calls
 */
export const authService = {
  /**
   * Register a new user
   * POST /auth/register
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/register',
      data,
    );
    return response.data;
  },

  /**
   * Login user
   * POST /auth/login
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Request password reset
   * POST /auth/forgot-password
   */
  forgotPassword: async (
    data: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> => {
    const response = await apiClient.post<ForgotPasswordResponse>(
      '/auth/forgot-password',
      data,
    );
    return response.data;
  },

  /**
   * Reset password with token
   * POST /auth/reset-password
   */
  resetPassword: async (
    data: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> => {
    const response = await apiClient.post<ResetPasswordResponse>(
      '/auth/reset-password',
      data,
    );
    return response.data;
  },

  /**
   * Get current authenticated user
   * GET /auth/me
   * Requires: Authorization header with Bearer token
   */
  me: async (): Promise<MeResponse> => {
    const response = await apiClient.get<MeResponse>('/auth/me');
    return response.data;
  },

  /**
   * Logout user
   * POST /auth/logout
   * Requires: Authorization header with Bearer token
   */
  logout: async (): Promise<{message: string}> => {
    const response = await apiClient.post<{message: string}>('/auth/logout');
    return response.data;
  },

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  refreshTokens: async (refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> => {
    const response = await apiClient.post<{
      accessToken: string;
      refreshToken: string;
    }>('/auth/refresh', {refreshToken});
    return response.data;
  },

  /**
   * Verify email with token
   * POST /auth/verify-email
   */
  verifyEmail: async (token: string): Promise<{message: string}> => {
    const response = await apiClient.post<{message: string}>(
      '/auth/verify-email',
      {token},
    );
    return response.data;
  },

  /**
   * Resend verification email
   * POST /auth/resend-verification
   */
  resendVerification: async (email: string): Promise<{message: string}> => {
    const response = await apiClient.post<{message: string}>(
      '/auth/resend-verification',
      {email},
    );
    return response.data;
  },

  /**
   * Update user profile
   * PATCH /auth/profile
   * Requires: Authorization header with Bearer token
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<MeResponse> => {
    const response = await apiClient.patch<MeResponse>('/auth/profile', data);
    return response.data;
  },
};
