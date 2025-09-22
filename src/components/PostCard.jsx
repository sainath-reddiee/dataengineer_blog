import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Star } from 'lucide-react';

const PostCard = ({ post }) => {
  if (!post) {
    return null;
  }

  // Fallback image URL
  const placeholderImage = 'https://images.unsplash.com/photo-1595872018818-97555653a011?w=800&h=600&fit=crop';

  // Function to handle image loading errors
  const handleImageError = (e) => {
    e.target.src = placeholderImage;
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="blog-card rounded-2xl overflow-hidden group h-full flex flex-col"
    >
      <Link to={`/articles/${post.slug}`} className="block h-full">
        <div className="relative">
          <img
            src={post.image || placeholderImage}
            alt={post.title}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError} // This line is the fix
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              {post.category}
            </span>
          </div>
          {post.featured && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-2 rounded-full shadow-lg">
              <Star className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PostCard;