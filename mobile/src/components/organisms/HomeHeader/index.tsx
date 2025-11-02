import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin, Bell, User, Menu } from 'lucide-react-native';
import { styles } from './styles';
import { theme } from '@/theme';

interface IHomeHeaderProps {
  userName: string;
  location: string;
  onNotificationPress: () => void;
  onProfilePress: () => void;
  onMenuPress?: () => void;
  testID?: string;
}

export const HomeHeader = memo<IHomeHeaderProps>(
  ({ userName, location, onNotificationPress, onProfilePress, onMenuPress, testID }) => {
    return (
      <View style={styles.container} testID={testID}>
        {onMenuPress && (
          <TouchableOpacity style={styles.menuButton} onPress={onMenuPress} activeOpacity={0.7}>
            <Menu size={24} color={theme.colors.surface} />
          </TouchableOpacity>
        )}
        <View style={styles.content}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Hola, {userName}!</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={theme.colors.surface} />
              <Text style={styles.location}>{location}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onNotificationPress}
              activeOpacity={0.7}
            >
              <Bell size={24} color={theme.colors.surface} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onProfilePress}
              activeOpacity={0.7}
            >
              <User size={24} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },
);
