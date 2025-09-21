import { useState, useEffect, useCallback } from 'react';
import wordpressApi from '@/services/wordpressApi';

// Hook for fetching posts with enhanced refresh capabilities
export const usePosts = ({ 
  page = 1, 
  per_page = 10, 
  categoryId = null, 
  search = null, 
  featured = null 
} = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = useCallback(async (forceRefresh = false) => {
    try {
      setError(null);
      if (!forceRefresh) {
        setLoading(true);
      }

      console.log('🔄 usePosts: Fetching posts with params:', { 
        page, per_page, categoryId, search, featured, forceRefresh 
      });

      const result = await wordpressApi.getPosts({ 
        page, 
        per_page, 
        categoryId, 
        search, 
        featured,
        forceRefresh 
      });

      setPosts(result.posts);
      setTotalPages(result.totalPages);
      setTotalPosts(result.totalPosts);

      console.log('✅ usePosts: Posts loaded successfully:', result.posts.length);
    } catch (err) {
      console.error('❌ usePosts: Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, per_page, categoryId, search, featured]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    await fetchPosts(true);
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { 
    posts, 
    loading, 
    error, 
    totalPages, 
    totalPosts, 
    refresh 
  };
};

// Hook for fetching a single post
export const usePost = (slug) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = useCallback(async (forceRefresh = false) => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      if (!forceRefresh) {
        setLoading(true);
      }

      console.log('📄 usePost: Fetching post with slug:', slug);

      const postData = await wordpressApi.getPostBySlug(slug, forceRefresh);
      setPost(postData);

      console.log('✅ usePost: Post loaded successfully:', postData.title);
    } catch (err) {
      console.error('❌ usePost: Error fetching post:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    await fetchPost(true);
  }, [fetchPost]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, loading, error, refresh };
};

// Hook for fetching categories with refresh capability
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async (forceRefresh = false) => {
    try {
      setError(null);
      if (!forceRefresh) {
        setLoading(true);
      }

      console.log('📂 useCategories: Fetching categories with forceRefresh:', forceRefresh);

      const categoriesData = await wordpressApi.getCategories(forceRefresh);
      setCategories(categoriesData);

      console.log('✅ useCategories: Categories loaded successfully:', categoriesData.length);
    } catch (err) {
      console.error('❌ useCategories: Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Manual refresh function
  const refresh = useCallback(async () => {
    await fetchCategories(true);
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refresh };
};

// Hook for posts by category with enhanced refresh
export const usePostsByCategory = (categorySlug, { page = 1, per_page = 10 } = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [categoryId, setCategoryId] = useState(null);

  const fetchPostsByCategory = useCallback(async (forceRefresh = false) => {
    if (!categorySlug) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      if (!forceRefresh) {
        setLoading(true);
      }

      console.log('📂 usePostsByCategory: Fetching posts for category:', categorySlug);

      // Get category ID first
      const catId = await wordpressApi.getCategoryIdBySlug(categorySlug, forceRefresh);
      setCategoryId(catId);

      // Fetch posts for the category
      const result = await wordpressApi.getPostsByCategory(catId, { 
        page, 
        per_page, 
        forceRefresh 
      });

      setPosts(result.posts);
      setTotalPages(result.totalPages);
      setTotalPosts(result.totalPosts);

      console.log('✅ usePostsByCategory: Posts loaded successfully:', result.posts.length);
    } catch (err) {
      console.error('❌ usePostsByCategory: Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, page, per_page]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    await fetchPostsByCategory(true);
  }, [fetchPostsByCategory]);

  useEffect(() => {
    fetchPostsByCategory();
  }, [fetchPostsByCategory]);

  return { 
    posts, 
    loading, 
    error, 
    totalPages, 
    totalPosts, 
    categoryId, 
    refresh 
  };
};