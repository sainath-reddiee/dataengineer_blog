import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  title = null 
}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Function to fetch posts with proper error handling
  const fetchPosts = useCallback(async (forceRefresh = false) => {
    try {
      setError(null);
      if (forceRefresh) {
        setRefreshing(true);
        console.log('🔄 Force refreshing posts...');
      } else {
        setLoading(true);
      }
      
      let postsData;
      
      if (category) {
        console.log('📂 Fetching posts for category:', category);
        
        // Get category ID first
        const categoryId = await wordpressApi.getCategoryIdBySlug(category, forceRefresh);
        console.log('🆔 Category ID found:', categoryId);
        
        // Fetch posts for the specific category
        const result = await wordpressApi.getPostsByCategory(categoryId, { 
          per_page: limit,
          forceRefresh 
        });
        postsData = result.posts;
        
        console.log('📋 Posts fetched for category:', postsData.length);
      } else {
        // Fetch all posts
        const result = await wordpressApi.getPosts({ 
          per_page: limit,
          forceRefresh 
        });
        postsData = result.posts;
        
        console.log('📋 All posts fetched:', postsData.length);
      }
      
      setPosts(postsData);
      setLastRefresh(new Date().toLocaleTimeString());
      
      if (forceRefresh) {
        toast({
          title: "Posts refreshed",
          description: `Loaded ${postsData.length} posts`,
        });
      }
      
    } catch (err) {
      console.error('❌ Error fetching posts:', err);
      setError(err.message);
      
      if (showCategoryError && category) {
        // Show specific error for category not found
        toast({
          title: "Category Error",
          description: `Category "${category}" not found. Please check if it exists.`,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [category, limit, showCategoryError]);

  // Manual refresh function
  const handleRefresh = useCallback(async () => {
    await fetchPosts(true);
  }, [fetchPosts]);

  // Auto-refresh every 30 seconds if we're on a category page
  useEffect(() => {
    let interval;
    if (category) {
      interval = setInterval(() => {
        console.log('⏰ Auto-refreshing category posts...');
        fetchPosts(true);
      }, 30000); // 30 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [category, fetchPosts]);

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {title && (
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold gradient-text">{title}</h2>
          </div>
        )}
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
        {title && (
          <h2 className="text-2xl font-bold gradient-text">{title}</h2>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center"
        >
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-300 mb-2">
            {category ? `Category "${category}" not found` : 'Failed to load posts'}
          </h3>
          <p className="text-red-200/80 mb-4">{error}</p>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="border-red-400/50 text-red-300 hover:bg-red-500/20"
            disabled={refreshing}
          >
            {refreshing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
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
        {title && (
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold gradient-text">{title}</h2>
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm"
              className="border-blue-400/50 text-blue-300 hover:bg-blue-500/20"
              disabled={refreshing}
            >
              {refreshing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        )}
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
              ? 'Posts in this category might be published soon. Try refreshing or check back later.'
              : 'New posts will appear here when they are published.'
            }
          </p>
          {lastRefresh && (
            <p className="text-xs text-gray-400">
              Last checked: {lastRefresh}
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold gradient-text">{title}</h2>
          <div className="flex items-center gap-2">
            {lastRefresh && (
              <span className="text-xs text-gray-400">
                Updated: {lastRefresh}
              </span>
            )}
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm"
              className="border-blue-400/50 text-blue-300 hover:bg-blue-500/20"
              disabled={refreshing}
            >
              {refreshing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={posts.length} // Re-animate when posts change
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
      </AnimatePresence>

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Debug Info</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Category: {category || 'All'}</div>
            <div>Posts loaded: {posts.length}</div>
            <div>Last refresh: {lastRefresh || 'Never'}</div>
            <div>Cache status: {JSON.stringify(wordpressApi.getCacheStatus())}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentPosts;