import { StateCreator } from 'zustand';
import { RootState } from '../types';

export interface UISlice {
  isOnline: boolean;
  activeTab: string;
  notifications: Notification[];
  loading: Record<string, boolean>;
  setOnlineStatus: (status: boolean) => void;
  setActiveTab: (tab: string) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  setLoading: (key: string, loading: boolean) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const createUISlice: StateCreator<
  RootState,
  [['zustand/immer', never]],
  [],
  UISlice
> = set => ({
  isOnline: true,
  activeTab: 'home',
  notifications: [],
  loading: {},

  setOnlineStatus: status =>
    set((state: RootState) => {
      state.isOnline = status;
    }),

  setActiveTab: tab =>
    set((state: RootState) => {
      state.activeTab = tab;
    }),

  addNotification: notification =>
    set((state: RootState) => {
      state.notifications.unshift(notification);
    }),

  removeNotification: id =>
    set((state: RootState) => {
      state.notifications = state.notifications.filter(
        (n: Notification) => n.id !== id
      );
    }),

  setLoading: (key, loading) =>
    set((state: RootState) => {
      if (loading) {
        state.loading[key] = true;
      } else {
        delete state.loading[key];
      }
    }),
});
