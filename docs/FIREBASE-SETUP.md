# 🔥 Firebase Setup Guide

## 🗄️ **Firestore Database Setup**

Since you mentioned adding a database in Firebase, here are the steps to ensure everything works:

### **1. Create Firestore Database**
1. Go to https://console.firebase.google.com/project/cruxclimb-a2431
2. Click "Firestore Database" in the left sidebar
3. Click "Create database"
4. Choose **"Start in test mode"** (for now)
5. Select a location (us-central1 recommended)

### **2. Set Up Security Rules**
In the Firebase Console → Firestore Database → Rules tab, use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users for their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write posts
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || request.auth.uid == resource.data.userId);
    }
    
    // Allow authenticated users to read/write their training sessions
    match /trainingSessions/{sessionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Allow connection tests (for debugging)
    match /test/{document} {
      allow read: if true;
    }
  }
}
```

### **3. Enable Authentication**
1. Go to Authentication → Sign-in method
2. Enable **Email/Password**
3. Enable **Google** (if using Google Sign-in)

### **4. Test the Connection**
Add this to any component for debugging:
```typescript
import { FirestoreService } from '@/lib/firebase/firestore';

const testConnection = async () => {
  try {
    const connected = await FirestoreService.testConnection();
    console.log('Firestore connected:', connected);
  } catch (error) {
    console.error('Connection test failed:', error);
  }
};
```

---

## 🔧 **Common Issues & Fixes**

### **Issue 1: "User must be authenticated"**
**Cause:** Trying to save to Firestore before user is logged in  
**Fix:** Already implemented! The app now saves locally first, then syncs to Firebase when authenticated.

### **Issue 2: "Permission denied"**
**Cause:** Firestore security rules not allowing access  
**Fix:** Update rules in Firebase Console (see above)

### **Issue 3: "Auth state lost after login"**
**Cause:** Firebase Auth not persisting properly  
**Fix:** Already implemented! Updated auth config with AsyncStorage persistence.

---

## 📊 **Your Current Firebase Project**

- **Project ID:** `cruxclimb-a2431`
- **Console:** https://console.firebase.google.com/project/cruxclimb-a2431
- **Firestore:** https://console.firebase.google.com/project/cruxclimb-a2431/firestore

---

## 🎯 **Next Steps**

1. **Set up Firestore rules** (copy rules above)
2. **Test authentication** (login → should stay logged in)
3. **Test onboarding** (complete onboarding → should save to Firebase after login)
4. **Check Firebase Console** to see your data appear

---

## 🔍 **Debug Commands**

### Check if Firebase is configured:
```typescript
import { isFirebaseConfigured } from '@/lib/firebase/config';
console.log('Firebase configured:', isFirebaseConfigured());
```

### Check authentication state:
```typescript
import { AuthService } from '@/lib/firebase/auth';
const user = AuthService.getCurrentUser();
console.log('Current user:', user);
```

### Test Firestore connection:
```typescript
import { FirestoreService } from '@/lib/firebase/firestore';
const testResult = await FirestoreService.testConnection();
console.log('Firestore test:', testResult);
```

The authentication fixes should resolve the "user gets lost" issue! 🚀