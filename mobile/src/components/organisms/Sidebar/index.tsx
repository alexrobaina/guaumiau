import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import {useNavigation, NavigationState} from '@react-navigation/native';
import {
  Home,
  Calendar,
  Trophy,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react-native';
import {Text} from '@/components/atoms/Text';
import {useAuth} from '@/contexts/AuthContext';
import {theme} from '@/theme';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  routeName: string;
  isActive: boolean;
  onPress: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.item, isActive && styles.itemActive]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text
        variant="body"
        style={[styles.label, isActive && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({isOpen, onClose}) => {
  const navigation = useNavigation<any>();
  const {logout} = useAuth();
  const [currentRoute, setCurrentRoute] = useState('Home');

  // Track navigation state changes
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const state = navigation.getState();
      const route = state.routes[state.index];
      setCurrentRoute(route.name);
    });

    // Get initial route
    const state = navigation.getState();
    if (state) {
      const route = state.routes[state.index];
      setCurrentRoute(route.name);
    }

    return unsubscribe;
  }, [navigation]);

  const menuItems = [
    {
      icon: <Home size={24} color={theme.colors.textSecondary} />,
      activeIcon: <Home size={24} color={theme.colors.primary} />,
      label: 'Home',
      routeName: 'Home',
    },
    {
      icon: <Calendar size={24} color={theme.colors.textSecondary} />,
      activeIcon: <Calendar size={24} color={theme.colors.primary} />,
      label: 'Schedule',
      routeName: 'Schedule',
    },
    {
      icon: <Trophy size={24} color={theme.colors.textSecondary} />,
      activeIcon: <Trophy size={24} color={theme.colors.primary} />,
      label: 'Achievements',
      routeName: 'Achievements',
    },
    {
      icon: <User size={24} color={theme.colors.textSecondary} />,
      activeIcon: <User size={24} color={theme.colors.primary} />,
      label: 'Profile',
      routeName: 'Profile',
    },
    {
      icon: <Settings size={24} color={theme.colors.textSecondary} />,
      activeIcon: <Settings size={24} color={theme.colors.primary} />,
      label: 'Settings',
      routeName: 'Settings',
    },
  ];

  const handleNavigation = (routeName: string) => {
    navigation.navigate(routeName as never);
    onClose(); // Close sidebar after navigation
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* Overlay */}
        <Pressable style={styles.overlay} onPress={onClose} />

        {/* Sidebar */}
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.brandText}>Guaumiau</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.menu}>
            {menuItems.map(item => {
              const isActive = currentRoute === item.routeName;
              return (
                <SidebarItem
                  key={item.routeName}
                  icon={isActive ? item.activeIcon : item.icon}
                  label={item.label}
                  routeName={item.routeName}
                  isActive={isActive}
                  onPress={() => handleNavigation(item.routeName)}
                />
              );
            })}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}>
              <LogOut size={24} color={theme.colors.error} />
              <Text variant="body" color="error" style={styles.logoutLabel}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: 280,
    height: '100%',
    backgroundColor: theme.colors.surface,
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    paddingTop: theme.spacing.xxl + 20, // Extra padding for status bar
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  menu: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  itemActive: {
    backgroundColor: `${theme.colors.primary}15`,
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginLeft: theme.spacing.md,
    fontSize: 16,
  },
  labelActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  logoutLabel: {
    marginLeft: theme.spacing.md,
    fontSize: 16,
  },
});
