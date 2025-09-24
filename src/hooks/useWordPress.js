import { useState, useEffect, useCallback } from 'react';

// API Configuration - Update these values
const WORDPRESS_API_URL = 'https://app.dataengineerhub.blog';
const WP_API_BASE = `${WORDPRESS_API_URL}/wp-json/wp/v2`;

// WordPress API Class
class WordPressAPI {
  constructor() {
    this.baseURL = WP_API_BASE;
    this.cache = new Map();
    this.cacheTimeout = 10 * 1000; // 10 seconds for faster development updates
    this.requestQueue = new Map();
  }

  // Simple cache management
  clearCache(pattern = null) {
    if (pattern) {
      for (const [key] of this.cache.entries()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
    console.log('🧹 Cache cleared:', pattern || 'all');
  }

  // Enhanced request method with better error handling
  async makeRequest(endpoint, options = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
    
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('📦 Using cached data for:', endpoint);
      return cached.data;
    }

    try {
      console.log('📡 API Request:', `${this.baseURL}${endpoint}`);
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          ...options.headers,
        },
        signal: AbortSignal.timeout(15000),
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText || errorText}`);
      }

      const data = await response.json();
      
      const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0');
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
      
      const result = {
        data,
        totalPosts,
        totalPages,
        timestamp: Date.now()
      };

      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error('❌ API Request failed:', endpoint, error);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
  }

  // Enhanced getPosts function
  async getPosts({ 
    page = 1, 
    per_page = 10, 
    categoryId = null, 
    search = null,
    featured = null,
    trending = null
  } = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        _embed: 'true',
        status: 'publish'
      });

      if (categoryId) {
        params.append('categories', categoryId.toString());
      }
      if (search && search.trim()) {
        params.append('search', search.trim());
      }
      if (featured) {
        params.append('meta_key', 'featured');
        params.append('meta_value', '1');
      }
      if (trending) {
        params.append('meta_key', 'trending');
        params.append('meta_value', '1');
      }

      console.log('📋 Fetching posts with params:', Object.fromEntries(params));
      
      const result = await this.makeRequest(`/posts?${params.toString()}`);
      const posts = result.data;
      
      if (!Array.isArray(posts)) {
        console.error('❌ Expected array of posts, got:', typeof posts);
        return { posts: [], totalPages: 1, totalPosts: 0 };
      }

      const transformedPosts = this.transformPosts(posts);
      
      return {
        posts: transformedPosts,
        totalPages: result.totalPages,
        totalPosts: result.totalPosts
      };
    } catch (error) {
      console.error('❌ getPosts failed:', error);
      throw error;
    }
  }

  // Get categories
  async getCategories() {
    try {
      console.log('📂 Fetching categories...');
      
      const result = await this.makeRequest('/categories?per_page=100&hide_empty=false');
      const categories = result.data;
      
      if (!Array.isArray(categories)) {
        return [];
      }

      return categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        count: category.count || 0,
        description: category.description || '',
      }));
    } catch (error) {
      console.error('❌ getCategories failed:', error);
      throw error;
    }
  }

  // Enhanced category ID lookup
  async getCategoryIdBySlug(categorySlug) {
    try {
      console.log('🔍 Looking for category slug:', categorySlug);
      
      if (!categorySlug || typeof categorySlug !== 'string') {
        throw new Error('Invalid category slug provided');
      }
      
      const categories = await this.getCategories();
      
      const category = categories.find(cat => 
        cat.slug.toLowerCase() === categorySlug.toLowerCase() || 
        cat.name.toLowerCase() === categorySlug.toLowerCase()
      );

      if (category) {
        console.log('✅ Category found:', category.name, 'ID:', category.id);
        return category.id;
      } else {
        console.error('❌ Category not found:', categorySlug);
        throw new Error(`Category "${categorySlug}" not found`);
      }
    } catch (error) {
      console.error('❌ getCategoryIdBySlug failed:', error);
      throw error;
    }
  }

  // Get single post by slug
  async getPostBySlug(slug) {
    try {
      if (!slug || typeof slug !== 'string') {
        throw new Error('Invalid post slug provided');
      }

      console.log('🔍 Fetching post with slug:', slug);
      
      const result = await this.makeRequest(`/posts?slug=${slug}&_embed=true`);
      const posts = result.data;
      
      if (!Array.isArray(posts) || posts.length === 0) {
        throw new Error(`Post with slug "${slug}" not found`);
      }

      const transformedPost = this.transformPost(posts[0]);
      console.log('✅ Post found:', transformedPost.title);
      
      return transformedPost;
    } catch (error) {
      console.error('❌ getPostBySlug failed:', error);
      throw error;
    }
  }

  // Transform post data
  transformPost(wpPost) {
    try {
      const featuredMedia = wpPost._embedded?.['wp:featuredmedia']?.[0];
      let imageUrl = 'https://images.unsplash.com/photo-1595872018818-97555653a011?w=800&h=600&fit=crop';
      
      if (featuredMedia) {
        if (featuredMedia.media_details?.sizes?.large?.source_url) {
          imageUrl = featuredMedia.media_details.sizes.large.source_url;
        } else if (featuredMedia.media_details?.sizes?.medium_large?.source_url) {
          imageUrl = featuredMedia.media_details.sizes.medium_large.source_url;
        } else if (featuredMedia.source_url) {
          imageUrl = featuredMedia.source_url;
        }
      } else if (wpPost.jetpack_featured_media_url) {
        imageUrl = wpPost.jetpack_featured_media_url;
      }

      const categories = wpPost._embedded?.['wp:term']?.[0] || [];
      const primaryCategory = categories.find(cat => cat.name !== 'Uncategorized')?.name || categories[0]?.name || 'Uncategorized';

      const author = wpPost._embedded?.author?.[0]?.name || 'DataEngineer Hub';

      const featured = wpPost.meta?.featured === '1' || wpPost.meta?.featured === 1;
      const trending = wpPost.meta?.trending === '1' || wpPost.meta?.trending === 1;

      const excerpt = wpPost.excerpt?.rendered ? this.cleanExcerpt(wpPost.excerpt.rendered) : '';

      return {
        id: wpPost.id,
        slug: wpPost.slug,
        title: wpPost.title?.rendered || 'Untitled',
        excerpt: excerpt,
        content: wpPost.content?.rendered || '',
        category: primaryCategory,
        readTime: this.calculateReadTime(wpPost.content?.rendered || ''),
        date: wpPost.date,
        image: imageUrl,
        featured: featured,
        trending: trending,
        author: author,
      };
    } catch (error) {
      console.error('❌ transformPost failed:', error);
      // Return a basic post object to prevent crashes
      return {
        id: wpPost.id || 0,
        slug: wpPost.slug || '',
        title: wpPost.title?.rendered || 'Untitled',
        excerpt: '',
        content: wpPost.content?.rendered || '',
        category: 'Uncategorized',
        readTime: '1 min read',
        date: wpPost.date || new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1595872018818-97555653a011?w=800&h=600&fit=crop',
        featured: false,
        trending: false,
        author: 'DataEngineer Hub',
      };
    }
  }

  transformPosts(wpPosts) {
    return wpPosts.map(post => this.transformPost(post));
  }

  cleanExcerpt(excerpt) {
    return excerpt.replace(/<[^>]*>/g, '').replace(/\[&hellip;\]/g, '...').trim();
  }

  calculateReadTime(content) {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
    return `${Math.max(1, Math.ceil(wordCount / wordsPerMinute))} min read`;
  }

  // Newsletter subscription
  async subscribeNewsletter(email) {
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Please provide a valid email address');
      }

      console.log('📧 Subscribing email:', email);
      
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      console.error('❌ Newsletter subscription failed:', error);
      throw error;
    }
  }

  // Contact form submission
  async submitContactForm(formData) {
    try {
      const { name, email, message } = formData;
      
      if (!name || !email || !message) {
        throw new Error('Please fill in all required fields');
      }

      if (!email.includes('@')) {
        throw new Error('Please provide a valid email address');
      }

      console.log('📝 Submitting contact form:', { name, email });
      
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      console.error('❌ Contact form submission failed:', error);
      throw error;
    }
  }
}

// Create API instance
const wordpressApi = new WordPressAPI();

// REACT HOOKS

// Hook for fetching posts - ENHANCED & FIXED
export const usePosts = ({ 
  page = 1, 
  per_page = 10, 
  categorySlug = null,
  search = null, 
  featured = null,
  enabled = true 
} = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchPosts = useCallback(async (forceRefresh = false) => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      if (!forceRefresh) {
        setLoading(true);
      }

      console.log('🔄 usePosts: Fetching posts with params:', { 
        page, per_page, categorySlug, search, featured, forceRefresh 
      });

      let categoryId = null;
      
      // Convert category slug to ID if provided
      if (categorySlug) {
        console.log('🏷️ Converting category slug to ID:', categorySlug);
        try {
          categoryId = await wordpressApi.getCategoryIdBySlug(categorySlug);
          console.log('✅ Category ID resolved:', categoryId);
        } catch (categoryError) {
          console.error('❌ Category resolution failed:', categoryError);
          throw new Error(`Category "${categorySlug}" not found. Please check if the category exists.`);
        }
      }

      // Clear cache if force refresh
      if (forceRefresh) {
        wordpressApi.clearCache();
      }

      const result = await wordpressApi.getPosts({ 
        page, 
        per_page, 
        categoryId,
        search, 
        featured
      });

      setPosts(result.posts);
      setTotalPages(result.totalPages);
      setTotalPosts(result.totalPosts);
      setHasMore(page < result.totalPages);

      console.log('✅ usePosts: Posts loaded successfully:', {
        postsCount: result.posts.length,
        totalPages: result.totalPages,
        totalPosts: result.totalPosts,
        hasMore: page < result.totalPages
      });
    } catch (err) {
      console.error('❌ usePosts: Error fetching posts:', err);
      setError(err.message);
      setPosts([]);
      setTotalPages(1);
      setTotalPosts(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, per_page, categorySlug, search, featured, enabled]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    console.log('🔄 Manual refresh triggered');
    await fetchPosts(true);
  }, [fetchPosts]);

  // Load more function for pagination
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      
      let categoryId = null;
      if (categorySlug) {
        categoryId = await wordpressApi.getCategoryIdBySlug(categorySlug);
      }
      
      const nextPage = page + 1;
      const result = await wordpressApi.getPosts({
        page: nextPage,
        per_page,
        categoryId,
        search,
        featured
      });

      setPosts(prev => [...prev, ...result.posts]);
      setHasMore(nextPage < result.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, per_page, categorySlug, search, featured, loading, hasMore]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { 
    posts, 
    loading, 
    error, 
    totalPages, 
    totalPosts,
    hasMore,
    refresh,
    loadMore,
    refetch: fetchPosts
  };
};

// Hook for fetching a single post - ENHANCED
export const usePost = (slug, enabled = true) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = useCallback(async (forceRefresh = false) => {