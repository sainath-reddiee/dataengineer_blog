import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, TrendingUp, Loader, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePosts } from '@/hooks/useWordPress';
import AdManager from '@/components/AdSense/AdManager';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const POSTS_PER_PAGE = 6;

const RecentPosts = ({ category, initialLimit }) => {
  const [visibleCount, setVisibleCount] = useState(initialLimit || POSTS_PER_PAGE);
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver();

  // Fetch posts from WordPress
  const { posts: allPosts, loading, error, hasMore, loadMore } = usePosts({
    per_page: POSTS_PER_PAGE,
    featured: null, // Get all posts
    categories: category ? category : null
  });

  // Debug logging
  console.log('RecentPosts - All Posts:', allPosts);
  console.log('RecentPosts - Loading:', loading);
  console.log('RecentPosts - Error:', error);
  console.log('RecentPosts - Category:', category);

  // Apply visible count (don't filter featured for now)
  const articles = allPosts;
  const visiblePosts = articles.slice(0, visibleCount);
  const hasMoreLocal = visibleCount < articles.length || hasMore;

  const handleLoadMore = () => {
    if (visibleCount < articles.length) {
      // Load more from current posts
      setVisibleCount(prevCount => prevCount + POSTS_PER_PAGE);
    } else if (hasMore) {
      // Load more from API
      loadMore();
    }
  };

  return (
    <section ref={ref} className="py-1 relative">
      <div className="container mx-auto px-6">
        <AnimatePresence>
          {hasIntersected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-1"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-3 py-1 mb-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-xs font-medium text-green-200">Fresh Content</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold mb-1">
                <span className="gradient-text">Latest</span> Articles
              </h2>
              <p className="text-xs text-gray-300 max-w-2xl mx-auto">
                Stay updated with the newest insights and tutorials in data engineering
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <AnimatePresence>
            {hasIntersected && visiblePosts.map((post, index) => (
              <React.Fragment key={post.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (index % POSTS_PER_PAGE) * 0.02 }}
                  layout
                >
                  <Link to={`/articles/${post.slug}`} className="block blog-card rounded-2xl overflow-hidden group h-full">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {post.category}
                        </span>
                        {post.trending && (
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>Trending</span>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2 flex-grow">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 mb-3 text-sm line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform text-blue-400" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                {/* Show ad between posts - reduced frequency */}
                {(index + 1) % 9 === 0 && (
                  <motion.div
                    key={`ad-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="md:col-span-2 lg:col-span-3"
                  >
                    <AdManager position="between-posts" postIndex={index} category={category} />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </AnimatePresence>
        </div>

        {articles.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-12"
          >
            <div>
              <p className="mb-2">No articles found{category ? ` for "${category}" category` : ''}</p>
              <div className="text-sm text-gray-500">
                <p>Make sure you have published posts in WordPress</p>
                <p>API: https://app.dataengineerhub.blog/wp-json/wp/v2/posts</p>
              </div>
            </div>
          </motion.div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 py-8">
            <div className="flex flex-col items-center">
              <AlertCircle className="h-6 w-6 mb-2" />
              <p className="mb-2">Error loading posts: {error}</p>
              <div className="text-sm text-gray-500 max-w-md text-center">
                <p>API URL: https://app.dataengineerhub.blog/wp-json/wp/v2/posts</p>
                <p>Check browser console for details</p>
              </div>
            </div>
          </div>
        )}

        {hasMoreLocal && !loading && articles.length > 0 && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-8"
            >
              <Button
                onClick={handleLoadMore}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Load More Articles
              </Button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

export default RecentPosts;