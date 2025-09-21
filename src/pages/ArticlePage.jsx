import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Newsletter from '@/components/Newsletter';
import MetaTags from '@/components/SEO/MetaTags';
import AdManager from '@/components/AdSense/AdManager';
import { usePost } from '@/hooks/useWordPress';

const ArticlePage = () => {
  const { slug } = useParams();
  const { post, loading, error } = usePost(slug);

  if (loading) {
    return (
      <div className="pt-4 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <Loader className="h-8 w-8 animate-spin text-blue-400" />
              <p className="text-gray-400">Loading article...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-4 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <Button asChild variant="outline" className="border-2 border-blue-400/50 text-blue-300 hover:bg-blue-500/20 backdrop-blur-sm">
              <Link to="/articles">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Articles
              </Link>
            </Button>
          </motion.div>
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-400 mb-4">Error: {error}</p>
            <p className="text-sm text-gray-500">The article you're looking for doesn't exist or couldn't be loaded.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-4 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <Button asChild variant="outline" className="border-2 border-blue-400/50 text-blue-300 hover:bg-blue-500/20 backdrop-blur-sm">
              <Link to="/articles">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Articles
              </Link>
            </Button>
          </motion.div>
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-400">The article you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title={post.title}
        description={post.excerpt}
        keywords={post.category}
        image={post.image}
        type="article"
        author={post.author}
        publishedTime={new Date(post.date).toISOString()}
        category={post.category}
        tags={[post.category]}
      />
      <div className="pt-4 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <Button asChild variant="outline" className="border-2 border-blue-400/50 text-blue-300 hover:bg-blue-500/20 backdrop-blur-sm">
              <Link to="/articles">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Articles
              </Link>
            </Button>
          </motion.div>

          {/* In-article Ad */}
          <AdManager position="in-article" />

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="mb-8">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400 mb-8">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
            
            <div className="relative h-96 rounded-2xl overflow-hidden mb-12">
              <img 
                className="w-full h-full object-cover"
                alt={post.title}
                src={post.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
            </div>

            {/* Mid-article Ad */}
            <AdManager position="in-article" />

            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            {/* End-article Ad */}
            <AdManager position="in-article" />
          </motion.article>
          
          <div className="mt-20">
            <Newsletter />
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;