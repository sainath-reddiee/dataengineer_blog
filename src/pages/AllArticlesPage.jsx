import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePosts } from '@/hooks/useWordPress';
import PostCard from '@/components/PostCard';
import PostCardSkeleton from '@/components/PostCardSkeleton';
import FeaturedPosts from '@/components/FeaturedPosts';
import MetaTags from '@/components/SEO/MetaTags';

const AllArticlesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12; // Show 12 posts per page

  const { posts, loading, error, totalPages, totalPosts, refresh } = usePosts({
    page: currentPage,
    per_page: postsPerPage,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <MetaTags 
        title="All Articles - DataEngineer Hub"
        description="Browse all articles and tutorials on DataEngineer Hub."
      />
      <div className="pt-1 pb-6">
        <div className="container mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-black mb-1 text-center"
          >
            All <span className="gradient-text">Articles</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base text-gray-300 mb-4 text-center max-w-3xl mx-auto"
          >
            Explore our full library of content, from beginner tutorials to advanced deep dives into data engineering.
          </motion.p>
          
          {/* Only show featured posts on first page */}
          {currentPage === 1 && <FeaturedPosts />}
          
          {/* All Articles Section */}
          <div className="space-y-6 mt-16">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold gradient-text">
                All Articles 
                {totalPosts > 0 && (
                  <span className="text-sm text-gray-400 ml-2">
                    ({totalPosts} total)
                  </span>
                )}
              </h2>
              <Button 
                onClick={refresh} 
                variant="outline" 
                size="sm"
                className="border-blue-400/50 text-blue-300 hover:bg-blue-500/20"
              >
                Refresh
              </Button>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: postsPerPage }).map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">Error loading articles: {error}</p>
                <Button onClick={refresh} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No articles found.</p>
              </div>
            ) : (
              <>
                {/* Posts Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.05 
                      }}
                    >
                      <PostCard post={post} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-blue-400/50 text-blue-300 hover:bg-blue-500/20 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className={currentPage === pageNum 
                              ? "bg-blue-600 text-white" 
                              : "border-blue-400/50 text-blue-300 hover:bg-blue-500/20"
                            }
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-blue-400/50 text-blue-300 hover:bg-blue-500/20 disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
                
                {/* Page Info */}
                <div className="text-center text-sm text-gray-400 mt-4">
                  Showing page {currentPage} of {totalPages} 
                  ({posts.length} articles on this page)
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllArticlesPage;