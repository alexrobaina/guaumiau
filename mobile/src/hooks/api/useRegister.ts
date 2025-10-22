import {useMutation, UseMutationResult} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {authService} from '@/services/api/auth.service';
import {setAuthToken} from '@/services/api/client';
import {RegisterRequest, AuthResponse, ApiError} from '@/types/auth.types';

interface UseRegisterOptions {
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: AxiosError<ApiError>) => void;
}

/**
 * Custom hook for user registration
 * @param options - Optional callbacks for success and error handling
 * @returns React Query mutation object
 */
export const useRegister = (
  options?: UseRegisterOptions,
): UseMutationResult<AuthResponse, AxiosError<ApiError>, RegisterRequest> => {
  return useMutation<AuthResponse, AxiosError<ApiError>, RegisterRequest>({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data: AuthResponse) => {
      // Store the access token in axios interceptor
      setAuthToken(data.accessToken);

      // TODO: Store tokens in AsyncStorage for persistence
      // await AsyncStorage.setItem('accessToken', data.accessToken);
      // await AsyncStorage.setItem('refreshToken', data.refreshToken);
      // await AsyncStorage.setItem('user', JSON.stringify(data.user));

      // Call custom success callback if provided
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError<ApiError>) => {
      // Call custom error callback if provided
      options?.onError?.(error);
    },
  });
};
