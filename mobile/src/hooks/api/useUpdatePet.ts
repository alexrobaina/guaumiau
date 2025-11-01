import {useMutation, UseMutationResult, useQueryClient} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {petService} from '@/services/api/pet.service';
import {UpdatePetRequest, PetResponse} from '@/types/pet.types';

interface ApiError {
  message: string;
  statusCode: number;
}

interface UseUpdatePetOptions {
  onSuccess?: (data: PetResponse) => void;
  onError?: (error: AxiosError<ApiError>) => void;
}

interface UpdatePetVariables {
  id: string;
  data: UpdatePetRequest;
}

/**
 * Custom hook for updating a pet
 * @param options - Optional callbacks for success and error handling
 * @returns React Query mutation object
 */
export const useUpdatePet = (
  options?: UseUpdatePetOptions,
): UseMutationResult<PetResponse, AxiosError<ApiError>, UpdatePetVariables> => {
  const queryClient = useQueryClient();

  return useMutation<PetResponse, AxiosError<ApiError>, UpdatePetVariables>({
    mutationFn: ({id, data}: UpdatePetVariables) => petService.update(id, data),
    onSuccess: (data: PetResponse) => {
      // Invalidate and refetch specific pet and pets list
      queryClient.invalidateQueries({queryKey: ['pet', data.id]});
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
 * const updatePet = useUpdatePet({
 *   onSuccess: (data) => {
 *     console.log('Pet updated:', data.name);
 *     navigation.goBack();
 *   },
 *   onError: (error) => {
 *     console.error('Failed to update pet:', error.response?.data.message);
 *   }
 * });
 *
 * // In your component
 * const handleUpdatePet = (petId: string, petData: UpdatePetRequest) => {
 *   updatePet.mutate({ id: petId, data: petData });
 * };
 */
