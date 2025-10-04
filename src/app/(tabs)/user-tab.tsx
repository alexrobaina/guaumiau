import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store';
import { useUserProfile } from '@/hooks/queries/useUserProfile';
import { Button } from '@/components/atoms/Button';
import { Colors } from '@/lib/colors';

const { width } = Dimensions.get('window');

interface UserTabScreenProps {
  onToggleSidebar?: () => void;
}

export const UserTabScreen: React.FC<UserTabScreenProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useStore();
  const { data: userProfile } = useUserProfile();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
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
    ]);
  };

  const QuickActionCard = ({
    icon,
    title,
    description,
    onPress,
    color = Colors.primary[500],
  }: {
    icon: string;
    title: string;
    description: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity
      style={styles.quickActionCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
    </TouchableOpacity>
  );

  const ProfileSection = () => (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={32} color={Colors.primary[500]} />
          </View>
        )}
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {user?.displayName || 'CruxClimb User'}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        {userProfile?.experience && (
          <View style={styles.experienceBadge}>
            <Text style={styles.experienceText}>
              {userProfile.experience.charAt(0).toUpperCase() +
                userProfile.experience.slice(1)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notLoggedIn}>
          <Ionicons name="person-outline" size={64} color={Colors.gray[400]} />
          <Text style={styles.notLoggedInText}>
            Please login to access your profile
          </Text>
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
        <View style={styles.headerTop}>
          {onToggleSidebar && (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={onToggleSidebar}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={24} color={Colors.white} />
            </TouchableOpacity>
          )}
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Welcome back!</Text>
            <Text style={styles.headerSubtitle}>Ready to train?</Text>
          </View>
        </View>

        <ProfileSection />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <QuickActionCard
            icon="fitness-outline"
            title="Start Training"
            description="Begin your workout session"
            onPress={() => router.push('/training-plans')}
            color={Colors.success}
          />
          {/* 
          <QuickActionCard
            icon="analytics-outline"
            title="View Progress"
            description="Check your training progress"
            onPress={() => router.push('/(tabs)/progress')}
            color={Colors.primary[500]}
          /> */}

          <QuickActionCard
            icon="time-outline"
            title="Training History"
            description="Review past sessions"
            onPress={() => router.push('/training-plans?view=history')}
            color={Colors.warning}
          />
        </View>

        {/* Profile Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Management</Text>

          <QuickActionCard
            icon="target-outline"
            title="Training Goals"
            description="Manage your training goals"
            onPress={() => router.push('/training-goals')}
            color={Colors.primary[500]}
          />

          {/* <QuickActionCard
            icon="person-outline"
            title="Edit Profile"
            description="Update your information"
            onPress={() => console.log('Edit profile')}
            color={Colors.gray[600]}
          />

          <QuickActionCard
            icon="notifications-outline"
            title="Notifications"
            description="Manage notifications"
            onPress={() => console.log('Notification settings')}
            color={Colors.gray[600]}
          /> */}
        </View>

        {/* Climbing Stats */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>

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
        </View> */}

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
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    paddingBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    marginBottom: 12,
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  experienceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  experienceText: {
    fontSize: 12,
    color: Colors.white,
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
  quickActionCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 14,
    color: Colors.gray[600],
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
    shadowOffset: { width: 0, height: 2 },
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
    marginVertical: 24,
    textAlign: 'center',
  },
});
