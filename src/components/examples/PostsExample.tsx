import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Input, Button } from '@/components/atoms';
import { PostsService, Post, CreatePostData } from '@/lib/firebase/posts.service';
import { Colors } from '@/lib/colors';

// 📝 Example component showing how to use PostsService
export const PostsExample: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  
  // Form state for creating new posts
  const [newPost, setNewPost] = useState<CreatePostData>({
    title: '',
    content: '',
    type: 'general',
    tags: [],
    isPublic: true
  });

  // 📚 Load posts when component mounts
  useEffect(() => {
    loadPosts();
  }, []);

  // 🔄 Function to load posts from Firebase
  const loadPosts = async () => {
    setLoading(true);
    try {
      const { posts: fetchedPosts } = await PostsService.getPosts({
        limitCount: 10,
        isPublic: true
      });
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  // ✨ Function to create a new post
  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      Alert.alert('Error', 'Please fill in title and content');
      return;
    }

    setCreating(true);
    try {
      const postId = await PostsService.createPost({
        ...newPost,
        tags: newPost.tags || []
      });
      
      console.log('Post created:', postId);
      
      // Reset form
      setNewPost({
        title: '',
        content: '',
        type: 'general',
        tags: [],
        isPublic: true
      });
      
      // Reload posts to show the new one
      await loadPosts();
      
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  // 👍 Function to like/unlike a post
  const handleToggleLike = async (postId: string) => {
    try {
      await PostsService.toggleLike(postId);
      
      // Update local state to reflect the change immediately
      setPosts(currentPosts => 
        currentPosts.map(post => {
          if (post.id === postId) {
            // You'd get the current user's ID from auth
            const userId = 'current-user-id'; // Replace with actual user ID
            const userLiked = post.likes.includes(userId);
            
            return {
              ...post,
              likes: userLiked 
                ? post.likes.filter(id => id !== userId)
                : [...post.likes, userId]
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Failed to toggle like:', error);
      Alert.alert('Error', 'Failed to update like');
    }
  };

  // 💬 Function to add a comment
  const handleAddComment = async (postId: string) => {
    Alert.prompt(
      'Add Comment',
      'Enter your comment:',
      async (comment) => {
        if (comment?.trim()) {
          try {
            await PostsService.addComment(postId, comment);
            await loadPosts(); // Reload to show new comment
            Alert.alert('Success', 'Comment added!');
          } catch (error) {
            console.error('Failed to add comment:', error);
            Alert.alert('Error', 'Failed to add comment');
          }
        }
      }
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Create Post Form */}
      <View style={styles.createSection}>
        <Text style={styles.sectionTitle}>Create New Post</Text>
        
        <Input
          label="Title"
          value={newPost.title}
          onChangeText={(title) => setNewPost(prev => ({ ...prev, title }))}
          placeholder="Enter post title..."
        />
        
        <Input
          label="Content"
          value={newPost.content}
          onChangeText={(content) => setNewPost(prev => ({ ...prev, content }))}
          placeholder="What's on your mind?"
          multiline
          numberOfLines={4}
        />
        
        <View style={styles.typeSelector}>
          <Text style={styles.label}>Post Type:</Text>
          {(['general', 'training-tip', 'achievement', 'question', 'route-review'] as const).map(type => (
            <Button
              key={type}
              variant={newPost.type === type ? 'primary' : 'secondary'}
              onPress={() => setNewPost(prev => ({ ...prev, type }))}
              style={styles.typeButton}
            >
              {type.replace('-', ' ')}
            </Button>
          ))}
        </View>
        
        <Button 
          onPress={handleCreatePost}
          loading={creating}
          disabled={creating}
        >
          {creating ? 'Creating...' : 'Create Post'}
        </Button>
      </View>

      {/* Posts Feed */}
      <View style={styles.postsSection}>
        <View style={styles.postsHeader}>
          <Text style={styles.sectionTitle}>Recent Posts</Text>
          <Button 
            variant="secondary" 
            onPress={loadPosts}
            disabled={loading}
            style={styles.refreshButton}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </View>

        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <View>
                <Text style={styles.postAuthor}>{post.userDisplayName}</Text>
                <Text style={styles.postType}>{post.type.replace('-', ' ')}</Text>
              </View>
              <Text style={styles.postDate}>
                {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'Just now'}
              </Text>
            </View>

            {/* Post Content */}
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>

            {/* Post Tags */}
            {post.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {post.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Post Actions */}
            <View style={styles.postActions}>
              <Button
                variant="secondary"
                onPress={() => post.id && handleToggleLike(post.id)}
                style={styles.actionButton}
              >
                👍 {post.likes.length}
              </Button>
              
              <Button
                variant="secondary"
                onPress={() => post.id && handleAddComment(post.id)}
                style={styles.actionButton}
              >
                💬 {post.comments.length}
              </Button>
            </View>

            {/* Comments */}
            {post.comments.length > 0 && (
              <View style={styles.commentsSection}>
                <Text style={styles.commentsTitle}>Comments:</Text>
                {post.comments.slice(0, 2).map((comment, index) => (
                  <View key={comment.id || index} style={styles.comment}>
                    <Text style={styles.commentAuthor}>{comment.userDisplayName}:</Text>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                  </View>
                ))}
                {post.comments.length > 2 && (
                  <Text style={styles.moreComments}>
                    ... and {post.comments.length - 2} more comments
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}

        {posts.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No posts yet. Create the first one!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  createSection: {
    backgroundColor: Colors.white,
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.gray[900],
    marginBottom: 16,
  },
  typeSelector: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[700],
    marginBottom: 8,
  },
  typeButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  postsSection: {
    flex: 1,
  },
  postsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    marginBottom: 8,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  postCard: {
    backgroundColor: Colors.white,
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  postType: {
    fontSize: 12,
    color: Colors.primary[600],
    textTransform: 'capitalize',
  },
  postDate: {
    fontSize: 12,
    color: Colors.gray[500],
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: Colors.gray[700],
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary[700],
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  actionButton: {
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[700],
    marginBottom: 8,
  },
  comment: {
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray[600],
  },
  commentContent: {
    fontSize: 12,
    color: Colors.gray[700],
    marginTop: 2,
  },
  moreComments: {
    fontSize: 12,
    color: Colors.gray[500],
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray[500],
    textAlign: 'center',
  },
});

export default PostsExample;