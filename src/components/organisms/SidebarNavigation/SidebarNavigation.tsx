import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SidebarNavigationProps, SidebarTabItem, SidebarTabProps } from './SidebarNavigation.types';
import { makeStyles } from './SidebarNavigation.styles';
import { Colors } from '@/lib/colors';

const SidebarTab: React.FC<SidebarTabProps> = ({ item, isActive, onPress }) => {
  const styles = makeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.tabItem,
        isActive ? styles.tabItemActive : styles.tabItemInactive,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.tabContent}>
        <View style={[
          styles.tabIconContainer,
          isActive ? styles.tabIconActive : styles.tabIconInactive,
        ]}>
          <Ionicons
            name={item.icon as any}
            size={24}
            color={isActive ? Colors.primary[600] : Colors.gray[600]}
          />
        </View>

        <View style={styles.tabTextContainer}>
          <Text style={[
            styles.tabTitle,
            isActive ? styles.tabTitleActive : styles.tabTitleInactive,
          ]}>
            {item.title}
          </Text>
          <Text style={styles.tabDescription}>{item.description}</Text>
        </View>

        {item.badge && item.badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.badge > 99 ? '99+' : item.badge}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const SIDEBAR_TABS: SidebarTabItem[] = [
  {
    id: 'user',
    title: 'User',
    icon: 'person-outline',
    description: 'Profile & home',
  },
  {
    id: 'training-plan',
    title: 'Training Plan',
    icon: 'fitness-outline',
    description: 'Plans & history',
  },
  {
    id: 'schedule',
    title: 'Schedule',
    icon: 'calendar-outline',
    description: 'Calendar & progress',
  },
];

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  onTabChange,
  children,
  isOpen,
  onToggle,
}) => {
  const styles = makeStyles();

  const handleTabSelect = (tabId: 'user' | 'training-plan' | 'schedule') => {
    onTabChange(tabId);
    onToggle(); // Close sidebar after selection
  };

  return (
    <View style={styles.container}>
      {/* Menu Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isOpen ? 'close' : 'menu'}
          size={24}
          color={Colors.gray[700]}
        />
      </TouchableOpacity>

      {/* Overlay */}
      {isOpen && (
        <TouchableWithoutFeedback onPress={onToggle}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          isOpen ? styles.sidebarOpen : styles.sidebarClosed,
        ]}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onToggle}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color={Colors.gray[600]} />
        </TouchableOpacity>

        <View style={styles.sidebarContent}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.headerTitle}>CruxClimb</Text>
            <Text style={styles.headerSubtitle}>Training Hub</Text>
          </View>

          <ScrollView
            style={styles.tabsList}
            showsVerticalScrollIndicator={false}
          >
            {SIDEBAR_TABS.map((tab) => (
              <SidebarTab
                key={tab.id}
                item={tab}
                isActive={activeTab === tab.id}
                onPress={() => handleTabSelect(tab.id)}
              />
            ))}
          </ScrollView>
        </View>
      </Animated.View>

      {/* Content Area */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};