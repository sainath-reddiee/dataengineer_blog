import React from 'react';
import { usePosts } from '../hooks/useWordPress';
import PostCard from './PostCard';
import PostCardSkeleton from './PostCardSkeleton';

const TrendingPosts = () => {
  const { posts: trendingPosts, isLoading, error } = usePosts({
    per_page: 3,
    trending: true, // Fetch only trending posts from WordPress
  });

  if (isLoading) {
    return (
      <div className="trending-posts-section py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Trending Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Error loading trending posts: {error.message}</div>;
  }

  // If there are no trending posts, don't render the section
  if (trendingPosts.length === 0) {
    return null;
  }

  return (
    <div className="trending-posts-section py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Trending Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingPosts;