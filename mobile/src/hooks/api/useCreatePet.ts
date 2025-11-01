import {useMutation, UseMutationResult, useQueryClient} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {petService} from '@/services/api/pet.service';
import {CreatePetRequest, PetResponse} from '@/types/pet.types';

interface ApiError {
  message: string;
  statusCode: number;
}

interface UseCreatePetOptions {
  onSuccess?: (data: PetResponse) => void;
  onError?: (error: AxiosError<ApiError>) => void;
}

/**
 * Custom hook for creating a new pet
 * @param options - Optional callbacks for success and error handling
 * @returns React Query mutation object
 */
export const useCreatePet = (
  options?: UseCreatePetOptions,
): UseMutationResult<PetResponse, AxiosError<ApiError>, CreatePetRequest> => {
  const queryClient = useQueryClient();

  return useMutation<PetResponse, AxiosError<ApiError>, CreatePetRequest>({
    mutationFn: (data: CreatePetRequest) => petService.create(data),
    onSuccess: (data: PetResponse) => {
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
 * const createPet = useCreatePet({
 *   onSuccess: (data) => {
 *     console.log('Pet created:', data.name);
 *     navigation.goBack();
 *   },
 *   onError: (error) => {
 *     console.error('Failed to create pet:', error.response?.data.message);
 *   }
 * });
 *
 * // In your component
 * const handleCreatePet = (petData: CreatePetRequest) => {
 *   createPet.mutate(petData);
 * };
 *
 * // Access mutation state
 * createPet.isPending  // Loading state
 * createPet.isError    // Error state
 * createPet.error      // Error object
 * createPet.data       // Response data
 */
