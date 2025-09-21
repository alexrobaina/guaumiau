# 🔥 Firebase Guide: How It Works & Creating Services

## 📚 Table of Contents
1. [Firebase Architecture Overview](#firebase-architecture-overview)
2. [How Firestore Works](#how-firestore-works)
3. [Creating Services](#creating-services)
4. [CRUD Operations](#crud-operations)
5. [Real Examples](#real-examples)
6. [Best Practices](#best-practices)

---

## 🏗️ Firebase Architecture Overview

Firebase is a **Backend-as-a-Service (BaaS)** platform that provides:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Native │────│   Firebase SDK   │────│  Firebase Cloud │
│      App        │    │    (Client)      │    │   (Servers)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### **Core Firebase Services:**
- **🔐 Authentication** - User management, login/logout
- **📊 Firestore** - NoSQL document database
- **💾 Storage** - File uploads (images, videos)
- **☁️ Cloud Functions** - Server-side code
- **📱 Push Notifications** - FCM messaging
- **📈 Analytics** - App usage tracking

---

## 🗄️ How Firestore Works

Firestore is a **NoSQL document database** with this structure:

```
Database
├── Collection: "users"
│   ├── Document: "user123"
│   │   ├── Field: name: "John"
│   │   ├── Field: email: "john@example.com"
│   │   └── Sub-collection: "posts"
│   └── Document: "user456"
├── Collection: "posts"
│   ├── Document: "post001"
│   └── Document: "post002"
└── Collection: "trainingSessions"
```

### **Key Concepts:**
1. **Collections** = Tables (like "users", "posts")
2. **Documents** = Records (like a specific user or post)
3. **Fields** = Columns (like name, email, createdAt)
4. **Sub-collections** = Nested data within documents

---

## 🛠️ Creating Services

### **Service Structure Pattern:**
```typescript
export class YourService {
  private static readonly COLLECTION_NAME = 'collectionName';
  
  // CREATE
  static async create(data: CreateData): Promise<string> { }
  
  // READ
  static async getById(id: string): Promise<Item | null> { }
  static async getMany(filters: Filters): Promise<Item[]> { }
  
  // UPDATE
  static async update(id: string, updates: UpdateData): Promise<void> { }
  
  // DELETE
  static async delete(id: string): Promise<void> { }
}
```

### **Example: Posts Service**
The `PostsService` I created demonstrates a complete CRUD service:

```typescript
// Create a new post
const postId = await PostsService.createPost({
  title: "My Climbing Achievement",
  content: "Just sent my first V5!",
  type: "achievement",
  tags: ["bouldering", "v5"],
  isPublic: true
});

// Get posts with filters
const { posts } = await PostsService.getPosts({
  type: "achievement",
  limitCount: 10
});

// Update a post
await PostsService.updatePost(postId, {
  title: "Updated Title"
});

// Delete a post
await PostsService.deletePost(postId);
```

---

## 🔄 CRUD Operations Explained

### **1. CREATE (Add Data)**
```typescript
// Add a document with auto-generated ID
const docRef = await addDoc(collection(firestore, 'posts'), {
  title: 'My Post',
  createdAt: serverTimestamp()
});

// Add a document with custom ID
await setDoc(doc(firestore, 'users', userId), {
  name: 'John Doe',
  email: 'john@example.com'
});
```

### **2. READ (Get Data)**
```typescript
// Get single document
const docSnap = await getDoc(doc(firestore, 'posts', postId));
if (docSnap.exists()) {
  const data = docSnap.data();
}

// Get multiple documents with query
const q = query(
  collection(firestore, 'posts'),
  where('userId', '==', currentUserId),
  orderBy('createdAt', 'desc'),
  limit(10)
);
const querySnapshot = await getDocs(q);
```

### **3. UPDATE (Modify Data)**
```typescript
// Update specific fields
await updateDoc(doc(firestore, 'posts', postId), {
  title: 'Updated Title',
  updatedAt: serverTimestamp()
});

// Replace entire document
await setDoc(doc(firestore, 'posts', postId), {
  // New complete document
}, { merge: false });
```

### **4. DELETE (Remove Data)**
```typescript
// Delete document
await deleteDoc(doc(firestore, 'posts', postId));
```

---

## 💡 Real Examples

### **Example 1: Training Sessions Service**
```typescript
export class TrainingService {
  static async createSession(data: {
    exercises: Exercise[];
    duration: number;
    notes?: string;
  }): Promise<string> {
    const user = AuthService.getCurrentUser();
    const session = {
      ...data,
      userId: user.uid,
      date: serverTimestamp(),
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(
      collection(firestore, 'trainingSessions'), 
      session
    );
    return docRef.id;
  }

  static async getUserSessions(userId: string): Promise<TrainingSession[]> {
    const q = query(
      collection(firestore, 'trainingSessions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}
```

### **Example 2: Route Reviews Service**
```typescript
export class RouteService {
  static async createRouteReview(data: {
    routeName: string;
    grade: string;
    location: string;
    rating: number;
    review: string;
  }): Promise<string> {
    // Implementation similar to PostsService
  }

  static async getRoutesByLocation(location: string): Promise<Route[]> {
    const q = query(
      collection(firestore, 'routes'),
      where('location', '==', location),
      where('isPublic', '==', true)
    );
    // ... rest of implementation
  }
}
```

---

## ✨ Advanced Features

### **Real-time Listeners**
```typescript
// Listen to changes in real-time
const unsubscribe = onSnapshot(
  doc(firestore, 'posts', postId),
  (doc) => {
    if (doc.exists()) {
      console.log('Post updated:', doc.data());
    }
  }
);

// Don't forget to unsubscribe
unsubscribe();
```

### **Batch Operations**
```typescript
const batch = writeBatch(firestore);

batch.set(doc(firestore, 'posts', 'post1'), { title: 'Post 1' });
batch.update(doc(firestore, 'posts', 'post2'), { likes: 10 });
batch.delete(doc(firestore, 'posts', 'post3'));

await batch.commit();
```

### **Transactions**
```typescript
await runTransaction(firestore, async (transaction) => {
  const postDoc = await transaction.get(doc(firestore, 'posts', postId));
  const newLikes = postDoc.data()?.likes + 1;
  
  transaction.update(doc(firestore, 'posts', postId), {
    likes: newLikes
  });
});
```

---

## 🎯 Best Practices

### **1. Security Rules**
Always set up Firestore security rules:
```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public posts can be read by anyone, written by owner
    match /posts/{postId} {
      allow read: if resource.data.isPublic == true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### **2. Data Structure Best Practices**
```typescript
// ✅ Good - Flat structure
{
  userId: "user123",
  title: "My Post",
  tags: ["climbing", "tips"],
  createdAt: timestamp
}

// ❌ Avoid - Deeply nested
{
  user: {
    profile: {
      personal: {
        details: { ... }
      }
    }
  }
}
```

### **3. Error Handling**
```typescript
try {
  await PostsService.createPost(data);
} catch (error) {
  if (error.code === 'permission-denied') {
    showError('You need to log in to create a post');
  } else {
    showError('Failed to create post. Please try again.');
  }
}
```

### **4. Optimize Queries**
```typescript
// ✅ Good - Use composite indexes
const q = query(
  collection(firestore, 'posts'),
  where('userId', '==', userId),
  where('isPublic', '==', true),
  orderBy('createdAt', 'desc')
);

// ✅ Good - Limit results
const q = query(
  collection(firestore, 'posts'),
  limit(20)
);
```

---

## 🚀 How to Use the PostsService

### **1. Create a Post**
```typescript
import { PostsService } from '@/lib/firebase/posts.service';

const createPost = async () => {
  try {
    const postId = await PostsService.createPost({
      title: "First Boulder Problem",
      content: "Just completed my first V3!",
      type: "achievement",
      tags: ["bouldering", "beginner", "v3"],
      isPublic: true
    });
    console.log('Post created:', postId);
  } catch (error) {
    console.error('Failed to create post:', error);
  }
};
```

### **2. Get Posts Feed**
```typescript
const loadPosts = async () => {
  try {
    const { posts } = await PostsService.getPosts({
      type: "training-tip",
      limitCount: 10
    });
    setPosts(posts);
  } catch (error) {
    console.error('Failed to load posts:', error);
  }
};
```

### **3. Like a Post**
```typescript
const handleLike = async (postId: string) => {
  try {
    await PostsService.toggleLike(postId);
    // Refresh posts or update UI
  } catch (error) {
    console.error('Failed to like post:', error);
  }
};
```

---

## 📊 Collection Structure for CruxClimb

```
cruxclimb-firebase/
├── users/
│   └── {userId}/
│       ├── profile data (from onboarding)
│       └── settings
├── posts/
│   └── {postId}/
│       ├── content, likes, comments
│       └── metadata
├── trainingSessions/
│   └── {sessionId}/
│       ├── exercises, duration
│       └── user progress
├── routes/
│   └── {routeId}/
│       ├── name, grade, location
│       └── reviews and ratings
└── achievements/
    └── {achievementId}/
        ├── user milestones
        └── badges earned
```

This structure allows for:
- **Scalability** - Each collection can grow independently
- **Security** - Granular permissions per collection
- **Performance** - Efficient queries and indexes
- **Flexibility** - Easy to add new features

---

**🎉 That's how Firebase works!** You create services that handle specific data types (posts, users, training sessions) and use Firestore's powerful querying to build features like feeds, search, and real-time updates.