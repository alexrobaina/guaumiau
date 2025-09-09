import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  FirestoreError,
} from 'firebase/firestore';
import { firestore } from './config';
import { AuthService } from './auth';

// 📝 Post/Content Types
export interface Post {
  id?: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  title: string;
  content: string;
  type: 'training-tip' | 'route-review' | 'achievement' | 'question' | 'general';
  tags: string[];
  imageUrls?: string[];
  likes: string[]; // Array of user IDs who liked
  comments: Comment[];
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Comment {
  id?: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  content: string;
  likes: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreatePostData {
  title: string;
  content: string;
  type: Post['type'];
  tags?: string[];
  imageUrls?: string[];
  isPublic?: boolean;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  type?: Post['type'];
  tags?: string[];
  imageUrls?: string[];
  isPublic?: boolean;
}

// 🛠️ Posts Service Class
export class PostsService {
  private static readonly COLLECTION_NAME = 'posts';

  // ✨ CREATE - Add new post
  static async createPost(postData: CreatePostData): Promise<string> {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        throw new Error('Must be authenticated to create a post');
      }

      const now = serverTimestamp() as Timestamp;
      const post: Omit<Post, 'id'> = {
        ...postData,
        userId: user.uid,
        userDisplayName: user.displayName || 'Anonymous User',
        userPhotoURL: user.photoURL || undefined,
        tags: postData.tags || [],
        likes: [],
        comments: [],
        isPublic: postData.isPublic ?? true,
        createdAt: now,
        updatedAt: now,
      };

      const postsCollection = collection(firestore, this.COLLECTION_NAME);
      const docRef = await addDoc(postsCollection, post);

      console.log('✅ Post created successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating post:', error);
      throw new Error(`Failed to create post: ${(error as Error).message}`);
    }
  }

  // 📖 READ - Get single post by ID
  static async getPost(postId: string): Promise<Post | null> {
    try {
      const docRef = doc(firestore, this.COLLECTION_NAME, postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Omit<Post, 'id'>;
        return { id: docSnap.id, ...data };
      } else {
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting post:', error);
      throw new Error(`Failed to get post: ${(error as Error).message}`);
    }
  }

  // 📚 READ - Get multiple posts with filters
  static async getPosts(options: {
    userId?: string;
    type?: Post['type'];
    tag?: string;
    isPublic?: boolean;
    limitCount?: number;
    lastDocument?: QueryDocumentSnapshot;
  } = {}): Promise<{ posts: Post[]; lastDoc: QueryDocumentSnapshot | null }> {
    try {
      const postsCollection = collection(firestore, this.COLLECTION_NAME);
      
      // Build query with filters
      let q = query(postsCollection);

      // Add filters
      if (options.userId) {
        q = query(q, where('userId', '==', options.userId));
      }
      if (options.type) {
        q = query(q, where('type', '==', options.type));
      }
      if (options.tag) {
        q = query(q, where('tags', 'array-contains', options.tag));
      }
      if (options.isPublic !== undefined) {
        q = query(q, where('isPublic', '==', options.isPublic));
      }

      // Order by creation date (newest first)
      q = query(q, orderBy('createdAt', 'desc'));

      // Add pagination
      if (options.lastDocument) {
        q = query(q, startAfter(options.lastDocument));
      }
      if (options.limitCount) {
        q = query(q, limit(options.limitCount));
      }

      const querySnapshot = await getDocs(q);
      const posts: Post[] = [];
      let lastDoc: QueryDocumentSnapshot | null = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Post, 'id'>;
        posts.push({ id: doc.id, ...data });
        lastDoc = doc;
      });

      console.log(`✅ Retrieved ${posts.length} posts`);
      return { posts, lastDoc };
    } catch (error) {
      console.error('❌ Error getting posts:', error);
      throw new Error(`Failed to get posts: ${(error as Error).message}`);
    }
  }

  // 🔄 UPDATE - Update existing post
  static async updatePost(postId: string, updates: UpdatePostData): Promise<void> {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        throw new Error('Must be authenticated to update a post');
      }

      // Verify user owns the post
      const post = await this.getPost(postId);
      if (!post) {
        throw new Error('Post not found');
      }
      if (post.userId !== user.uid) {
        throw new Error('You can only update your own posts');
      }

      const docRef = doc(firestore, this.COLLECTION_NAME, postId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      console.log('✅ Post updated successfully:', postId);
    } catch (error) {
      console.error('❌ Error updating post:', error);
      throw new Error(`Failed to update post: ${(error as Error).message}`);
    }
  }

  // 🗑️ DELETE - Delete post
  static async deletePost(postId: string): Promise<void> {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        throw new Error('Must be authenticated to delete a post');
      }

      // Verify user owns the post
      const post = await this.getPost(postId);
      if (!post) {
        throw new Error('Post not found');
      }
      if (post.userId !== user.uid) {
        throw new Error('You can only delete your own posts');
      }

      const docRef = doc(firestore, this.COLLECTION_NAME, postId);
      await deleteDoc(docRef);

      console.log('✅ Post deleted successfully:', postId);
    } catch (error) {
      console.error('❌ Error deleting post:', error);
      throw new Error(`Failed to delete post: ${(error as Error).message}`);
    }
  }

  // 👍 INTERACTION - Like/Unlike post
  static async toggleLike(postId: string): Promise<void> {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        throw new Error('Must be authenticated to like a post');
      }

      const post = await this.getPost(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      const docRef = doc(firestore, this.COLLECTION_NAME, postId);
      const userLiked = post.likes.includes(user.uid);

      let updatedLikes: string[];
      if (userLiked) {
        // Remove like
        updatedLikes = post.likes.filter(userId => userId !== user.uid);
      } else {
        // Add like
        updatedLikes = [...post.likes, user.uid];
      }

      await updateDoc(docRef, {
        likes: updatedLikes,
        updatedAt: serverTimestamp(),
      });

      console.log(`✅ Post ${userLiked ? 'unliked' : 'liked'} successfully:`, postId);
    } catch (error) {
      console.error('❌ Error toggling like:', error);
      throw new Error(`Failed to toggle like: ${(error as Error).message}`);
    }
  }

  // 💬 INTERACTION - Add comment
  static async addComment(postId: string, content: string): Promise<void> {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        throw new Error('Must be authenticated to comment');
      }

      const post = await this.getPost(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      const now = serverTimestamp() as Timestamp;
      const newComment: Comment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.uid,
        userDisplayName: user.displayName || 'Anonymous User',
        userPhotoURL: user.photoURL || undefined,
        content,
        likes: [],
        createdAt: now,
        updatedAt: now,
      };

      const docRef = doc(firestore, this.COLLECTION_NAME, postId);
      await updateDoc(docRef, {
        comments: [...post.comments, newComment],
        updatedAt: serverTimestamp(),
      });

      console.log('✅ Comment added successfully to post:', postId);
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      throw new Error(`Failed to add comment: ${(error as Error).message}`);
    }
  }

  // 🔍 SEARCH - Search posts by content
  static async searchPosts(searchTerm: string, options: {
    type?: Post['type'];
    limitCount?: number;
  } = {}): Promise<Post[]> {
    try {
      // Note: Firestore doesn't have full-text search built-in
      // For production, you'd use Algolia, Elasticsearch, or Firebase Extensions
      // This is a basic implementation using array-contains for tags
      
      const postsCollection = collection(firestore, this.COLLECTION_NAME);
      let q = query(
        postsCollection,
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc')
      );

      if (options.type) {
        q = query(q, where('type', '==', options.type));
      }
      if (options.limitCount) {
        q = query(q, limit(options.limitCount));
      }

      const querySnapshot = await getDocs(q);
      const posts: Post[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Post, 'id'>;
        const post = { id: doc.id, ...data };
        
        // Client-side filtering (not ideal for production)
        const searchLower = searchTerm.toLowerCase();
        if (
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchLower))
        ) {
          posts.push(post);
        }
      });

      console.log(`✅ Found ${posts.length} posts matching "${searchTerm}"`);
      return posts;
    } catch (error) {
      console.error('❌ Error searching posts:', error);
      throw new Error(`Failed to search posts: ${(error as Error).message}`);
    }
  }

  // 📊 ANALYTICS - Get user's post stats
  static async getUserStats(userId?: string): Promise<{
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    postsByType: Record<Post['type'], number>;
  }> {
    try {
      const user = AuthService.getCurrentUser();
      const targetUserId = userId || user?.uid;
      
      if (!targetUserId) {
        throw new Error('User ID required');
      }

      const { posts } = await this.getPosts({ userId: targetUserId });

      const stats = {
        totalPosts: posts.length,
        totalLikes: posts.reduce((sum, post) => sum + post.likes.length, 0),
        totalComments: posts.reduce((sum, post) => sum + post.comments.length, 0),
        postsByType: {} as Record<Post['type'], number>,
      };

      // Count posts by type
      const types: Post['type'][] = ['training-tip', 'route-review', 'achievement', 'question', 'general'];
      types.forEach(type => {
        stats.postsByType[type] = posts.filter(post => post.type === type).length;
      });

      return stats;
    } catch (error) {
      console.error('❌ Error getting user stats:', error);
      throw new Error(`Failed to get user stats: ${(error as Error).message}`);
    }
  }
}

export default PostsService;