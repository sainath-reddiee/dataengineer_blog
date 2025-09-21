import { useState, useEffect, useCallback } from 'react';
import wordpressApi from '@/services/wordpressApi';

// Hook for fetching posts
export const usePosts = ({ 
  page = 1, 
  per_page = 10, 
  categorySlug = null, 
  search = null,
  featured = null,
  enabled = true 
} = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = useCallback(async () => {
    if (!enabled) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching posts with params:', { page, per_page, categorySlug, search, featured });
      
      let categoryId = null;
      if (categorySlug) {
        try {
          categoryId = await wordpressApi.getCategoryIdBySlug(categorySlug);
          console.log(`Category "${categorySlug}" resolved to ID: ${categoryId}`);
        } catch (categoryError) {
          console.error('Category resolution error:', categoryError);
          throw new Error(`Category "${categorySlug}" not found. Please check if the category exists in WordPress.`);
        }
      }

      const response = await wordpressApi.getPosts({
        page,
        per_page,
        categoryId,
        search,
        featured
      });
      console.log('WordPress API response:', response);
      setData(response.posts);
      setTotalPages(response.totalPages);
      setTotalPosts(response.totalPosts);
      setHasMore(page < response.totalPages);
    } catch (err) {
      console.error('WordPress API Error:', err);
      setError(err.message);
      setData([]);
      setTotalPages(0);
      setTotalPosts(0);
    } finally {
      setLoading(false);
    }
  }, [page, per_page, categorySlug, search, featured, enabled]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      
      let categoryId = null;
      if (categorySlug) {
        categoryId = await wordpressApi.getCategoryIdBySlug(categorySlug);
      }
      
      const nextPage = Math.floor(data.length / per_page) + 1;
      const response = await wordpressApi.getPosts({
        page: nextPage,
        per_page,
        categoryId,
        search,
        featured
      });

      setData(prev => [...prev, ...response.posts]);
      setHasMore(nextPage < response.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [data.length, per_page, categorySlug, search, featured, loading, hasMore, totalPages]);

  return {
    posts: data,
    loading,
    error,
    hasMore,
    totalPages,
    totalPosts,
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
        console.error('Post fetch error:', err);
        setError(err.message);
        setPost(null);
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
        console.error('Categories fetch error:', err);
        setError(err.message);
        setCategories([]);
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
