import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';

// Error handling functions - will be implemented later
const showErrorToast = (message: string) => {
  console.error('Query Error:', message);
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Global error handling for queries
      if (query.state.data !== undefined) {
        showErrorToast(`Background refetch failed: ${error.message}`);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: error => {
      // Global error handling for mutations
      showErrorToast(`Operation failed: ${error.message}`);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 404) return false;
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 2,
      retryDelay: 1000,
    },
  },
});

// Network status observer
NetInfo.addEventListener(state => {
  if (state.isConnected && state.isInternetReachable) {
    queryClient.resumePausedMutations();
    queryClient.invalidateQueries();
  }
});
