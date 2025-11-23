import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/api/auth.service';
import { UpdateProfileRequest, MeResponse } from '@/types/auth.types';
import { useAuth } from '@/contexts/AuthContext';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authService.updateProfile(data),
    onSuccess: (data: MeResponse) => {
      // Update auth context with new user data
      updateUser(data.user);

      // Invalidate and refetch user query
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};
