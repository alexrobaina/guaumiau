import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store';
import { Button } from '@/components/atoms/Button';
import { Colors } from '@/lib/colors';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, logout } = useStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert(
                'Logout Failed',
                error instanceof Error ? error.message : 'Please try again.'
              );
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const ProfileCard = ({ icon, title, value, onPress }: {
    icon: string;
    title: string;
    value: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.profileCardContent}>
        <View style={styles.profileCardLeft}>
          <Ionicons name={icon as any} size={24} color={Colors.primary[500]} />
          <View style={styles.profileCardText}>
            <Text style={styles.profileCardTitle}>{title}</Text>
            <Text style={styles.profileCardValue}>{value}</Text>
          </View>
        </View>
        {onPress && (
          <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
        )}
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notLoggedIn}>
          <Text style={styles.notLoggedInText}>Please login to view your profile</Text>
          <Button
            onPress={() => router.push('/(auth)/login')}
            variant="primary"
            size="lg"
          >
            Login
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons 
                  name="person" 
                  size={48} 
                  color={Colors.primary[500]} 
                />
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>
            {user.displayName || 'CruxClimb User'}
          </Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          {!user.emailVerified && (
            <View style={styles.verificationBadge}>
              <Ionicons name="warning" size={16} color={Colors.warning} />
              <Text style={styles.verificationText}>Email not verified</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          
          <ProfileCard
            icon="person-outline"
            title="Name"
            value={user.displayName || 'Not provided'}
            onPress={() => console.log('Edit name')}
          />
          
          <ProfileCard
            icon="mail-outline"
            title="Email"
            value={user.email || 'Not provided'}
          />
          
          <ProfileCard
            icon="call-outline"
            title="Phone"
            value={user.phoneNumber || 'Not provided'}
            onPress={() => console.log('Edit phone')}
          />
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <ProfileCard
            icon="shield-outline"
            title="Privacy & Security"
            value="Manage your account security"
            onPress={() => console.log('Privacy settings')}
          />
          
          <ProfileCard
            icon="notifications-outline"
            title="Notifications"
            value="Manage notifications"
            onPress={() => console.log('Notification settings')}
          />
          
          <ProfileCard
            icon="help-circle-outline"
            title="Help & Support"
            value="Get help and support"
            onPress={() => console.log('Help')}
          />
        </View>

        {/* Climbing Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Climbing Stats</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Routes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            onPress={handleLogout}
            loading={isLoggingOut}
            variant="danger"
            buttonStyle="outline"
            size="lg"
            fullWidth
            style={styles.logoutButton}
          >
            <View style={styles.logoutContent}>
              <Ionicons name="log-out-outline" size={20} color={Colors.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: Colors.white,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 12,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  verificationText: {
    fontSize: 12,
    color: Colors.white,
    marginLeft: 4,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray[900],
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  profileCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileCardText: {
    marginLeft: 12,
    flex: 1,
  },
  profileCardTitle: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 2,
  },
  profileCardValue: {
    fontSize: 16,
    color: Colors.gray[900],
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary[500],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  logoutSection: {
    marginTop: 16,
    marginBottom: 40,
  },
  logoutButton: {
    borderColor: Colors.error,
    borderWidth: 2,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 8,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  notLoggedInText: {
    fontSize: 18,
    color: Colors.gray[600],
    marginBottom: 24,
    textAlign: 'center',
  },
});