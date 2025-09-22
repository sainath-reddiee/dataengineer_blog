import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import PostCard from '@/components/PostCard';
import PostCardSkeleton from '@/components/PostCardSkeleton';
import wordpressApi from '@/services/wordpressApi';

const RecentPosts = ({ 
  category = null, 
  showCategoryError = false,
  limit = 6,
  title = "Recent Posts"
}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts function
  const fetchPosts = async () => {
    try {
      setError(null);
      setLoading(true);
      
      let result;
      
      if (category) {
        // Get posts by category
        try {
          const categoryId = await wordpressApi.getCategoryIdBySlug(category);
          result = await wordpressApi.getPostsByCategory(categoryId, { per_page: limit });
        } catch (categoryError) {
          if (showCategoryError) {
            setError(`Category "${category}" not found. Please check if the category exists in WordPress.`);
            setPosts([]); // Clear posts on category error
            return;
          }
          // When not showing a category error, we just show no posts.
          result = { posts: [] };
        }
      } else {
        // Get all posts
        result = await wordpressApi.getPosts({ per_page: limit });
      }
      
      setPosts(result.posts);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh
  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    wordpressApi.clearCache(); // Clear cache before refresh
    fetchPosts();
    toast({
      title: "Refreshing posts...",
      description: "Loading latest content",
    });
  };

  // Initial load and re-fetch when the category changes
  useEffect(() => {
    // Clear the cache for posts and categories whenever a new category is viewed.
    // This ensures that the user always sees the correct posts without needing to manually refresh.
    if (category) {
      wordpressApi.clearCache('posts');
      wordpressApi.clearCache('categories');
    }
    fetchPosts();
  }, [category, limit]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold gradient-text">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }, (_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold gradient-text">{title}</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center"
        >
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-300 mb-2">
            {category ? `Category "${category}" Issue` : 'Failed to Load Posts'}
          </h3>
          <p className="text-red-200/80 mb-4">{error}</p>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="border-red-400/50 text-red-300 hover:bg-red-500/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold gradient-text">{title}</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-8 text-center"
        >
          <h3 className="text-lg font-semibold text-yellow-300 mb-2">
            {category ? `No posts found in "${category}" category` : 'No posts available'}
          </h3>
          <p className="text-yellow-200/80 mb-4">
            {category 
              ? 'This category exists but has no published posts yet. Try publishing a post with relevant keywords.'
              : 'No posts have been published yet.'
            }
          </p>
        </motion.div>
      </div>
    );
  }

  // Success state - render posts
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text">{title}</h2>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          className="border-blue-400/50 text-blue-300 hover:bg-blue-500/20"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1 
            }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RecentPosts;