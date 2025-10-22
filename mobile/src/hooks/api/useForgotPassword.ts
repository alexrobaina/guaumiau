import {useMutation, UseMutationResult} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {authService} from '@/services/api/auth.service';
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ApiError,
} from '@/types/auth.types';

interface UseForgotPasswordOptions {
  onSuccess?: (data: ForgotPasswordResponse) => void;
  onError?: (error: AxiosError<ApiError>) => void;
}

/**
 * Custom hook for requesting password reset
 * @param options - Optional callbacks for success and error handling
 * @returns React Query mutation object
 */
export const useForgotPassword = (
  options?: UseForgotPasswordOptions,
): UseMutationResult<
  ForgotPasswordResponse,
  AxiosError<ApiError>,
  ForgotPasswordRequest
> => {
  return useMutation<
    ForgotPasswordResponse,
    AxiosError<ApiError>,
    ForgotPasswordRequest
  >({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
    onSuccess: (data: ForgotPasswordResponse) => {
      // Call custom success callback if provided
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError<ApiError>) => {
      // Call custom error callback if provided
      options?.onError?.(error);
    },
  });
};

/**
 * Hook Usage Example:
 *
 * const forgotPassword = useForgotPassword({
 *   onSuccess: (data) => {
 *     console.log('Reset email sent:', data.message);
 *     setSuccessMessage(data.message);
 *   },
 *   onError: (error) => {
 *     console.error('Failed to send reset email:', error.response?.data.message);
 *   }
 * });
 *
 * // In your component
 * const handleForgotPassword = (email: string) => {
 *   forgotPassword.mutate({ email });
 * };
 *
 * // Access mutation state
 * forgotPassword.isPending  // Loading state
 * forgotPassword.isError    // Error state
 * forgotPassword.error      // Error object
 * forgotPassword.data       // Response data
 */
