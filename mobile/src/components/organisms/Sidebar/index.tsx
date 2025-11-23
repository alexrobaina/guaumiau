import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User, LogOut, X, Cat, Dog, Footprints, Search, Calendar } from 'lucide-react-native';
import { Text } from '@/components/atoms/Text';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/theme';
import { styles } from './styles';

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

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.item, isActive && styles.itemActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text variant="body" style={[styles.label, isActive && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigation = useNavigation<any>();
  const { logout } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('Home');

  // Track navigation state changes
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const state = navigation.getState();
      if (state && state.routes && state.routes[state.index]) {
        const route = state.routes[state.index];
        setCurrentRoute(route.name);
      }
    });

    // Get initial route
    const state = navigation.getState();
    if (state && state.routes && state.routes[state.index]) {
      const route = state.routes[state.index];
      setCurrentRoute(route.name);
    }

    return unsubscribe;
  }, [navigation]);

  const menuItems = [
    {
      icon: <Footprints size={24} color={theme.colors.textSecondary} />,
      activeIcon: <Footprints size={24} color={theme.colors.primary} />,
      label: 'Cuidadores ',
      routeName: 'WalkerHome',
    },
    {
      icon: <Search size={24} color={theme.colors.textSecondary} />,
      activeIcon: <Search size={24} color={theme.colors.primary} />,
      label: 'Buscar Cuidadores',
      routeName: 'SearchWalkers',
    },
    {
      icon: <Dog size={24} color={theme.colors.textSecondary} />,
      activeIcon: <Dog size={24} color={theme.colors.primary} />,
      label: 'Mis Mascotas',
      routeName: 'MyPets',
    },
    {
      icon: <Calendar size={24} color={theme.colors.textSecondary} />,
      activeIcon: <Calendar size={24} color={theme.colors.primary} />,
      label: 'Mis Reservas',
      routeName: 'MyBookings',
    },
    {
      label: 'Mi Perfil',
      routeName: 'MyAccount',
      icon: <User size={24} color={theme.colors.textSecondary} />,
      activeIcon: <User size={24} color={theme.colors.primary} />,
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
    <Modal visible={isOpen} transparent={false} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* Sidebar */}
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.brandContainer}>
                <Cat size={24} color={theme.colors.primary} />
                <Text style={styles.brandText}>Guau Miau</Text>
                <Dog size={24} color={theme.colors.primary} />
              </View>
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
              activeOpacity={0.7}
            >
              <LogOut size={24} color={theme.colors.error} />
              <Text variant="body" color="error" style={styles.logoutLabel}>
                Cerrar Sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
