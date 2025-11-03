# Frontend Patterns & Style Guide

This document outlines the established patterns and conventions used in the Guaumiau mobile app, based on the implementations in `MyPetsScreen` and `ProviderProfileScreen`.

## Table of Contents

1. [Component Structure](#component-structure)
2. [Styling Patterns](#styling-patterns)
3. [State Management](#state-management)
4. [Layout Patterns](#layout-patterns)
5. [UI Component Patterns](#ui-component-patterns)
6. [Icon Usage](#icon-usage)
7. [Error Handling](#error-handling)
8. [Code Examples](#code-examples)

---

## Component Structure

### File Organization

Every screen component follows this structure:

```
ScreenName/
├── index.tsx      # Main component logic
└── styles.ts      # StyleSheet definitions
```

### Component Template

```typescript
import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Icon1, Icon2 } from 'lucide-react-native';
import { Text } from '@/components/atoms/Text';
import { styles } from './styles';
import { theme } from '@/theme';

export function ScreenName() {
  // 1. Hooks (data fetching, navigation, etc.)
  const { data, isLoading, isError, error, refetch } = useCustomHook();

  // 2. Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="body" color="textSecondary" style={styles.centerText}>
          Loading...
        </Text>
      </View>
    );
  }

  // 3. Error state
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <AlertCircle size={48} color={theme.colors.error} />
        <Text variant="body" color="error" style={styles.centerText}>
          Error message
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text variant="body" style={styles.retryButtonText}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 4. Empty state (if applicable)
  if (!data || data.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="h2" style={styles.emptyTitle}>
          No data available
        </Text>
        <Text variant="body" color="textSecondary" style={styles.emptyText}>
          Description of empty state
        </Text>
      </View>
    );
  }

  // 5. Main content
  return (
    <View style={styles.container}>
      {/* Content */}
    </View>
  );
}
```

---

## Styling Patterns

### Color System

Always use theme colors instead of hardcoded values:

```typescript
// ✅ CORRECT
backgroundColor: theme.colors.primary
color: theme.colors.textSecondary

// ❌ INCORRECT
backgroundColor: '#f97316'
color: '#8E8E93'
```

**Theme Colors:**
- `primary`: `#f97316` (orange)
- `secondary`: `#fdba74` (light orange)
- `background`: `#fff7ed` (cream)
- `surface`: `#FFFFFF` (white)
- `text`: `#000000` (black)
- `textSecondary`: `#8E8E93` (gray)
- `border`: `#C7C7CC` (light gray)
- `error`: `#FF3B30` (red)
- `success`: `#34C759` (green)
- `warning`: `#FF9500` (yellow)
- `info`: `#5AC8FA` (blue)

### Spacing System

Use theme spacing for consistent margins and padding:

```typescript
// ✅ CORRECT
padding: theme.spacing.md
marginTop: theme.spacing.lg

// ❌ INCORRECT
padding: 16
marginTop: 24
```

**Spacing Scale:**
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

### Border Radius

```typescript
borderRadius: theme.borderRadius.sm  // 4px
borderRadius: theme.borderRadius.md  // 8px
borderRadius: theme.borderRadius.lg  // 16px
borderRadius: theme.borderRadius.full // 999px (circular)
```

### Typography

Use theme font sizes:

```typescript
fontSize: theme.fontSize.xs   // 10px
fontSize: theme.fontSize.sm   // 12px
fontSize: theme.fontSize.md   // 14px
fontSize: theme.fontSize.lg   // 16px
fontSize: theme.fontSize.xl   // 20px
fontSize: theme.fontSize.xxl  // 24px
fontSize: theme.fontSize.xxxl // 32px
```

### Shadows

Use theme shadows for elevation:

```typescript
...theme.shadows.sm  // Small shadow
...theme.shadows.md  // Medium shadow
...theme.shadows.lg  // Large shadow
```

---

## State Management

### Standard States

Every screen should handle these states:

1. **Loading State**: Show spinner with descriptive text
2. **Error State**: Show error icon, message, and retry button
3. **Empty State**: Show friendly message with action button
4. **Success State**: Display content

### Example Implementation

```typescript
const { data, isLoading, isError, error, refetch, isRefetching } = useCustomHook();

// Loading
if (isLoading) { /* ... */ }

// Error
if (isError) { /* ... */ }

// Empty
if (!data || data.length === 0) { /* ... */ }

// Success - render content
return <ScrollView>...</ScrollView>
```

---

## Layout Patterns

### Container Styles

```typescript
// Main container (full screen)
container: {
  flex: 1,
  backgroundColor: '#f9fafb', // Light gray background
}

// Centered content (loading, error, empty states)
centerContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: theme.spacing.xl,
}

// Header section
header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: theme.spacing.lg,
  paddingTop: theme.spacing.xl,
  paddingBottom: theme.spacing.md,
}
```

### Card Pattern

Cards are the primary content containers:

```typescript
card: {
  backgroundColor: theme.colors.surface,
  borderRadius: theme.borderRadius.lg,
  padding: theme.spacing.md,
  marginBottom: theme.spacing.md,
  ...theme.shadows.sm,
}
```

### Grid Layouts

For stat displays or quick info:

```typescript
statsGrid: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  gap: theme.spacing.md,
}

statBox: {
  flex: 1,
  alignItems: 'center',
  backgroundColor: theme.colors.surface,
  borderRadius: theme.borderRadius.lg,
  padding: theme.spacing.md,
  ...theme.shadows.sm,
}
```

---

## UI Component Patterns

### Badges

Used for status indicators, tags, and labels:

```typescript
// Badge container
badge: {
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: theme.borderRadius.full,
}

// Badge variants
badgeGreen: {
  backgroundColor: '#dcfce7', // Light green
}
badgeBlue: {
  backgroundColor: '#dbeafe', // Light blue
}
badgeRed: {
  backgroundColor: '#fee2e2', // Light red
}

// Badge text
badgeText: {
  fontSize: theme.fontSize.xs,
  fontWeight: '500',
}
badgeTextGreen: {
  color: '#16a34a', // Dark green
}
badgeTextBlue: {
  color: '#2563eb', // Dark blue
}
badgeTextRed: {
  color: '#dc2626', // Dark red
}
```

### Buttons

**Primary Button:**
```typescript
primaryButton: {
  backgroundColor: theme.colors.primary,
  paddingVertical: 14,
  paddingHorizontal: theme.spacing.xl,
  borderRadius: theme.borderRadius.lg,
  alignItems: 'center',
  justifyContent: 'center',
  ...theme.shadows.md,
}

primaryButtonText: {
  color: '#ffffff',
  fontWeight: '600',
  fontSize: 16,
}
```

**Secondary Button:**
```typescript
secondaryButton: {
  backgroundColor: '#ffffff',
  paddingVertical: 14,
  paddingHorizontal: theme.spacing.xl,
  borderRadius: theme.borderRadius.lg,
  borderWidth: 2,
  borderColor: theme.colors.primary,
  alignItems: 'center',
  justifyContent: 'center',
}

secondaryButtonText: {
  color: theme.colors.primary,
  fontWeight: '600',
  fontSize: 16,
}
```

**Icon Button:**
```typescript
iconButton: {
  padding: theme.spacing.sm,
  borderRadius: theme.borderRadius.full,
  backgroundColor: 'transparent',
}
```

### Floating Action Button (FAB)

```typescript
fab: {
  position: 'absolute',
  right: theme.spacing.lg,
  bottom: theme.spacing.lg,
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: theme.colors.primary,
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.shadows.lg,
}
```

---

## Icon Usage

### Import Pattern

Always import icons from `lucide-react-native`:

```typescript
import { Plus, Pencil, Star, CheckCircle } from 'lucide-react-native';
```

### Icon Sizing

- Small icons: `16px`
- Medium icons: `20-24px`
- Large icons: `32-48px`

### Icon Colors

```typescript
<Plus size={24} color={theme.colors.primary} />
<CheckCircle size={20} color={theme.colors.success} />
<AlertCircle size={48} color={theme.colors.error} />
```

---

## Error Handling

### Error State Pattern

```typescript
if (isError) {
  return (
    <View style={styles.centerContainer}>
      <AlertCircle size={48} color={theme.colors.error} />
      <Text variant="body" color="error" style={styles.centerText}>
        Error title
      </Text>
      <Text variant="caption" color="textSecondary" style={styles.errorMessage}>
        {error?.response?.data?.message || error?.message || 'Unknown error'}
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => refetch()}
        activeOpacity={0.7}
      >
        <Text variant="body" style={styles.retryButtonText}>
          Retry
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Retry Button Styles

```typescript
retryButton: {
  marginTop: theme.spacing.lg,
  paddingHorizontal: theme.spacing.xl,
  paddingVertical: theme.spacing.md,
  backgroundColor: theme.colors.primary,
  borderRadius: theme.borderRadius.md,
}

retryButtonText: {
  color: theme.colors.surface,
  fontWeight: '600',
}
```

---

## Code Examples

### Complete Screen Example (MyPetsScreen Pattern)

```typescript
import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Plus, Pencil } from 'lucide-react-native';
import { Text } from '@/components/atoms/Text';
import { styles } from './styles';
import { theme } from '@/theme';

export function ExampleScreen() {
  const { data: items, isLoading, isError, error, refetch } = useItems();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="body" color="textSecondary" style={styles.centerText}>
          Loading...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="body" color="error" style={styles.centerText}>
          Error loading data
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text variant="body" style={styles.retryButtonText}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h1" style={styles.headerTitle}>
          Screen Title
        </Text>
        <TouchableOpacity style={styles.headerAddButton} activeOpacity={0.7}>
          <Plus size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {items.map(item => (
            <View key={item.id} style={styles.card}>
              {/* Card content */}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Plus size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}
```

### Complete Styles Example

```typescript
import { StyleSheet } from 'react-native';
import { theme } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  centerText: {
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
});
```

---

## Best Practices Checklist

- [ ] Use theme colors, spacing, and typography
- [ ] Separate styles into dedicated `styles.ts` file
- [ ] Handle all states: loading, error, empty, success
- [ ] Use lucide-react-native icons
- [ ] Follow component structure pattern
- [ ] Use proper TypeScript typing
- [ ] Add proper spacing with theme values
- [ ] Use shadows from theme for elevation
- [ ] Make buttons touchable with proper activeOpacity
- [ ] Keep text accessible with proper contrast
- [ ] Use ScrollView for scrollable content
- [ ] Test on both iOS and Android

---

## Reference Implementations

- **MyPetsScreen**: [mobile/src/screens/MyPetsScreen/](../../src/screens/MyPetsScreen/)
- **ProviderProfileScreen**: [mobile/src/screens/ProviderProfileScreen/](../../src/screens/ProviderProfileScreen/)

---

**Last Updated**: 2025-11-02
