import React, { useState } from 'react';
import { SidebarNavigation } from '@/components/organisms/SidebarNavigation';
import { UserTabScreen } from './user-tab';
import { TrainingPlanTabScreen } from './training-plan-tab';
import { ScheduleTabScreen } from './schedule-tab';

export default function TabLayout() {
  const [activeTab, setActiveTab] = useState<'user' | 'training-plan' | 'schedule'>('user');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    console.log('🎯 Rendering content for tab:', activeTab);
    switch (activeTab) {
      case 'user':
        return <UserTabScreen onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />;
      case 'training-plan':
        return <TrainingPlanTabScreen onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />;
      case 'schedule':
        console.log('📅 Rendering ScheduleTabScreen');
        return <ScheduleTabScreen onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />;
      default:
        return <UserTabScreen onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />;
    }
  };

  return (
    <SidebarNavigation
      activeTab={activeTab}
      onTabChange={setActiveTab}
      isOpen={isSidebarOpen}
      onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      {renderContent()}
    </SidebarNavigation>
  );
}