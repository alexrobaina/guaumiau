import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { AuthService } = await import('@/lib/firebase/auth');
        const currentUser = AuthService.getCurrentUser();

        console.log('🔐 Current user from AuthService:', {
          exists: !!currentUser,
          uid: currentUser?.uid,
          email: currentUser?.email,
        });

        setUser(currentUser);
      } catch (error) {
        console.warn('Failed to get current user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
  };
};