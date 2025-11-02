import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {User} from '@/types/auth.types';
import {storage} from '@/utils/storage';
import {setAuthToken, clearAuthToken} from '@/services/api/client';
import {authService} from '@/services/api/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user and tokens from storage on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const [storedToken, storedRefreshToken, storedUser] = await Promise.all([
          storage.getToken(),
          storage.getRefreshToken(),
          storage.getUser(),
        ]);

        if (storedToken && storedRefreshToken && storedUser) {
          setAuthToken(storedToken);

          // Fetch fresh user data from backend to ensure we have latest data
          try {
            const response = await authService.me();
            const freshUser = response.user;
            await storage.saveUser(freshUser);
            setUser(freshUser);
          } catch (error) {
            console.warn('Failed to fetch fresh user data, using cached:', error);
            // Fallback to cached user if backend call fails
            setUser(storedUser);
          }
        }
      } catch (error) {
        console.error('Error loading auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  const login = useCallback(
    async (userData: User, accessToken: string, refreshToken: string) => {
      try {
        await Promise.all([
          storage.saveToken(accessToken),
          storage.saveRefreshToken(refreshToken),
          storage.saveUser(userData),
        ]);
        setAuthToken(accessToken);
        setUser(userData);
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      // Call backend logout endpoint (if token is available)
      try {
        await authService.logout();
      } catch (error) {
        // Ignore logout API errors - still clear local data
        console.warn('Logout API call failed:', error);
      }

      // Clear local storage and state
      await storage.clearAuth();
      clearAuthToken();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }, []);

  const updateUser = useCallback(async (userData: User) => {
    try {
      await storage.saveUser(userData);
      setUser(userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
