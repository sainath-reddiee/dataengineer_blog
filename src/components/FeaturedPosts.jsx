import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Star, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePosts } from '@/hooks/useWordPress';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const FeaturedPosts = () => {
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver();
  
  // Fetch featured posts from WordPress - with debugging and refresh capability
  const { posts: featuredPosts, loading, error, refresh } = usePosts({ 
    featured: false, // Start with all posts since featured might not be set
    per_page: 6 
  });

  // Debug logging
  console.log('FeaturedPosts - Posts:', featuredPosts);
  console.log('FeaturedPosts - Loading:', loading);
  console.log('FeaturedPosts - Error:', error);

  // Filter featured posts or use first 3 if no featured posts
  const displayPosts = featuredPosts.filter(post => post.featured).slice(0, 3);
  const finalPosts = displayPosts.length > 0 ? displayPosts : featuredPosts.slice(0, 3);

  if (loading) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span className="mb-4">Error loading featured posts: {error}</span>
            <div className="text-sm text-gray-500 max-w-md text-center mb-4">
              <p>Trying to fetch from: https://app.dataengineerhub.blog/wp-json/wp/v2/posts</p>
              <p>Check browser console for more details</p>
            </div>
            <Button 
              onClick={refresh} 
              variant="outline" 
              className="border-red-400/50 text-red-300 hover:bg-red-500/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (finalPosts.length === 0 && !loading) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-center py-20 text-yellow-400">
            <span className="mb-4">No posts found</span>
            <div className="text-sm text-gray-500 max-w-md text-center mb-4">
              <p>Make sure you have published posts in WordPress</p>
              <p>Check: https://app.dataengineerhub.blog/wp-json/wp/v2/posts</p>
            </div>
            <Button 
              onClick={refresh} 
              variant="outline" 
              className="border-yellow-400/50 text-yellow-300 hover:bg-yellow-500/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-2 relative">
      <div className="container mx-auto px-6">
        <AnimatePresence>
          {hasIntersected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-3"
            >
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-4 py-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs font-medium text-yellow-200">Featured Content</span>
                </div>
                {/* Debug refresh button - only in development */}
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={refresh}
                    className="p-2 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
                    title="Refresh featured posts"
                  >
                    <RefreshCw className="h-4 w-4 text-blue-400" />
                  </button>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                <span className="gradient-text">Must-Read</span> Articles
              </h2>
              <p className="text-xs text-gray-300 max-w-2xl mx-auto">
                Handpicked articles covering the latest trends and best practices in data engineering
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {hasIntersected && finalPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:row-span-2"
            >
              <Link to={`/articles/${finalPosts[0].slug}`} className="block blog-card rounded-2xl overflow-hidden group h-full">
                <div className="relative">
                  <img
                    src={finalPosts[0].image}
                    alt={finalPosts[0].title}
                    className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {finalPosts[0].category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl lg:text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                    {finalPosts[0].title}
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {finalPosts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(finalPosts[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{finalPosts[0].readTime}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          <div className="space-y-8">
            {finalPosts.slice(1, 3).map((post, index) => (
              hasIntersected && (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link to={`/articles/${post.slug}`} className="block blog-card rounded-xl overflow-hidden group">
                    <div className="flex">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-32 h-32 flex-shrink-0 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-6 flex-1">
                        <div className="mb-2">
                          <span className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {post.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-3">
                            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            <span>{post.readTime}</span>
                          </div>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            ))}
          </div>
        </div>

        {hasIntersected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-center"
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-full font-bold group">
              <Link to="/articles">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        )}

        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Debug Info</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Total posts: {featuredPosts.length}</div>
              <div>Featured posts: {displayPosts.length}</div>
              <div>Final posts shown: {finalPosts.length}</div>
              <div>Loading: {loading.toString()}</div>
              <div>Error: {error || 'None'}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPosts;