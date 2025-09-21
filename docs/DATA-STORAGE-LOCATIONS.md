# 📍 Where Your Data is Stored in CruxClimb

## 🔄 **Two Storage Systems Working Together**

Your app uses **both** local and cloud storage for different purposes:

```
┌─────────────────────┐    ┌─────────────────────┐
│   LOCAL STORAGE     │    │   FIREBASE CLOUD    │
│   (AsyncStorage)    │    │   (Firestore)       │
├─────────────────────┤    ├─────────────────────┤
│ • App state         │    │ • User profiles     │
│ • UI preferences    │    │ • Onboarding data   │
│ • Temporary data    │    │ • Posts/content     │
│ • Offline cache     │    │ • Training sessions │
│ • Theme settings    │    │ • Shared data       │
└─────────────────────┘    └─────────────────────┘
```

---

## 📱 **LOCAL STORAGE (Your Device)**

### **Where:** 
- **iOS:** `/var/mobile/Containers/Data/Application/[APP_ID]/Documents/`
- **Android:** `/data/data/com.yourapp.package/files/`
- **Expo Dev:** Simulator's AsyncStorage

### **What's Stored Locally:**
```typescript
// Zustand Store with AsyncStorage persistence
{
  name: 'cruxclimb-storage',
  auth: { ... },           // Login state
  ui: { ... },            // UI preferences  
  workout: { ... },       // Current workout
  theme: { ... },         // Dark/light mode
  onboarding: { ... },    // Onboarding progress
  trainingPlan: { ... }   // AI training plan state
}
```

### **How to View Local Data:**

#### **During Development:**
```bash
# React Native Debugger Console
AsyncStorage.getAllKeys().then(keys => {
  return AsyncStorage.multiGet(keys);
}).then(stores => {
  stores.map((result, i, store) => {
    console.log({ [store[i][0]]: store[i][1] });
  });
});
```

#### **In Simulator:**
- **iOS Simulator:** Device → Settings → Developer → Reset Content and Settings
- **Android Emulator:** Settings → Apps → Your App → Storage → Clear Data

---

## ☁️ **FIREBASE CLOUD STORAGE (Google's Servers)**

### **Where:**
Your Firebase project in Google's data centers (US, Europe, Asia)

### **How to Access Firebase Console:**

1. **Go to:** https://console.firebase.google.com/
2. **Select your project** (check your `.env` file for `EXPO_PUBLIC_FIREBASE_PROJECT_ID`)
3. **Click "Firestore Database"** in left sidebar

### **Your Firebase Collections Structure:**

```
🔥 your-project-name.firebaseapp.com
├── 📁 users/
│   ├── 📄 user123abc/
│   │   ├── userId: "user123abc"
│   │   ├── email: "user@example.com"
│   │   ├── experience: "intermediate"
│   │   ├── currentGrade: { boulder: "V4", french: "6b" }
│   │   ├── goals: ["strength", "technique"]
│   │   ├── equipment: [...]
│   │   ├── trainingAvailability: { daysPerWeek: 3, hoursPerSession: 1.5 }
│   │   ├── injuries: []
│   │   ├── preferredStyle: "boulder"
│   │   ├── completed: true
│   │   ├── createdAt: [timestamp]
│   │   └── updatedAt: [timestamp]
│   └── 📄 user456def/
├── 📁 training_plans/
│   ├── 📄 plan123abc/
│   │   ├── id: "plan123abc"
│   │   ├── userId: "user123abc"
│   │   ├── name: "12-Week Strength Building"
│   │   ├── description: "Comprehensive strength training plan"
│   │   ├── duration: 12 (weeks)
│   │   ├── daysPerWeek: 4
│   │   ├── goals: ["Strength Building", "Muscle Gain"]
│   │   ├── targetLevel: "intermediate"
│   │   ├── equipment: ["Gym Access", "Dumbbells", "Barbell"]
│   │   ├── difficulty: "intermediate"
│   │   ├── status: "active" | "draft" | "completed" | "paused"
│   │   ├── isTemplate: false
│   │   ├── tags: ["strength", "muscle-building"]
│   │   ├── trainingDays: [
│   │   │   {
│   │   │     day: "monday",
│   │   │     name: "Monday",
│   │   │     exercises: [
│   │   │       {
│   │   │         exerciseId: "ex123",
│   │   │         exercise: { ... },
│   │   │         sets: 3,
│   │   │         reps: "8-12",
│   │   │         rest: 60,
│   │   │         rpe: 7,
│   │   │         weight: "20kg",
│   │   │         notes: "Focus on form"
│   │   │       }
│   │   │     ],
│   │   │     isRestDay: false,
│   │   │     notes: ""
│   │   │   }
│   │   │ ],
│   │   ├── startDate: [timestamp] (when activated)
│   │   ├── endDate: [timestamp] (when completed)
│   │   ├── createdAt: [timestamp]
│   │   └── updatedAt: [timestamp]
│   └── 📄 plan456def/
├── 📁 custom_exercises/
│   ├── 📄 exercise001/
│   │   ├── id: "exercise001"
│   │   ├── userId: "user123abc"
│   │   ├── name: "Modified Push-up"
│   │   ├── description: "Push-up with elevated feet"
│   │   ├── equipment: ["Yoga Mat", "Bench"]
│   │   ├── muscleGroups: ["Chest", "Triceps", "Core"]
│   │   ├── measurementType: "reps"
│   │   ├── defaultSets: 3
│   │   ├── defaultReps: "10-15"
│   │   ├── defaultRest: 60
│   │   ├── difficulty: "intermediate"
│   │   ├── isCustom: true
│   │   ├── notes: "Focus on controlled movement"
│   │   ├── createdAt: [timestamp]
│   │   └── updatedAt: [timestamp]
│   └── 📄 exercise002/
├── 📁 workout_templates/
│   ├── 📄 template001/
│   │   ├── name: "Fingerboard Power"
│   │   ├── category: "fingerboard"
│   │   ├── difficulty: "intermediate"
│   │   ├── equipment: ["fingerboard"]
│   │   ├── exercises: [...]
│   │   ├── isAIAdaptable: true
│   │   ├── public: true
│   │   └── rating: 4.5
│   └── 📄 template002/
├── 📁 workout_sessions/
│   ├── 📄 session001/
│   │   ├── userId: "user123abc"
│   │   ├── planId: "plan123abc"
│   │   ├── weekNumber: 2
│   │   ├── workoutId: "workout123"
│   │   ├── startedAt: [timestamp]
│   │   ├── completedAt: [timestamp]
│   │   ├── duration: 45
│   │   ├── exercises: [...]
│   │   ├── rpe: 7
│   │   ├── quality: 4
│   │   └── notes: "Felt strong today"
│   └── 📄 session002/
├── 📁 posts/
│   ├── 📄 post001xyz/
│   │   ├── userId: "user123abc"
│   │   ├── title: "My First V5!"
│   │   ├── content: "Finally sent my project..."
│   │   ├── type: "achievement"
│   │   ├── tags: ["bouldering", "v5"]
│   │   ├── likes: ["user456def", "user789ghi"]
│   │   ├── comments: [...]
│   │   └── createdAt: [timestamp]
│   └── 📄 post002abc/
└── 📁 trainingSessions/ (legacy)
    ├── 📄 session001/
    └── 📄 session002/
```

---

## 🔍 **How to View Your Firebase Data**

### **Method 1: Firebase Console (Recommended)**

1. **Open:** https://console.firebase.google.com/
2. **Find your project** using your project ID from `.env`
3. **Navigate:** Project → Firestore Database
4. **Browse collections:** Click on `users`, `posts`, etc.

### **Method 2: In Your App (Development)**

Add this to any component for debugging:
```typescript
import { FirestoreService } from '@/lib/firebase/firestore';

// Get user's data
const userData = await FirestoreService.getUserProfile();
console.log('User data in Firebase:', userData);

// Test connection
const connected = await FirestoreService.testConnection();
console.log('Firebase connected:', connected);
```

### **Method 3: Firebase CLI**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# List your projects
firebase projects:list

# Set active project
firebase use your-project-id

# Access Firestore
firebase firestore:get users/user123abc
```

---

## 📊 **Data Flow Examples**

### **Onboarding Data Flow:**
```
1. User fills onboarding form
   ↓
2. Data saved to Zustand (local state)
   ↓  
3. Data persisted to AsyncStorage (device)
   ↓
4. On "Complete" button:
   ↓
5. Data sent to Firebase (cloud)
   ↓
6. Stored in users/{userId} document
```

### **Posts Data Flow:**
```
1. User creates post
   ↓
2. PostsService.createPost() called
   ↓
3. Data sent to Firebase posts collection
   ↓
4. Document created with auto-generated ID
   ↓
5. UI updated with new post
```

---

## 🔧 **How to Check If Data is Being Saved**

### **Local Storage Check:**
```typescript
// In any component
import AsyncStorage from '@react-native-async-storage/async-storage';

const checkLocalData = async () => {
  const data = await AsyncStorage.getItem('cruxclimb-storage');
  console.log('Local data:', JSON.parse(data || '{}'));
};
```

### **Firebase Check:**
```typescript
// In any component  
import { FirestoreService } from '@/lib/firebase/firestore';

const checkFirebaseData = async () => {
  try {
    const profile = await FirestoreService.getUserProfile();
    console.log('Firebase data:', profile);
  } catch (error) {
    console.log('Firebase error:', error);
  }
};
```

---

## 🎯 **Practical Example: Finding Your Onboarding Data**

### **Step 1: Get Your User ID**
```typescript
import { AuthService } from '@/lib/firebase/auth';

const user = AuthService.getCurrentUser();
console.log('User ID:', user?.uid); // Copy this ID
```

### **Step 2: Find in Firebase Console**
1. Go to https://console.firebase.google.com/
2. Select your project
3. Click "Firestore Database"
4. Navigate to: `users` → `[your-user-id]`
5. You'll see all your onboarding data there!

### **Step 3: View the Document**
You'll see something like:
```json
{
  "userId": "abc123def456",
  "email": "your@email.com",
  "experience": "intermediate",
  "currentGrade": {
    "boulder": "V4",
    "french": "6b"
  },
  "goals": ["strength", "endurance"],
  "equipment": [...],
  "completed": true,
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

---

## 🚨 **Important Notes**

### **Local vs Cloud Data:**
- **Local (AsyncStorage):** Instant access, works offline, lost if app deleted
- **Cloud (Firebase):** Synced across devices, persists forever, requires internet

### **When Data Gets Saved:**
- **Local:** Immediately when state changes
- **Firebase:** When you call service methods (like `completeOnboarding()`)

### **Data Persistence:**
- **Local:** Until app is deleted or storage cleared
- **Firebase:** Forever (until manually deleted)

---

## 🔍 **Quick Debug Commands**

### **Check Your Firebase Project:**
```bash
# Your project ID (from .env)
echo $EXPO_PUBLIC_FIREBASE_PROJECT_ID

# Your Firebase console URL
echo "https://console.firebase.google.com/project/$EXPO_PUBLIC_FIREBASE_PROJECT_ID/firestore"
```

### **View Local Storage:**
```javascript
// In React Native Debugger console
Object.keys(localStorage).forEach(key => {
  if (key.includes('crux')) {
    console.log(key, localStorage.getItem(key));
  }
});
```

**Your onboarding data is saved in both places:**
1. **Locally** for instant access and offline use
2. **Firebase Cloud** for backup and cross-device sync

Check the Firebase Console to see your data live! 🔥