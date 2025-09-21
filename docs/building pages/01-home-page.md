# Profile Welcome Screen - Feature Documentation & Wireframe

## 📱 Screen Overview

**Screen Name:** Profile Welcome Screen  
**File Location:** `src/app/(tabs)/profile.tsx`  
**Navigation Position:** Tab 3 (Profile Tab)  
**Purpose:** Central hub for user profile management and quick access to training features

---

## 🎯 User Stories

As a logged-in user, I want to:

- See my profile information at a glance
- Quickly access my training features
- Manage my profile settings
- View my training statistics
- Have a personalized welcome experience

---

## 🖼️ Wireframe Structure

```
┌─────────────────────────────────┐
│      Profile Welcome Screen      │
├─────────────────────────────────┤
│                                  │
│  ┌─────────────────────────┐    │
│  │    Welcome Header       │    │
│  │  ┌──────┐              │    │
│  │  │Avatar│  Welcome back!│    │
│  │  └──────┘  Ready to     │    │
│  │           train?        │    │
│  │                         │    │
│  │  Name: Alex            │    │
│  │  Email: alex@...       │    │
│  │  Level: Advanced       │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │    Quick Actions        │    │
│  ├─────────────────────────┤    │
│  │ 💪 Start Training      >│    │
│  │ 📊 View Progress       >│    │
│  │ 📅 Training History    >│    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │  Profile Management     │    │
│  ├─────────────────────────┤    │
│  │ 🎯 Training Goals      >│    │
│  │ ✏️ Edit Profile        >│    │
│  │ 🔔 Notifications       >│    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │     Your Stats          │    │
│  ├─────────────────────────┤    │
│  │  Sessions  Routes  Hours│    │
│  │     12       45     36  │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │    [Logout Button]      │    │
│  └─────────────────────────┘    │
│                                  │
└─────────────────────────────────┘
```

---

## 🔧 Component Breakdown

### 1. Welcome Header Component

**Component:** `ProfileHeader.tsx`

**Features:**

- User avatar display (with fallback to initials)
- Personalized greeting with user's name
- Motivational subtitle ("Ready to train?")
- User info display:
  - Full name
  - Email address
  - Experience level badge

**Data Required:**

```typescript
interface ProfileHeaderData {
  userName: string;
  userEmail: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  profileImageUrl?: string;
}
```

### 2. Quick Actions Section

**Component:** `QuickActionsCard.tsx`

**Features:**

- Three primary action buttons with navigation:
  - **Start Training** → Navigate to Training Tab
  - **View Progress** → Navigate to Progress screen
  - **Training History** → Navigate to History screen

**Navigation Actions:**

```typescript
const quickActions = [
  {
    icon: '💪',
    title: 'Start Training',
    subtitle: 'Begin your workout session',
    action: () => navigation.navigate('Training'),
  },
  {
    icon: '📊',
    title: 'View Progress',
    subtitle: 'Check your training progress',
    action: () => navigation.navigate('Progress'),
  },
  {
    icon: '📅',
    title: 'Training History',
    subtitle: 'Review past sessions',
    action: () => navigation.navigate('History'),
  },
];
```

### 3. Profile Management Section

**Component:** `ProfileManagementCard.tsx`

**Features:**

- Secondary action buttons for profile settings:
  - **Training Goals** → Edit goals modal
  - **Edit Profile** → Profile edit screen
  - **Notifications** → Notification settings

**Navigation Actions:**

```typescript
const profileActions = [
  {
    icon: '🎯',
    title: 'Training Goals',
    subtitle: 'Manage your training goals',
    action: () => openGoalsModal(),
  },
  {
    icon: '✏️',
    title: 'Edit Profile',
    subtitle: 'Update your information',
    action: () => navigation.navigate('EditProfile'),
  },
  {
    icon: '🔔',
    title: 'Notifications',
    subtitle: 'Manage notifications',
    action: () => navigation.navigate('NotificationSettings'),
  },
];
```

### 4. Stats Summary Widget

**Component:** `StatsWidget.tsx`

**Features:**

- Three key metrics display:
  - Total training sessions completed
  - Total routes climbed
  - Total training hours

**Data Structure:**

```typescript
interface UserStats {
  totalSessions: number;
  totalRoutes: number;
  totalHours: number;
}
```

### 5. Logout Action

**Component:** `LogoutButton.tsx`

**Features:**

- Prominent logout button
- Confirmation dialog before logout
- Clear auth state and navigate to login

---

## 📊 Data Flow

### Data Sources

1. **User Profile Data** (from Zustand auth store)
   - Name, email, experience level
   - Profile image URL

2. **Training Statistics** (from Firestore)
   - Session count
   - Route count
   - Training hours

3. **User Preferences** (from AsyncStorage)
   - Notification settings
   - Display preferences

### State Management

```typescript
// Zustand slice extension
interface ProfileState {
  userStats: UserStats | null;
  isLoadingStats: boolean;
  fetchUserStats: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}
```

---

## 🎨 UI/UX Specifications

### Design Tokens

```typescript
const profileTheme = {
  colors: {
    primary: '#FF6B35', // CruxClimb orange
    headerBg: '#FF6B35', // Orange header
    cardBg: '#FFFFFF', // White cards
    textPrimary: '#1A1A1A', // Dark text
    textSecondary: '#666666', // Gray text
    border: '#E5E5E5', // Light border
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    card: 12,
    button: 8,
    avatar: 50,
  },
};
```

### Component Styling Guidelines

**Welcome Header:**

- Orange gradient background (#FF6B35 → #FF8C42)
- White text for contrast
- 80x80px avatar size
- Bold font for welcome message
- Regular font for user details

**Action Cards:**

- White background with subtle shadow
- 16px padding
- Icon on left (24x24px)
- Title in semibold
- Subtitle in gray
- Chevron arrow on right
- Ripple effect on press

**Stats Widget:**

- Horizontal layout with equal columns
- Large number display (24px)
- Small label below (12px)
- Centered alignment
- Dividers between stats

**Logout Button:**

- Outlined style (not filled)
- Red color (#FF4444)
- Full width with margin
- 48px height

---

## 🔄 User Interactions

### Touch Interactions

1. **Action Cards**: Tap to navigate
2. **Stats Widget**: Tap to view detailed analytics
3. **Logout Button**: Tap to show confirmation dialog
4. **Avatar**: Tap to change profile picture (future feature)

### Navigation Flow

```
Profile Screen
    ├── Start Training → Training Tab
    ├── View Progress → Progress Screen
    ├── Training History → History Screen
    ├── Training Goals → Goals Modal
    ├── Edit Profile → Edit Profile Screen
    ├── Notifications → Notification Settings
    └── Logout → Confirmation → Login Screen
```

### Loading States

- Skeleton loader for stats while fetching
- Shimmer effect for header during initial load
- Disabled state for actions during logout

### Error States

- "Failed to load stats" with retry button
- Network error banner with offline indicator
- Graceful fallbacks for missing data

---

## 💻 Implementation Guide

### Step 1: Create Base Screen Structure

```typescript
// src/app/(tabs)/profile.tsx
import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useAuthStore } from '@/store';
import { ProfileHeader, QuickActions, ProfileManagement, StatsWidget, LogoutButton } from '@/components/profile';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <ScrollView style={styles.container}>
      <ProfileHeader user={user} />
      <QuickActions />
      <ProfileManagement />
      <StatsWidget />
      <LogoutButton onLogout={logout} />
    </ScrollView>
  );
}
```

### Step 2: Implement Individual Components

Each component should be created as a separate file in `src/components/profile/`

### Step 3: Connect to Data Sources

- Fetch user stats on screen mount
- Subscribe to auth state changes
- Handle navigation actions

### Step 4: Add Analytics Tracking

Track user interactions:

- Screen views
- Button clicks
- Time spent on screen
- Navigation paths

---

## 🧪 Testing Requirements

### Unit Tests

- Component rendering tests
- Navigation action tests
- Data fetching tests
- Error handling tests

### Integration Tests

- Login → Profile flow
- Logout flow with confirmation
- Navigation to all linked screens
- Stats loading and display

### User Acceptance Criteria

- [ ] User can see their profile information
- [ ] All navigation buttons work correctly
- [ ] Stats load and display accurately
- [ ] Logout works with confirmation
- [ ] Screen is responsive and performs well
- [ ] Offline mode shows appropriate messages

---

## 📝 Implementation Checklist

### Phase 1: Core Structure

- [ ] Create profile.tsx screen file
- [ ] Set up basic layout structure
- [ ] Implement ProfileHeader component
- [ ] Connect to auth store

### Phase 2: Navigation Features

- [ ] Implement QuickActions component
- [ ] Add navigation to Training tab
- [ ] Add navigation to Progress screen
- [ ] Add navigation to History screen

### Phase 3: Profile Management

- [ ] Create ProfileManagement component
- [ ] Implement Goals modal
- [ ] Create Edit Profile screen
- [ ] Add Notification settings

### Phase 4: Stats & Data

- [ ] Create StatsWidget component
- [ ] Connect to Firestore for stats
- [ ] Add loading states
- [ ] Implement error handling

### Phase 5: Polish

- [ ] Add animations and transitions
- [ ] Implement pull-to-refresh
- [ ] Add skeleton loaders
- [ ] Optimize performance

---

## 🚀 Future Enhancements

### Version 2.0

- Profile picture upload functionality
- Social features (followers/following count)
- Achievement badges display
- Quick workout start from profile
- Training streak display
- Customizable quick actions

### Version 3.0

- Profile themes and customization
- Share profile functionality
- QR code for profile sharing
- Integration with wearables
- Export training data option

---

## 📱 Platform Considerations

### iOS

- Use native iOS navigation transitions
- Support for haptic feedback
- Face ID for quick login

### Android

- Material Design components
- Support for back button navigation
- Fingerprint authentication option

### Responsive Design

- Adapt layout for tablet screens
- Support for landscape orientation
- Accessibility features compliance

---

This documentation provides a complete blueprint for implementing the Profile Welcome Screen. Each component is clearly defined with its data requirements, UI specifications, and interaction patterns.
