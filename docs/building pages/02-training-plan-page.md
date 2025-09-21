# Training Plans Screen - Complete Feature Documentation & Wireframes

## 📱 Screen Overview

**Screen Name:** Training Plans Management Screen  
**File Location:** `src/app/(tabs)/training/index.tsx`  
**Navigation Position:** Accessed from Profile → "Start Training"  
**Purpose:** Central hub for creating, managing, and tracking training plans

---

## 🎯 User Stories

As a climber using CruxClimb, I want to:

- View all my current active training plans
- Access the history of completed plans
- Create new training plans using AI, custom builder, or templates
- Track my progress on active plans
- Resume or modify existing plans
- Learn from my training history

---

## 🖼️ Wireframe Structure

### Tab: CREATE (Initial State - No Plans)

```
┌─────────────────────────────────┐
│     Training Plans Screen        │
├─────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │   🔶 Header (Orange)    │    │
│  │   Training Plans        │ ☰  │
│  │   Manage your climbing  │    │
│  │   training              │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │ Current | History |[Create]│  │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │  🤖 AI-Generated Plan   │    │
│  │  Create a personalized  │ >  │
│  │  plan using AI based    │    │
│  │  on your goals          │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │  ✏️ Custom Plan         │    │
│  │  Build your own         │ >  │
│  │  training plan from     │    │
│  │  scratch                │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │  📚 Template Library    │    │
│  │  Choose from pre-made   │ >  │
│  │  training templates     │    │
│  └─────────────────────────┘    │
│                                  │
└─────────────────────────────────┘
```

### Tab: CURRENT (With Active Plans)

```
┌─────────────────────────────────┐
│     Training Plans Screen        │
├─────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │   🔶 Header (Orange)    │    │
│  │   Training Plans        │ ☰  │
│  │   Manage your climbing  │    │
│  │   training              │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │[Current]| History | Create │  │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │  Plan: Climb           │    │
│  │  4 week plan           │    │
│  │  3 days/week          │    │
│  │  ████░░░░░░ 40%       │    │
│  │  Created 2 days ago   │    │
│  │  Type: Custom   [Active]│ >  │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │  Plan: Gym Training    │    │
│  │  4 week plan          │    │
│  │  3 days/week         │    │
│  │  ░░░░░░░░░░ 0%       │    │
│  │  Created 2 days ago  │    │
│  │  Type: Custom  [Active]│ >  │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │  Plan: Academy        │    │
│  │  4 week plan         │    │
│  │  3 days/week        │    │
│  │  ████████░░ 83%     │    │
│  │  Created 2 days ago │    │
│  │  Type: Custom [Active]│ >  │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

### Tab: HISTORY (Completed Plans)

```
┌─────────────────────────────────┐
│     Training Plans Screen        │
├─────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │   🔶 Header (Orange)    │    │
│  │   Training Plans        │ ☰  │
│  │   Manage your climbing  │    │
│  │   training              │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │ Current |[History]| Create │  │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │        ⏰                │    │
│  │                         │    │
│  │  No Training History   │    │
│  │                        │    │
│  │  Your completed        │    │
│  │  training plans will   │    │
│  │  appear here.         │    │
│  │                       │    │
│  └─────────────────────────┘    │
│                                  │
└─────────────────────────────────┘
```

---

## 🔧 Component Architecture

### 1. Screen Header Component

**Component:** `TrainingPlansHeader.tsx`

**Features:**

- Orange gradient background matching brand
- Clear title and subtitle
- Hamburger menu for navigation drawer
- Consistent with app-wide header design

**Props:**

```typescript
interface TrainingPlansHeaderProps {
  onMenuPress: () => void;
}
```

### 2. Tab Navigation Component

**Component:** `PlanTabs.tsx`

**Features:**

- Three tab options: Current, History, Create
- Active tab highlighting with brand color
- Smooth transition animations between tabs
- Badge indicator for number of active/completed plans

**State Management:**

```typescript
type TabType = 'current' | 'history' | 'create';

interface TabState {
  activeTab: TabType;
  currentPlansCount: number;
  historyPlansCount: number;
}
```

### 3. Create Tab Components

#### 3.1 AI-Generated Plan Card

**Component:** `AIGeneratedPlanCard.tsx`

**Features:**

- Prominent AI icon/illustration
- Clear value proposition text
- Tap to navigate to AI plan generation flow
- Animated gradient border for emphasis

**Navigation:**

```typescript
const handleAIPlan = () => {
  navigation.navigate('AIGeneratePlan', {
    userProfile: user.profile,
    preferences: user.trainingPreferences,
  });
};
```

#### 3.2 Custom Plan Card

**Component:** `CustomPlanCard.tsx`

**Features:**

- Pencil/edit icon representation
- Description of manual plan building
- Navigate to custom plan builder
- Clean, minimal design

**Navigation:**

```typescript
const handleCustomPlan = () => {
  navigation.navigate('CustomPlanBuilder', {
    template: 'blank',
  });
};
```

#### 3.3 Template Library Card

**Component:** `TemplateLibraryCard.tsx`

**Features:**

- Library/book icon
- Count of available templates
- Navigate to template selection screen
- Category preview badges

**Navigation:**

```typescript
const handleTemplateLibrary = () => {
  navigation.navigate('TemplateLibrary', {
    categories: ['beginner', 'intermediate', 'advanced'],
    equipment: user.availableEquipment,
  });
};
```

### 4. Current Tab Components

#### 4.1 Active Plan Card

**Component:** `ActivePlanCard.tsx`

**Features:**

- Plan name and duration display
- Training frequency (days/week)
- Visual progress bar with percentage
- Creation date and plan type badge
- Status indicator (Active/Paused)
- Tap to view plan details

**Data Structure:**

```typescript
interface ActivePlan {
  id: string;
  name: string;
  duration: number; // weeks
  daysPerWeek: number;
  progress: number; // percentage 0-100
  createdAt: Date;
  type: 'ai' | 'custom' | 'template';
  status: 'active' | 'paused' | 'scheduled';
  currentWeek: number;
  totalWeeks: number;
}
```

**Visual Design:**

- White card with subtle shadow
- Progress bar using brand orange (#FF6B35)
- Green "Active" badge for status
- Type badge in bottom corner (Custom/AI/Template)

### 5. History Tab Components

#### 5.1 Completed Plan Card

**Component:** `CompletedPlanCard.tsx`

**Features:**

- Plan name and completion date
- Final statistics (completion rate, total sessions)
- Achievement badges earned
- Option to view details or use as template

**Data Structure:**

```typescript
interface CompletedPlan {
  id: string;
  name: string;
  completedAt: Date;
  completionRate: number;
  totalSessions: number;
  totalDuration: number; // weeks
  achievements: Achievement[];
  type: 'ai' | 'custom' | 'template';
}
```

#### 5.2 Empty History State

**Component:** `EmptyHistoryState.tsx`

**Features:**

- Friendly empty state illustration
- Encouraging message
- Call-to-action to create first plan
- Clean, centered layout

---

## 📊 Data Management

### State Structure (Zustand)

```typescript
// src/store/slices/trainingPlans.slice.ts
interface TrainingPlansState {
  activePlans: ActivePlan[];
  completedPlans: CompletedPlan[];
  currentTab: TabType;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchActivePlans: () => Promise<void>;
  fetchCompletedPlans: () => Promise<void>;
  setCurrentTab: (tab: TabType) => void;
  createPlan: (plan: PlanInput) => Promise<void>;
  updatePlanProgress: (planId: string, progress: number) => void;
  archivePlan: (planId: string) => Promise<void>;
}
```

### Firebase Collections

```typescript
// Firestore structure
training_plans: {
  [userId]: {
    active_plans: ActivePlan[];
    completed_plans: CompletedPlan[];
    templates_used: string[];
    total_plans_created: number;
    preferences: {
      defaultDuration: number;
      preferredDaysPerWeek: number;
      favoriteExerciseTypes: string[];
    }
  }
}
```

---

## 🎨 Design Specifications

### Color Palette

```typescript
const trainingColors = {
  header: {
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
    text: '#FFFFFF',
  },
  tabs: {
    active: '#FF6B35',
    inactive: '#999999',
    background: '#F5F5F5',
  },
  cards: {
    background: '#FFFFFF',
    border: '#E5E5E5',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  status: {
    active: '#4CAF50',
    paused: '#FFC107',
    completed: '#2196F3',
  },
  progress: {
    filled: '#FF6B35',
    empty: '#E0E0E0',
  },
};
```

### Typography

```typescript
const typography = {
  header: {
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    subtitle: {
      fontSize: 14,
      fontWeight: 'normal',
      color: '#FFFFFF',
      opacity: 0.9,
    },
  },
  card: {
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1A1A1A',
    },
    subtitle: {
      fontSize: 14,
      fontWeight: 'normal',
      color: '#666666',
    },
    badge: {
      fontSize: 12,
      fontWeight: '500',
    },
  },
};
```

### Spacing & Layout

```typescript
const layout = {
  screen: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    minHeight: 100,
  },
  tab: {
    height: 48,
    borderRadius: 24,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
};
```

---

## 🔄 User Interactions & Flows

### Navigation Flow Diagram

```
Training Plans Screen
    │
    ├── CREATE Tab
    │   ├── AI-Generated Plan → AI Generation Flow
    │   ├── Custom Plan → Plan Builder Screen
    │   └── Template Library → Template Selection
    │
    ├── CURRENT Tab
    │   └── Plan Card → Plan Details Screen
    │       ├── View Sessions
    │       ├── Edit Plan
    │       ├── Pause/Resume
    │       └── Archive Plan
    │
    └── HISTORY Tab
        └── Completed Plan → Plan Summary
            ├── View Statistics
            ├── Use as Template
            └── Share Achievement
```

### Gesture Interactions

- **Swipe**: Horizontal swipe between tabs
- **Pull to Refresh**: Reload plans data
- **Long Press**: Quick actions menu on plan cards
- **Tap**: Navigate to details or actions

### Loading States

```typescript
const LoadingStates = {
  initial: 'Skeleton loaders for cards',
  refresh: 'Pull-to-refresh indicator',
  creating: 'Full screen loading with progress',
  deleting: 'Card fade out animation',
};
```

### Error States

```typescript
const ErrorStates = {
  network: 'No connection - showing cached data',
  empty: 'Friendly empty state with CTA',
  partial: 'Some plans loaded, error banner for failures',
  creation: 'Creation failed - retry option',
};
```

---

## 💻 Implementation Guide

### Phase 1: Screen Structure

```typescript
// src/app/(tabs)/training/index.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TrainingPlansHeader, PlanTabs, CreateTab, CurrentTab, HistoryTab } from '@/components/training';
import { useTrainingPlansStore } from '@/store/slices/trainingPlans.slice';

export default function TrainingPlansScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('current');
  const { activePlans, completedPlans, fetchPlans } = useTrainingPlansStore();

  useEffect(() => {
    fetchPlans();
  }, []);

  const renderTabContent = () => {
    switch(activeTab) {
      case 'create':
        return <CreateTab />;
      case 'current':
        return <CurrentTab plans={activePlans} />;
      case 'history':
        return <HistoryTab plans={completedPlans} />;
    }
  };

  return (
    <View style={styles.container}>
      <TrainingPlansHeader />
      <PlanTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentCount={activePlans.length}
        historyCount={completedPlans.length}
      />
      <ScrollView style={styles.content}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}
```

### Phase 2: Individual Tab Components

Create separate components for each tab to maintain clean separation of concerns.

### Phase 3: Data Integration

Connect to Firebase and implement real-time synchronization for plan updates.

### Phase 4: Animations & Polish

Add smooth transitions, loading states, and gesture handling for premium user experience.

---

## 🧪 Testing Requirements

### Unit Tests

- Tab switching logic
- Plan creation flow initiation
- Progress calculation accuracy
- Date formatting and display
- Error state handling

### Integration Tests

- Firebase data synchronization
- Navigation to all linked screens
- Plan state transitions (active → completed)
- Offline mode functionality
- Cache management

### E2E Tests

- Complete plan creation flow
- Plan progress tracking over time
- History archival process
- Template selection and application

---

## 📝 Implementation Checklist

### Core Features

- [ ] Screen layout and header
- [ ] Tab navigation implementation
- [ ] Create tab with three options
- [ ] Current plans display
- [ ] History view
- [ ] Empty states for all tabs
- [ ] Navigation to sub-screens

### Data Management

- [ ] Zustand store setup
- [ ] Firebase integration
- [ ] Offline caching
- [ ] Data synchronization
- [ ] Progress tracking

### UI Polish

- [ ] Loading animations
- [ ] Tab transition effects
- [ ] Card interactions
- [ ] Pull to refresh
- [ ] Error handling UI

### Advanced Features

- [ ] Plan templates
- [ ] Quick actions menu
- [ ] Batch operations
- [ ] Export functionality
- [ ] Sharing capabilities

---

## 🚀 Future Enhancements

### Version 2.0

- Plan comparison view
- Calendar integration
- Progress predictions
- Social sharing of plans
- Plan recommendations based on history

### Version 3.0

- AI coaching insights
- Video exercise demonstrations
- Community plan marketplace
- Advanced analytics dashboard
- Integration with wearables

---

## 📱 Platform Considerations

### iOS Specific

- Native iOS transitions
- 3D Touch for quick actions
- Haptic feedback on interactions
- iOS share sheet integration

### Android Specific

- Material Design components
- Back button handling
- Android sharing options
- Material You theming support

### Performance Optimizations

- Lazy loading of plan details
- Image caching for plan thumbnails
- Virtualized list for large histories
- Background data prefetching

---

This documentation provides the complete blueprint for implementing the Training Plans screen. The three-tab structure gives users clear pathways to create new plans, manage active ones, and review their training history.
