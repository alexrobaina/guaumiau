import { useState, useEffect } from 'react';

export const useFirebaseConfig = () => {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const { isFirebaseConfigured } = await import('@/lib/firebase/config');
        setIsConfigured(isFirebaseConfigured());
      } catch (error) {
        console.warn('Failed to check Firebase config:', error);
        setIsConfigured(false);
      }
    };

    checkConfig();
  }, []);

  return {
    isConfigured,
    isLoading: isConfigured === null,
  };
};