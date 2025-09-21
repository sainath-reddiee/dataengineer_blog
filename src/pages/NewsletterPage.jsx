import React from 'react';
import { motion } from 'framer-motion';
import Newsletter from '@/components/Newsletter';
import MetaTags from '@/components/SEO/MetaTags';

const NewsletterPage = () => {
  return (
    <>
      <MetaTags 
        title="Newsletter - DataEngineer Hub"
        description="Subscribe to the DataEngineer Hub newsletter for the latest in data engineering."
      />
      <div className="pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Newsletter />
        </motion.div>
      </div>
    </>
  );
};

export default NewsletterPage;