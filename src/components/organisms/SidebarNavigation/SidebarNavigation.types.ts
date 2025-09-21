import { ReactNode } from 'react';

export interface SidebarNavigationProps {
  activeTab: 'user' | 'training-plan' | 'schedule';
  onTabChange: (tab: 'user' | 'training-plan' | 'schedule') => void;
  children?: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export interface SidebarTabItem {
  id: 'user' | 'training-plan' | 'schedule';
  title: string;
  icon: string;
  description: string;
  badge?: number;
}

export interface SidebarTabProps {
  item: SidebarTabItem;
  isActive: boolean;
  onPress: () => void;
  isCollapsed?: boolean;
}