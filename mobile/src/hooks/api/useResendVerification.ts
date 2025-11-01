import {useMutation, UseMutationResult} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {authService} from '@/services/api/auth.service';
import {ApiError} from '@/types/auth.types';

interface ResendVerificationRequest {
  email: string;
}

interface ResendVerificationResponse {
  message: string;
}

interface UseResendVerificationOptions {
  onSuccess?: (data: ResendVerificationResponse) => void;
  onError?: (error: AxiosError<ApiError>) => void;
}

export const useResendVerification = (
  options?: UseResendVerificationOptions,
): UseMutationResult<
  ResendVerificationResponse,
  AxiosError<ApiError>,
  ResendVerificationRequest
> => {
  return useMutation<
    ResendVerificationResponse,
    AxiosError<ApiError>,
    ResendVerificationRequest
  >({
    mutationFn: (data: ResendVerificationRequest) =>
      authService.resendVerification(data.email),
    onSuccess: (data: ResendVerificationResponse) => {
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError<ApiError>) => {
      options?.onError?.(error);
    },
  });
};
