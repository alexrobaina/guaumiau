import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { locationService, UpdateLocationRequest, UpdateLocationResponse } from '@/services/api/location.service';
import { useAuth } from '@/contexts/AuthContext';

interface UseUpdateLocationOptions {
  onSuccess?: (data: UpdateLocationResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to update user's current location
 */
export const useUpdateLocation = (options?: UseUpdateLocationOptions) => {
  const { updateUser } = useAuth();

  return useMutation<UpdateLocationResponse, Error, UpdateLocationRequest>({
    mutationFn: locationService.updateLocation,
    onSuccess: (data) => {
      // Update the user in auth context with new location data
      updateUser({
        ...data,
        roles: data.roles || [],
        avatar: data.avatar || null,
        termsAccepted: data.termsAccepted || false,
        termsAcceptedAt: data.termsAcceptedAt || null,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      });

      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};
