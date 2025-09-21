import React from 'react';
import { motion } from 'framer-motion';
import MetaTags from '@/components/SEO/MetaTags';
import AdManager from '@/components/AdSense/AdManager';

const PrivacyPolicyPage = () => {
  return (
    <>
      <MetaTags 
        title="Privacy Policy - DataEngineer Hub"
        description="Read the Privacy Policy for DataEngineer Hub."
      />
      <div className="pt-8 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight text-center">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 text-center">Last updated: September 19, 2025</p>
            
            {/* In-content Ad */}
            <AdManager position="in-article" />
            
            <div className="prose prose-invert max-w-none text-lg text-gray-300 leading-relaxed space-y-6">
              <p>Welcome to DataEngineer Hub. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
              
              <h2 className="text-3xl font-bold mt-12 mb-4 gradient-text">1. Information We Collect</h2>
              <p>We may collect personal information that you voluntarily provide to us when you subscribe to our newsletter, contact us, or leave comments. This may include your name and email address.</p>
              
              {/* Another in-content Ad */}
              <AdManager position="in-article" />
              
              <h2 className="text-3xl font-bold mt-12 mb-4 gradient-text">2. Use of Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Send you our newsletter and other updates.</li>
                <li>Respond to your comments or inquiries.</li>
                <li>Improve our website and content.</li>
                <li>Monitor and analyze usage and trends to improve your experience.</li>
              </ul>

              <h2 className="text-3xl font-bold mt-12 mb-4 gradient-text">3. Cookies and Web Beacons</h2>
              <p>Like any other website, DataEngineer Hub uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

              <h2 className="text-3xl font-bold mt-12 mb-4 gradient-text">4. Third-Party Services</h2>
              <p>We may use third-party service providers to help us operate our business and the site or administer activities on our behalf, such as sending out newsletters or surveys. We may share your information with these third parties for those limited purposes provided that you have given us your permission.</p>

              <h2 className="text-3xl font-bold mt-12 mb-4 gradient-text">5. Changes to This Privacy Policy</h2>
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;