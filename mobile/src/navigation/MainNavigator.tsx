import { useState, createContext, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Menu } from 'lucide-react-native';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { MyPetsScreen } from '../screens/MyPetsScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { BookingDetailScreen } from '../screens/BookingDetailScreen';
import { MyAccountScreen } from '../screens/MyAccountScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { WalkerHomeScreen } from '../screens/WalkerHomeScreen';
import { ProviderProfileScreen } from '../screens/ProviderProfileScreen';
import { SearchWalkersScreen } from '../screens/SearchWalkersScreen';
import { PetProfileScreen } from '../screens/PetProfileScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { Sidebar } from '../components/organisms/Sidebar';
import { theme } from '../theme';

const Stack = createNativeStackNavigator();

// Create context for sidebar state
interface SidebarContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
});

const HeaderLeft = () => {
  const { setIsSidebarOpen } = useContext(SidebarContext);

  return (
    <TouchableOpacity onPress={() => setIsSidebarOpen(true)} style={styles.menuButton}>
      <Menu size={24} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

export const MainNavigator = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerLeft: () => <HeaderLeft />,
            headerStyle: {
              backgroundColor: theme.colors.surface,
            },
            headerShadowVisible: true,
          }}
        >
          <Stack.Screen
            name="WalkerHome"
            component={WalkerHomeScreen}
            options={{ title: 'Inicio', headerShown: false }}
          />
          <Stack.Screen
            name="Schedule"
            component={ScheduleScreen}
            options={{ title: 'Agenda' }}
          />
          <Stack.Screen
            name="Achievements"
            component={AchievementsScreen}
            options={{ title: 'Logros' }}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
          <Stack.Screen name="MyPets" component={MyPetsScreen} options={{ title: 'Mis Mascotas' }} />
          <Stack.Screen
            name="MyBookings"
            component={MyBookingsScreen}
            options={{ title: 'Mis Reservas' }}
          />
          <Stack.Screen
            name="BookingDetail"
            component={BookingDetailScreen}
            options={{ title: 'Detalle de Reserva' }}
          />
          <Stack.Screen
            name="MyAccount"
            component={MyAccountScreen}
            options={{ title: 'Mi Cuenta' }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: 'Editar Perfil' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Configuración' }}
          />
          <Stack.Screen
            name="ProviderProfile"
            component={ProviderProfileScreen}
            options={{ title: 'Perfil del Paseador' }}
          />
          <Stack.Screen
            name="SearchWalkers"
            component={SearchWalkersScreen}
            options={{ title: 'Buscar Paseadores' }}
          />
          <Stack.Screen
            name="PetProfile"
            component={PetProfileScreen}
            options={{ title: 'Perfil de Mascota' }}
          />
          <Stack.Screen
            name="Booking"
            component={BookingScreen}
            options={{ title: 'Reservar Servicio' }}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ title: 'Procesar Pago' }}
          />
        </Stack.Navigator>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </View>
    </SidebarContext.Provider>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
});
