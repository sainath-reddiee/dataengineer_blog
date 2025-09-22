import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Code, Database, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Background gradient with reduced intensity */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-indigo-900/30"></div>
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Compact badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 mb-6"
          >
            <Database className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-200">Data Engineering Hub</span>
          </motion.div>

          {/* Reduced title size */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight"
          >
            Master <span className="gradient-text">Data Engineering</span> with Expert Insights
          </motion.h1>

          {/* Compact description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto"
          >
            Dive deep into AWS, Snowflake, dbt, Airflow, and more. Get practical tutorials, 
            industry best practices, and cutting-edge insights from experienced data engineers.
          </motion.p>

          {/* Compact CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold group">
              <Link to="/articles">
                Explore Articles
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-blue-400/50 text-blue-300 hover:bg-blue-500/20 backdrop-blur-sm">
              <Link to="/newsletter">
                Subscribe Newsletter
              </Link>
            </Button>
          </motion.div>

          {/* Compact tech icons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center justify-center space-x-6 text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <Cloud className="h-5 w-5" />
              <span className="text-sm">AWS</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span className="text-sm">Snowflake</span>
            </div>
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span className="text-sm">dbt</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;