import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, TrendingUp, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { allArticles } from '@/data/articles';
import AdManager from '@/components/AdSense/AdManager';

const POSTS_PER_PAGE = 6;

const RecentPosts = ({ category, initialLimit }) => {
  const [visibleCount, setVisibleCount] = useState(initialLimit || POSTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  const articles = useMemo(() => {
    const sortedArticles = allArticles
      .filter(p => !p.featured)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (category) {
      return sortedArticles.filter(p => {
        const postCategory = p.category.toLowerCase();
        const searchCategory = category.toLowerCase();
        return postCategory === searchCategory || 
               postCategory.replace(/\s+/g, '-') === searchCategory ||
               postCategory === searchCategory.replace(/-/g, ' ') ||
               postCategory.replace(/\s+/g, '') === searchCategory.replace(/\s+/g, '');
      });
    }
    return sortedArticles;
  }, [category]);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prevCount => prevCount + POSTS_PER_PAGE);
      setIsLoading(false);
    }, 500);
  };

  const visiblePosts = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <section className="py-4 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-6 py-3 mb-6">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium text-green-200">Fresh Content</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            <span className="gradient-text">Latest</span> Articles
          </h2>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto">
            Stay updated with the newest insights and tutorials in data engineering
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <AnimatePresence>
            {visiblePosts.map((post, index) => (
              <React.Fragment key={post.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: (index % POSTS_PER_PAGE) * 0.1 }}
                  layout
                >
                  <Link to={`/articles/${post.slug}`} className="block blog-card rounded-2xl overflow-hidden group h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={post.title}
                        src={post.image} />
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
                      <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors line-clamp-2 flex-grow">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
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
                
                {/* Show ad between posts */}
                {(index + 1) % 6 === 0 && (
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

        {articles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-12"
          >
            <p>No articles found for this category yet. Check back soon!</p>
          </motion.div>
        )}

        <AnimatePresence>
          {hasMore && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Button
                onClick={handleLoadMore}
                size="lg"
                variant="outline"
                className="border-2 border-blue-400/50 text-blue-300 hover:bg-blue-500/20 px-8 py-4 rounded-full font-bold backdrop-blur-sm group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load More Articles
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RecentPosts;