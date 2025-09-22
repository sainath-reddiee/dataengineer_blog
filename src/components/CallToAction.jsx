import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 md:p-10 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/30 to-purple-600/30 backdrop-blur-sm border border-blue-500/50 rounded-full px-4 py-2 mb-4">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-200">Join Our Community</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black mb-3">
                Ready to Level Up Your <span className="gradient-text">Data Skills</span>?
              </h2>
              
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Join thousands of data professionals who are already transforming their careers 
                with our expert-curated content and practical tutorials.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold group">
                <Link to="/articles">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Reading
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-2 border-blue-400/50 text-blue-300 hover:bg-blue-500/20 backdrop-blur-sm">
                <Link to="/about">
                  Learn More About Us
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>100+ Articles</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Weekly Updates</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Expert Authors</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;