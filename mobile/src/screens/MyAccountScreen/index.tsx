import React, { memo } from 'react';
import { View, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { User, Mail, MapPin, Calendar, Shield, Edit } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useUser } from '@/hooks/api/useUser';
import { Text, Button, Card, Spacer } from '@/components';
import { theme } from '@/theme';
import { styles } from './styles';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'MyAccount'>;

export const MyAccountScreen = memo(() => {
  const navigation = useNavigation<NavigationProp>();
  const { data, isLoading, error, refetch, isFetching } = useUser();

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Spacer size="md" />
        <Text variant="body" color={'textSecondary'}>
          Loading your account...
        </Text>
      </View>
    );
  }

  // Error state
  if (error || !data) {
    const errorMessage = error?.message || 'Failed to load account information';
    const networkError = errorMessage.toLowerCase().includes('network');

    return (
      <View style={styles.centerContainer}>
        <Text variant="h2" style={styles.centerText}>
          {networkError ? '📡 Connection Error' : '😕 Oops!'}
        </Text>
        <Spacer size="md" />
        <Text variant="body" color={'textSecondary'} style={styles.centerText}>
          {errorMessage}
        </Text>
        <Spacer size="lg" />
        <Button variant="primary" onPress={() => refetch()} disabled={isFetching}>
          {isFetching ? 'Retrying...' : 'Try Again'}
        </Button>
      </View>
    );
  }

  const user = data.user;
  const fullName = `${user.firstName} ${user.lastName}`;
  const location = user.city && user.country ? `${user.city}, ${user.country}` : user.country;
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Format roles for display
  const formatRole = (role: string) => {
    return role
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text variant="h1" style={{ color: '#ffffff', fontSize: 40 }}>
                  {user.firstName.charAt(0)}
                </Text>
              </View>
            )}
          </View>

          <Spacer size="md" />

          <Text variant="h1" style={styles.centerText}>
            {fullName}
          </Text>

          <Spacer size="xs" />

          <Text variant="body" color={'textSecondary'} style={styles.centerText}>
            @{user.username}
          </Text>

          <Spacer size="lg" />

          {/* Edit Profile Button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Edit size={18} color="#ffffff" />
            <Text variant="body" style={styles.editButtonText}>
              Editar Perfil
            </Text>
          </TouchableOpacity>
        </View>

        <Spacer size="xl" />

        {/* Roles Card */}
        <Card padding="medium" style={styles.card}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color={theme.colors.primary} />
            <Text variant="h2" style={styles.sectionTitle}>
              Account Roles
            </Text>
          </View>
          <Spacer size="md" />
          <View style={styles.rolesContainer}>
            {user.roles.map((role, index) => (
              <View key={index} style={styles.roleBadge}>
                <Text variant="body" style={styles.roleBadgeText}>
                  {formatRole(role)}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <Spacer size="md" />

        {/* Contact Information Card */}
        <Card padding="medium" style={styles.card}>
          <Text variant="h2" style={styles.sectionTitle}>
            Contact Information
          </Text>
          <Spacer size="md" />

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Mail size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text variant="caption" color={'textSecondary'}>
                Email
              </Text>
              <Text variant="body">{user.email}</Text>
            </View>
          </View>

          {user.address && (
            <>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <MapPin size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text variant="caption" color={'textSecondary'}>
                    Address
                  </Text>
                  <Text variant="body">{user.address}</Text>
                  {location && (
                    <Text variant="caption" color={'textSecondary'}>
                      {location}
                    </Text>
                  )}
                </View>
              </View>
            </>
          )}

          {!user.address && location && (
            <>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <MapPin size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text variant="caption" color={'textSecondary'}>
                    Location
                  </Text>
                  <Text variant="body">{location}</Text>
                </View>
              </View>
            </>
          )}
        </Card>

        <Spacer size="md" />

        {/* Account Information Card */}
        <Card padding="medium" style={styles.card}>
          <Text variant="h2" style={styles.sectionTitle}>
            Account Information
          </Text>
          <Spacer size="md" />

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <User size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text variant="caption" color={'textSecondary'}>
                User ID
              </Text>
              <Text variant="caption" style={styles.userId}>
                {user.id}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Calendar size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text variant="caption" color={'textSecondary'}>
                Member Since
              </Text>
              <Text variant="body">{joinDate}</Text>
            </View>
          </View>

          {user.termsAccepted && user.termsAcceptedAt && (
            <>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Shield size={18} color={theme.colors.success} />
                </View>
                <View style={styles.infoContent}>
                  <Text variant="caption" color={'textSecondary'}>
                    Terms Accepted
                  </Text>
                  <Text variant="body">
                    {new Date(user.termsAcceptedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </>
          )}
        </Card>

        <Spacer size="xl" />
      </View>
    </ScrollView>
  );
});

MyAccountScreen.displayName = 'MyAccountScreen';
