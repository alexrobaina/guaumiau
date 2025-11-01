import React, {useState, createContext, useContext} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Menu} from 'lucide-react-native';
import {HomeScreen} from '../screens/HomeScreen';
import {ScheduleScreen} from '../screens/ScheduleScreen';
import {AchievementsScreen} from '../screens/AchievementsScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {SettingsScreen} from '../screens/SettingsScreen';
import {MyPetsScreen} from '../screens/MyPetsScreen';
import {WalkerHomeScreen} from '../screens/WalkerHomeScreen';
import {Sidebar} from '../components/organisms/Sidebar';
import {theme} from '../theme';

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
  const {setIsSidebarOpen} = useContext(SidebarContext);

  return (
    <TouchableOpacity
      onPress={() => setIsSidebarOpen(true)}
      style={styles.menuButton}>
      <Menu size={24} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

export const MainNavigator = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{isSidebarOpen, setIsSidebarOpen}}>
      <View style={{flex: 1}}>
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerLeft: () => <HeaderLeft />,
            headerTitle: '',
            headerStyle: {
              backgroundColor: theme.colors.surface,
            },
            headerShadowVisible: true,
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'Home'}}
          />
          <Stack.Screen
            name="Schedule"
            component={ScheduleScreen}
            options={{title: 'Schedule'}}
          />
          <Stack.Screen
            name="Achievements"
            component={AchievementsScreen}
            options={{title: 'Achievements'}}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{title: 'Profile'}}
          />
          <Stack.Screen
            name="MyPets"
            component={MyPetsScreen}
            options={{title: 'My Pets'}}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{title: 'Settings'}}
          />
          <Stack.Screen
            name="WalkerHome"
            component={WalkerHomeScreen}
            options={{title: 'Walker Home', headerShown: false}}
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
