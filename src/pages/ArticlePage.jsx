import React, { Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MetaTags from '@/components/SEO/MetaTags';
import { usePost } from '@/hooks/useWordPress';

// Lazy load ad component to reduce initial bundle size
const AdPlacement = React.lazy(() => import('../components/AdPlacement'));

// Optimized Image component for better mobile performance
const OptimizedImage = ({ src, alt, className }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(null);

  React.useEffect(() => {
    // Create different sized images for mobile optimization
    const img = new Image();
    
    // Use smaller image for mobile devices
    const isMobile = window.innerWidth <= 768;
    const optimizedSrc = isMobile 
      ? src.replace(/(\.[^.]+)$/, '_mobile$1').replace(/w=\d+/, 'w=400').replace(/h=\d+/, 'h=300')
      : src;
    
    img.onload = () => {
      setImageSrc(optimizedSrc);
      setImageLoaded(true);
    };
    
    img.onerror = () => {
      // Fallback to original image
      setImageSrc(src);
      setImageLoaded(true);
    };
    
    img.src = optimizedSrc;
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse rounded-2xl flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      )}
      {imageSrc && (
        <img 
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          alt={alt}
          src={imageSrc}
          loading="lazy"
          decoding="async"
          // Add responsive image attributes for mobile
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          style={{ 
            contentVisibility: 'auto',
            containIntrinsicSize: '800px 400px'
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
    </div>
  );
};

// Loading skeleton for ads
const AdSkeleton = () => (
  <div className="h-32 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse rounded-lg flex items-center justify-center">
    <span className="text-gray-500 text-sm">Advertisement</span>
  </div>
);

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
            <h1 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
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
            
            {/* Optimized hero image */}
            <OptimizedImage 
              src={post.image}
              alt={post.title}
              className="h-64 md:h-80 rounded-2xl overflow-hidden mb-8"
            />

            {/* Lazy load mid-content ad */}
            {import.meta.env.VITE_ADS_ENABLED === 'true' && (
              <div className="my-8 text-center">
                <Suspense fallback={<AdSkeleton />}>
                  <AdPlacement placementId={181} />
                </Suspense>
              </div>
            )}
            
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            {/* Lazy load bottom ad */}
            {import.meta.env.VITE_ADS_ENABLED === 'true' && (
              <div className="my-8 text-center">
                <Suspense fallback={<AdSkeleton />}>
                  <AdPlacement placementId={182} />
                </Suspense>
              </div>
            )}
          </motion.article>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;