import { WORDPRESS_API_URL, API_ENDPOINTS } from '@/apiConfig';

const WP_API_BASE = `${WORDPRESS_API_URL}/wp-json/wp/v2`;

class WordPressAPI {
  constructor() {
    this.baseURL = WP_API_BASE;
    this.cache = new Map();
    this.cacheTimeout = 2 * 60 * 1000; // Reduced to 2 minutes for faster updates
    this.requestQueue = new Map();
    this.lastCacheTime = new Map();
    this.forceRefresh = false;
  }

  // Force refresh next request (useful after post updates)
  invalidateCache(pattern = null) {
    console.log('🧹 Invalidating cache', pattern ? `for pattern: ${pattern}` : '(all)');
    if (pattern) {
      // Clear specific cache entries matching pattern
      for (const [key, value] of this.cache.entries()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
          this.lastCacheTime.delete(key);
          console.log(`🗑️ Cleared cache key: ${key}`);
        }
      }
    } else {
      // Clear all cache
      this.cache.clear();
      this.lastCacheTime.clear();
      console.log('🗑️ Cleared all cache');
    }
  }

  // Set force refresh flag
  setForceRefresh(value = true) {
    this.forceRefresh = value;
    console.log('🔄 Force refresh set to:', value);
  }

  async fetchWithCache(endpoint, options = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    const cacheTime = this.lastCacheTime.get(cacheKey) || 0;
    const now = Date.now();
    
    // Check if we should use cache
    const shouldUseCache = cached && 
                          !this.forceRefresh && 
                          (now - cacheTime < this.cacheTimeout);
    
    // Return cached data if available and not expired
    if (shouldUseCache) {
      console.log('📦 Using cached data for:', endpoint);
      return cached.data;
    }

    // Reset force refresh flag after use
    if (this.forceRefresh) {
      this.forceRefresh = false;
      console.log('🔄 Force refresh flag reset');
    }

    // Prevent duplicate requests
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey);
    }

    const requestPromise = this.makeRequest(endpoint, options, cacheKey);
    this.requestQueue.set(cacheKey, requestPromise);
    
    try {
      const result = await requestPromise;
      this.requestQueue.delete(cacheKey);
      return result;
    } catch (error) {
      this.requestQueue.delete(cacheKey);
      throw error;
    }
  }

  async makeRequest(endpoint, options, cacheKey) {
    try {
      console.log('📡 WordPress API Request:', `${this.baseURL}${endpoint}`);
      
      // Add cache-busting parameter to ensure fresh data
      const separator = endpoint.includes('?') ? '&' : '?';
      const cacheBuster = `${separator}_t=${Date.now()}`;
      
      const response = await fetch(`${this.baseURL}${endpoint}${cacheBuster}`, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          ...options.headers,
        },
        signal: AbortSignal.timeout(15000), // Increased timeout
        ...options,
      });

      console.log('📡 WordPress API Response Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          }
          if (errorData.data && errorData.data.params) {
            errorMessage += ` - ${JSON.stringify(errorData.data.params)}`;
          }
        } catch (e) {
          errorMessage += ` - ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('📡 WordPress API Data received:', Array.isArray(data) ? `${data.length} items` : 'single item');
      
      // Extract pagination info from headers
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
      const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0');
      
      // Cache the result with timestamp
      const result = Array.isArray(data) ? { posts: data, totalPages, totalPosts } : data;
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });
      this.lastCacheTime.set(cacheKey, Date.now());

      console.log('💾 Cached result for:', endpoint);
      return result;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('⏰ Request timeout:', endpoint);
      } else {
        console.error('❌ WordPress API Error:', error);
      }
      throw error;
    }
  }

  // Get all posts with pagination
  async getPosts({ 
    page = 1, 
    per_page = 10, 
    categoryId = null, 
    search = null,
    featured = null,
    forceRefresh = false
  } = {}) {
    if (forceRefresh) {
      this.setForceRefresh(true);
    }

    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      _embed: 'true',
    });

    if (categoryId) {
      params.append('categories', categoryId.toString());
    }
    if (search) {
      params.append('search', search);
    }

    console.log('📋 Fetching posts with params:', Object.fromEntries(params));
    const result = await this.fetchWithCache(`/posts?${params.toString()}`);
    const posts = result.posts || result;
    const transformedPosts = this.transformPosts(posts);
    
    // Filter featured posts after transformation if needed
    if (featured !== null) {
      const filteredPosts = transformedPosts.filter(post => post.featured === featured);
      return {
        posts: filteredPosts,
        totalPages: result.totalPages || 1,
        totalPosts: filteredPosts.length
      };
    }
    
    console.log('✅ Returning posts:', transformedPosts.length);
    return {
      posts: transformedPosts,
      totalPages: result.totalPages || 1,
      totalPosts: result.totalPosts || transformedPosts.length
    };
  }

  // Get single post by slug
  async getPostBySlug(slug, forceRefresh = false) {
    if (forceRefresh) {
      this.setForceRefresh(true);
    }

    const result = await this.fetchWithCache(`/posts?slug=${slug}&_embed=true`);
    const posts = result.posts || result;
    if (!posts || posts.length === 0) {
      throw new Error('Post not found');
    }
    return this.transformPost(posts[0]);
  }

  // Get categories with force refresh option
  async getCategories(forceRefresh = false) {
    console.log('📡 getCategories() called with forceRefresh:', forceRefresh);
    
    if (forceRefresh) {
      this.setForceRefresh(true);
      this.invalidateCache('categories');
    }
    
    const fetchedResult = await this.fetchWithCache('/categories?per_page=100');
    console.log('📡 getCategories() raw response:', fetchedResult);
    
    // Extract categories array from result
    let categoriesArray;
    if (Array.isArray(fetchedResult)) {
      categoriesArray = fetchedResult;
      console.log('📡 getCategories() using direct array response');
    } else if (fetchedResult && Array.isArray(fetchedResult.posts)) {
      categoriesArray = fetchedResult.posts;
      console.log('📡 getCategories() extracting from wrapped response');
    } else {
      categoriesArray = [];
      console.log('📡 getCategories() fallback to empty array');
    }
    
    const transformedCategories = categoriesArray.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      count: category.count,
      description: category.description,
    }));
    
    console.log('📡 getCategories() transformed:', transformedCategories.length, 'categories');
    console.log('📊 Category counts:', transformedCategories.map(c => `${c.name}: ${c.count}`).join(', '));
    return transformedCategories;
  }

  // Get posts by category
  async getPostsByCategory(categoryId, { page = 1, per_page = 10, forceRefresh = false } = {}) {
    return this.getPosts({ page, per_page, categoryId, forceRefresh });
  }

  // Get category ID by slug with better error handling and refresh capability
  async getCategoryIdBySlug(categorySlug, forceRefresh = false) {
    console.log('🔍 getCategoryIdBySlug called with:', {
      categorySlug,
      forceRefresh,
      type: typeof categorySlug,
    });
    
    try {
      // First attempt: try with current cache
      let categories = await this.getCategories(forceRefresh);
      console.log('📋 Categories found:', categories.length);
      
      let category = this.findCategoryBySlug(categories, categorySlug);
      console.log('🎯 findCategoryBySlug result (first attempt):', category);
      
      if (!category && !forceRefresh) {
        console.log('⚠️ Category not found, trying with fresh data...');
        
        // Second attempt: force refresh
        categories = await this.getCategories(true);
        console.log('📋 Fresh categories after refresh:', categories.length);
        
        category = this.findCategoryBySlug(categories, categorySlug);
        console.log('🎯 findCategoryBySlug result (second attempt):', category);
      }
      
      if (!category) {
        const availableCategories = categories.map(c => ({
          name: c.name, 
          slug: c.slug, 
          id: c.id, 
          count: c.count
        }));
        console.error('❌ FINAL FAILURE: Category lookup failed');
        console.error('❌ Searched for:', categorySlug);
        console.error('❌ Available categories:', availableCategories);
        throw new Error(`Category "${categorySlug}" not found. Available categories: ${availableCategories.map(c => c.slug).join(', ')}`);
      }

      console.log('✅ Found category:', {
        name: category.name, 
        slug: category.slug, 
        id: category.id, 
        count: category.count
      });
      return category.id;
    } catch (error) {
      console.error('❌ Error in getCategoryIdBySlug:', error);
      throw error;
    }
  }

  // Helper method to find category by slug with multiple matching strategies
  findCategoryBySlug(categories, categorySlug) {
    console.log('🔍 Finding category for slug:', categorySlug);
    console.log('📋 Available categories:', categories.map(c => ({ name: c.name, slug: c.slug, count: c.count })));
    
    const searchSlug = categorySlug.toLowerCase().trim();
    
    // Enhanced matching strategies
    const strategies = [
      { name: 'exact-slug', fn: cat => cat.slug === searchSlug },
      { name: 'case-insensitive-slug', fn: cat => cat.slug.toLowerCase() === searchSlug },
      { name: 'name-to-slug', fn: cat => cat.name.toLowerCase().replace(/\s+/g, '-') === searchSlug },
      { name: 'direct-name', fn: cat => cat.name.toLowerCase() === searchSlug },
      { name: 'partial-slug', fn: cat => cat.slug.toLowerCase().includes(searchSlug) },
      { name: 'partial-name', fn: cat => cat.name.toLowerCase().includes(searchSlug) }
    ];
    
    // Try each strategy
    for (const strategy of strategies) {
      console.log(`🔄 Trying strategy: ${strategy.name}`);
      
      const match = categories.find(cat => {
        try {
          return strategy.fn(cat);
        } catch (error) {
          console.log(`❌ Strategy "${strategy.name}" failed:`, error.message);
          return false;
        }
      });
      
      if (match) {
        console.log(`✅ Found match using strategy "${strategy.name}":`, {
          id: match.id,
          name: match.name,
          slug: match.slug,
          count: match.count
        });
        return match;
      }
    }
    
    console.log('❌ No category found for slug:', searchSlug);
    return null;
  }

  // Helper method to clear specific cache patterns
  clearCategoriesCache() {
    this.invalidateCache('categories');
  }

  // Subscribe to newsletter (custom endpoint)
  async subscribeNewsletter(email) {
    try {
      const response = await fetch(`${this.baseURL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      throw error;
    }
  }

  // Contact form submission (custom endpoint)
  async submitContactForm(formData) {
    try {
      const response = await fetch(`${this.baseURL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Contact form submission failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Contact form error:', error);
      throw error;
    }
  }

  // Transform WordPress post data to match your current structure
  transformPost(wpPost) {
    const featuredImage = wpPost._embedded?.['wp:featuredmedia']?.[0];
    const categories = wpPost._embedded?.['wp:term']?.[0] || [];
    
    console.log('🖼️ Processing post images for:', wpPost.title?.rendered);
    
    // Get the primary category, handling both single and multiple categories
    let primaryCategory = 'Uncategorized';
    if (categories.length > 0) {
      // Find the category that's not "Uncategorized" if multiple exist
      const nonUncategorized = categories.find(cat => cat.name !== 'Uncategorized');
      primaryCategory = nonUncategorized ? nonUncategorized.name : categories[0].name;
    }

    // Enhanced image handling with multiple fallbacks
    let imageUrl = 'https://images.unsplash.com/photo-1595872018818-97555653a011?w=800&h=600&fit=crop';
    
    if (featuredImage?.source_url) {
      imageUrl = featuredImage.source_url;
      console.log('✅ Using WordPress featured image:', imageUrl);
    } else {
      console.log('⚠️ No featured image found, using fallback:', imageUrl);
    }

    return {
      id: wpPost.id,
      slug: wpPost.slug,
      title: wpPost.title.rendered,
      excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').trim(),
      content: wpPost.content.rendered,
      category: primaryCategory,
      readTime: this.calculateReadTime(wpPost.content.rendered),
      date: wpPost.date,
      image: imageUrl,
      featured: wpPost.meta?.featured === '1' || wpPost.featured === true || false,
      trending: wpPost.meta?.trending === '1' || wpPost.trending === true || false,
      author: wpPost._embedded?.author?.[0]?.name || 'DataEngineer Hub',
    };
  }

  transformPosts(wpPosts) {
    return wpPosts.map(post => this.transformPost(post));
  }

  calculateReadTime(content) {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    this.lastCacheTime.clear();
    console.log('🧹 All cache cleared');
  }

  // Get cache status for debugging
  getCacheStatus() {
    return {
      cacheSize: this.cache.size,
      requestQueueSize: this.requestQueue.size,
      cacheKeys: Array.from(this.cache.keys()),
      forceRefresh: this.forceRefresh
    };
  }
}

export const wordpressApi = new WordPressAPI();
export default wordpressApi;