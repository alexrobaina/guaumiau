import {useQuery, UseQueryResult} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {petService} from '@/services/api/pet.service';
import {PetsListResponse} from '@/types/pet.types';

interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * Custom hook for fetching all pets for the current user
 * @returns React Query query object
 */
export const usePets = (): UseQueryResult<PetsListResponse, AxiosError<ApiError>> => {
  return useQuery<PetsListResponse, AxiosError<ApiError>>({
    queryKey: ['pets'],
    queryFn: () => petService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook Usage Example:
 *
 * const {data: pets, isLoading, isError, error} = usePets();
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (isError) return <ErrorMessage error={error.response?.data.message} />;
 *
 * return (
 *   <FlatList
 *     data={pets}
 *     renderItem={({item}) => <PetCard pet={item} />}
 *   />
 * );
 */
