import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative pt-8 pb-16 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-3 mb-8">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium text-blue-200">Latest in Data Engineering</span>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black mb-8 leading-tight"
          >
            Master the Art of{' '}
            <span className="gradient-text">Data Engineering</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Dive deep into AWS, Snowflake, Azure, SQL, Airflow, dbt and cutting-edge data technologies. 
            Transform your career with expert insights and hands-on tutorials.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-bold text-lg pulse-glow group"
            >
              <Link to="/articles">
                Explore Latest Posts
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-blue-400/50 text-blue-300 hover:bg-blue-500/20 px-8 py-4 rounded-full font-bold text-lg backdrop-blur-sm"
            >
              <Link to="/newsletter">
                Join Newsletter
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          >
            {[
              { number: '127+', label: 'Expert Articles' },
              { number: '15.2K+', label: 'Monthly Readers' },
              { number: '32+', label: 'Technologies Covered' },
              { number: '98.7%', label: 'Success Rate' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;