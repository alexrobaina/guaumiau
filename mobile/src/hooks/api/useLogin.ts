import {useMutation, UseMutationResult} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {authService} from '@/services/api/auth.service';
import {setAuthToken} from '@/services/api/client';
import {LoginRequest, AuthResponse, ApiError} from '@/types/auth.types';

interface UseLoginOptions {
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: AxiosError<ApiError>) => void;
}

/**
 * Custom hook for user login
 * @param options - Optional callbacks for success and error handling
 * @returns React Query mutation object
 */
export const useLogin = (
  options?: UseLoginOptions,
): UseMutationResult<AuthResponse, AxiosError<ApiError>, LoginRequest> => {
  return useMutation<AuthResponse, AxiosError<ApiError>, LoginRequest>({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
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

/**
 * Hook Usage Example:
 *
 * const login = useLogin({
 *   onSuccess: (data) => {
 *     console.log('Login successful:', data.user);
 *     navigation.navigate('Home');
 *   },
 *   onError: (error) => {
 *     console.error('Login failed:', error.response?.data.message);
 *   }
 * });
 *
 * // In your component
 * const handleLogin = (email: string, password: string) => {
 *   login.mutate({ email, password });
 * };
 *
 * // Access mutation state
 * login.isPending  // Loading state
 * login.isError    // Error state
 * login.error      // Error object
 * login.data       // Response data
 */
