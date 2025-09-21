import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { allArticles } from '@/data/articles';

const FeaturedPosts = () => {
  // Use static featured posts to avoid API issues
  const featuredPosts = allArticles.filter(post => post.featured).slice(0, 3);
  const loading = false;
  const error = null;

  if (loading) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center py-20 text-red-400">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>Error loading featured posts: {error}</span>
          </div>
        </div>
      </section>
    );
  }

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-6 py-3 mb-6">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-200">Featured Content</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Must-Read</span> Articles
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Handpicked articles covering the latest trends and best practices in data engineering
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:row-span-2"
          >
            <Link to={`/articles/${featuredPosts[0].slug}`} className="block blog-card rounded-2xl overflow-hidden group h-full">
              <div className="relative h-64 lg:h-80 overflow-hidden">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={featuredPosts[0].title}
                  src={featuredPosts[0].image} 
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1595872018818-97555653a011';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {featuredPosts[0].category}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                  {featuredPosts[0].title}
                </h3>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  {featuredPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(featuredPosts[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPosts[0].readTime}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>

          <div className="space-y-8">
            {featuredPosts.slice(1, 3).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Link to={`/articles/${post.slug}`} className="block blog-card rounded-xl overflow-hidden group">
                  <div className="flex">
                    <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
                      <img 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={post.title}
                        src={post.image}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1595872018818-97555653a011';
                        }}
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="mb-2">
                        <span className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span>{post.readTime}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-full font-bold group">
            <Link to="/articles">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedPosts;
