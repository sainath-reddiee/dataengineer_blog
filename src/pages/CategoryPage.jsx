import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import RecentPosts from '@/components/RecentPosts';
import MetaTags from '@/components/SEO/MetaTags';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const formattedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <>
      <MetaTags 
        title={`${formattedCategoryName} Articles - DataEngineer Hub`}
        description={`Browse articles and tutorials about ${formattedCategoryName} on DataTech Hub.`}
      />
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button asChild variant="outline" className="border-2 border-blue-400/50 text-blue-300 hover:bg-blue-500/20 backdrop-blur-sm">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-4"
          >
            <span className="gradient-text">{formattedCategoryName}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-300 mb-12"
          >
            Showing all articles for the "{formattedCategoryName}" category.
          </motion.p>
          
          <RecentPosts category={categoryName.toLowerCase()} />
        </div>
      </div>
    </>
  );
};

export default CategoryPage;