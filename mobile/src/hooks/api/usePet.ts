import {useQuery, UseQueryResult} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {petService} from '@/services/api/pet.service';
import {PetResponse} from '@/types/pet.types';

interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * Custom hook for fetching a specific pet by ID
 * @param id - Pet ID
 * @returns React Query query object
 */
export const usePet = (
  id: string,
): UseQueryResult<PetResponse, AxiosError<ApiError>> => {
  return useQuery<PetResponse, AxiosError<ApiError>>({
    queryKey: ['pet', id],
    queryFn: () => petService.getById(id),
    enabled: !!id, // Only run query if id is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook Usage Example:
 *
 * const {data: pet, isLoading, isError, error} = usePet(petId);
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (isError) return <ErrorMessage error={error.response?.data.message} />;
 * if (!pet) return <NotFound />;
 *
 * return <PetProfile pet={pet} />;
 */
