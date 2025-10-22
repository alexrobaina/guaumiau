import {useMutation, UseMutationResult} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {authService} from '@/services/api/auth.service';
import {
  ResetPasswordRequest,
  ResetPasswordResponse,
  ApiError,
} from '@/types/auth.types';

interface UseResetPasswordOptions {
  onSuccess?: (data: ResetPasswordResponse) => void;
  onError?: (error: AxiosError<ApiError>) => void;
}

/**
 * Custom hook for resetting password with token
 * @param options - Optional callbacks for success and error handling
 * @returns React Query mutation object
 */
export const useResetPassword = (
  options?: UseResetPasswordOptions,
): UseMutationResult<
  ResetPasswordResponse,
  AxiosError<ApiError>,
  ResetPasswordRequest
> => {
  return useMutation<
    ResetPasswordResponse,
    AxiosError<ApiError>,
    ResetPasswordRequest
  >({
    mutationFn: (data: ResetPasswordRequest) =>
      authService.resetPassword(data),
    onSuccess: (data: ResetPasswordResponse) => {
      // Call custom success callback if provided
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError<ApiError>) => {
      // Call custom error callback if provided
      options?.onError?.(error);
    },
  });
};
