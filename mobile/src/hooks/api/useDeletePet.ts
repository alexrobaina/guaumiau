import {useMutation, UseMutationResult, useQueryClient} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {petService} from '@/services/api/pet.service';

interface ApiError {
  message: string;
  statusCode: number;
}

interface UseDeletePetOptions {
  onSuccess?: (data: {message: string}) => void;
  onError?: (error: AxiosError<ApiError>) => void;
}

/**
 * Custom hook for deleting a pet
 * @param options - Optional callbacks for success and error handling
 * @returns React Query mutation object
 */
export const useDeletePet = (
  options?: UseDeletePetOptions,
): UseMutationResult<{message: string}, AxiosError<ApiError>, string> => {
  const queryClient = useQueryClient();

  return useMutation<{message: string}, AxiosError<ApiError>, string>({
    mutationFn: (id: string) => petService.delete(id),
    onSuccess: (data: {message: string}) => {
      // Invalidate and refetch pets list
      queryClient.invalidateQueries({queryKey: ['pets']});

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
 * const deletePet = useDeletePet({
 *   onSuccess: (data) => {
 *     console.log('Pet deleted:', data.message);
 *     navigation.goBack();
 *   },
 *   onError: (error) => {
 *     console.error('Failed to delete pet:', error.response?.data.message);
 *   }
 * });
 *
 * // In your component
 * const handleDeletePet = (petId: string) => {
 *   deletePet.mutate(petId);
 * };
 */
