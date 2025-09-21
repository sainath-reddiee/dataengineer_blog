import React from 'react';
import { motion } from 'framer-motion';
import RecentPosts from '@/components/RecentPosts';
import FeaturedPosts from '@/components/FeaturedPosts';
import MetaTags from '@/components/SEO/MetaTags';

const AllArticlesPage = () => {
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
          
          <FeaturedPosts />
          <RecentPosts />
        </div>
      </div>
    </>
  );
};

export default AllArticlesPage;