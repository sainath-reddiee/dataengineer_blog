import React from 'react';
import { motion } from 'framer-motion';
import Newsletter from '@/components/Newsletter';
import MetaTags from '@/components/SEO/MetaTags';
import AdManager from '@/components/AdSense/AdManager';

const NewsletterPage = () => {
  return (
    <>
      <MetaTags 
        title="Newsletter - DataEngineer Hub"
        description="Subscribe to the DataEngineer Hub newsletter for the latest in data engineering."
      />
      <div className="pt-8 pb-20">
        {/* In-content Ad */}
        <AdManager position="in-article" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Newsletter />
        </motion.div>
        
        {/* Another in-content Ad */}
        <AdManager position="in-article" />
      </div>
    </>
  );
};

export default NewsletterPage;