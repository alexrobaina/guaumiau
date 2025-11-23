import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { bookingService } from '@/services/api/booking.service';
import type { UserBooking } from '@/types/booking.api.types';

interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * Custom hook for fetching all bookings for the current user
 * @returns React Query query object
 */
export const useBookings = (): UseQueryResult<UserBooking[], AxiosError<ApiError>> => {
  return useQuery<UserBooking[], AxiosError<ApiError>>({
    queryKey: ['bookings'],
    queryFn: () => bookingService.getBookings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook Usage Example:
 *
 * const {data: bookings, isLoading, isError, error, refetch} = useBookings();
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (isError) return <ErrorMessage error={error.response?.data.message} />;
 *
 * return (
 *   <FlatList
 *     data={bookings}
 *     renderItem={({item}) => <BookingCard booking={item} />}
 *   />
 * );
 */
