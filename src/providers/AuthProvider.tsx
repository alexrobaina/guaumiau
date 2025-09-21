import React, { useEffect, useRef } from 'react';
import { useStore } from '@/store';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setInitialized } = useStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initAuth = async () => {
      try {
        // Check if Firebase is properly configured
        const { isFirebaseConfigured } = await import('@/lib/firebase/config');
        
        if (isFirebaseConfigured()) {
          // Use real Firebase authentication
          const { initializeAuth } = useStore.getState();
          return await initializeAuth();
        } else {
          // In development mode without Firebase, just mark as initialized
          console.warn('Firebase not configured, running in demo mode');
          setTimeout(() => setInitialized(true), 100); // Slight delay
          return () => {}; // Return empty unsubscribe function
        }
      } catch (error) {
        console.warn('Auth initialization failed:', error);
        setTimeout(() => setInitialized(true), 100); // Slight delay
        return () => {};
      }
    };

    let unsubscribe: (() => void) | null = null;
    
    initAuth().then(unsub => {
      unsubscribe = unsub || null;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // Remove dependencies to prevent re-initialization

  return <>{children}</>;
};