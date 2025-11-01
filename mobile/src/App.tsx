import 'react-native-gesture-handler';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config/queryClient';
import { RootStoreProvider } from './stores/RootStoreProvider';
import { AuthProvider } from './contexts/AuthContext';
import { RootNavigator } from './navigation/RootNavigator';
import RNBootSplash from 'react-native-bootsplash';
import { useEffect } from 'react';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Hide splash screen after app is ready
    const init = async () => {
      // You can add any initialization logic here
      // For example, checking auth state, loading resources, etc.
      await RNBootSplash.hide({ fade: true });
    };

    init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootStoreProvider>
          <SafeAreaProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <RootNavigator />
          </SafeAreaProvider>
        </RootStoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
