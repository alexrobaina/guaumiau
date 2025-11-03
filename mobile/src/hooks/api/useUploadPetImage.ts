import {useMutation, UseMutationOptions} from '@tanstack/react-query';
import {uploadPetImage, UploadResponse} from '@/services/api/upload.service';
import {AxiosError} from 'axios';

/**
 * Hook to upload a pet image to S3
 * @returns Mutation hook for uploading pet images
 */
export const useUploadPetImage = (
  options?: UseMutationOptions<UploadResponse, AxiosError, string>,
) => {
  return useMutation<UploadResponse, AxiosError, string>({
    mutationFn: uploadPetImage,
    ...options,
  });
};
