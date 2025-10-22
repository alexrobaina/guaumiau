import { createContext, useContext, ReactNode } from 'react';
import { RootStore } from './RootStore';

const RootStoreContext = createContext<RootStore | null>(null);

const rootStore = new RootStore();

interface RootStoreProviderProps {
  children: ReactNode;
}

export function RootStoreProvider({ children }: RootStoreProviderProps) {
  return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>;
}

export function useRootStore(): RootStore {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw new Error('useRootStore must be used within RootStoreProvider');
  }
  return store;
}
