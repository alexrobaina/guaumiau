import {useMutation, UseMutationResult} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {authService} from '@/services/api/auth.service';
import {ApiError} from '@/types/auth.types';

interface VerifyEmailRequest {
  token: string;
}

interface VerifyEmailResponse {
  message: string;
}

interface UseVerifyEmailOptions {
  onSuccess?: (data: VerifyEmailResponse) => void;
  onError?: (error: AxiosError<ApiError>) => void;
}

export const useVerifyEmail = (
  options?: UseVerifyEmailOptions,
): UseMutationResult<
  VerifyEmailResponse,
  AxiosError<ApiError>,
  VerifyEmailRequest
> => {
  return useMutation<
    VerifyEmailResponse,
    AxiosError<ApiError>,
    VerifyEmailRequest
  >({
    mutationFn: (data: VerifyEmailRequest) =>
      authService.verifyEmail(data.token),
    onSuccess: (data: VerifyEmailResponse) => {
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError<ApiError>) => {
      options?.onError?.(error);
    },
  });
};
