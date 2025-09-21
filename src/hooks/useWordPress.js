import { useState, useEffect, useCallback } from 'react';
import wordpressApi from '@/services/wordpressApi';

// Hook for fetching posts
export const usePosts = ({ 
  page = 1, 
  per_page = 10, 
  categories = null, 
  search = null,
  featured = null,
  enabled = true 
} = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPosts = useCallback(async () => {
    if (!enabled) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await wordpressApi.getPosts({
        page,
        per_page,
        categories,
        search,
        featured
      });

      setData(response);
      setHasMore(page < totalPages);
    } catch (err) {
      setError(err.message);
      // Fallback to static data if API fails
      const { allArticles } = await import('@/data/articles');
      let filteredArticles = allArticles;
      
      if (featured !== null) {
        filteredArticles = filteredArticles.filter(post => post.featured === featured);
      }
      
      if (categories) {
        filteredArticles = filteredArticles.filter(post => 
          post.category.toLowerCase() === categories.toLowerCase()
        );
      }
      
      setData(filteredArticles.slice((page - 1) * per_page, page * per_page));
    } finally {
      setLoading(false);
    }
  }, [page, per_page, categories, search, featured, enabled, totalPages]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      const nextPage = Math.floor(data.length / per_page) + 1;
      const response = await wordpressApi.getPosts({
        page: nextPage,
        per_page,
        categories,
        search,
        featured
      });

      setData(prev => [...prev, ...response]);
      setHasMore(nextPage < totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [data.length, per_page, categories, search, featured, loading, hasMore, totalPages]);

  return {
    posts: data,
    loading,
    error,
    hasMore,
    loadMore,
    refetch: fetchPosts
  };
};

// Hook for fetching single post
export const usePost = (slug, enabled = true) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !slug) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await wordpressApi.getPostBySlug(slug);
        setPost(response);
      } catch (err) {
        setError(err.message);
        // Fallback to static data
        const { allArticles } = await import('@/data/articles');
        const fallbackPost = allArticles.find(article => article.slug === slug);
        
        if (fallbackPost) {
          setPost({
            ...fallbackPost,
            content: `<p>This is a sample article about ${fallbackPost.title}. In a real implementation, this content would come from WordPress.</p>`
          });
        } else {
          setPost(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, enabled]);

  return { post, loading, error };
};

// Hook for categories
export const useCategories = (enabled = true) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await wordpressApi.getCategories();
        setCategories(response);
      } catch (err) {
        setError(err.message);
        // Fallback categories with dynamic counts from articles
        const { allArticles } = await import('@/data/articles');
        const categoryMap = {};
        
        // Count articles per category
        allArticles.forEach(article => {
          const categoryName = article.category;
          if (categoryMap[categoryName]) {
            categoryMap[categoryName]++;
          } else {
            categoryMap[categoryName] = 1;
          }
        });
        
        // Create categories array with dynamic counts
        const fallbackCategories = [
          { id: 1, name: 'AWS', slug: 'aws' },
          { id: 2, name: 'Snowflake', slug: 'snowflake' },
          { id: 3, name: 'Azure', slug: 'azure' },
          { id: 4, name: 'SQL', slug: 'sql' },
          { id: 5, name: 'Airflow', slug: 'airflow' },
          { id: 6, name: 'dbt', slug: 'dbt' },
          { id: 7, name: 'Python', slug: 'python' },
          { id: 8, name: 'Analytics', slug: 'analytics' },
        ].map(category => ({
          ...category,
          count: categoryMap[category.name] || 0
        }));
        
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [enabled]);

  return { categories, loading, error };
};

// Hook for newsletter subscription
export const useNewsletter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const subscribe = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await wordpressApi.subscribeNewsletter(email);
      setSuccess(true);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { subscribe, loading, error, success };
};

// Hook for contact form
export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitForm = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await wordpressApi.submitContactForm(formData);
      setSuccess(true);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitForm, loading, error, success };
};
