import { WORDPRESS_API_URL, API_ENDPOINTS } from '@/apiConfig';

const WP_API_BASE = `${WORDPRESS_API_URL}/wp-json/wp/v2`;

class WordPressAPI {
  constructor() {
    this.baseURL = WP_API_BASE;
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes - increased cache time
    this.requestQueue = new Map();
  }

  async fetchWithCache(endpoint, options = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if available and not expired
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
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
      console.log('WordPress API Request:', `${this.baseURL}${endpoint}`);
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
        ...options,
      });

      console.log('WordPress API Response Status:', response.status);
      
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
      console.log('WordPress API Data:', data);
      
      // Extract pagination info from headers
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
      const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0');
      
      // Cache the result
      const result = Array.isArray(data) ? { posts: data, totalPages, totalPosts } : data;
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Request timeout:', endpoint);
      } else {
        console.error('WordPress API Error:', error);
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
    featured = null 
  } = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      _embed: 'true', // Include featured images and categories
    });

    if (categoryId) {
      params.append('categories', categoryId.toString());
    }
    if (search) {
      params.append('search', search);
    }

    const result = await this.fetchWithCache(`/posts?${params.toString()}`);
    const posts = result.posts || result; // Handle both new and old response formats
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
    
    return {
      posts: transformedPosts,
      totalPages: result.totalPages || 1,
      totalPosts: result.totalPosts || transformedPosts.length
    };
  }

  // Get single post by slug
  async getPostBySlug(slug) {
    const result = await this.fetchWithCache(`/posts?slug=${slug}&_embed=true`);
    const posts = result.posts || result; // Handle both new and old response formats
    if (!posts || posts.length === 0) {
      throw new Error('Post not found');
    }
    return this.transformPost(posts[0]);
  }

  // Get categories
  async getCategories() {
    const categories = await this.fetchWithCache('/categories?per_page=100');
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      count: category.count,
      description: category.description,
    }));
  }

  // Get posts by category
  async getPostsByCategory(categoryId, { page = 1, per_page = 10 } = {}) {
    return this.getPosts({ page, per_page, categoryId });
  }

  // Get category ID by slug
  async getCategoryIdBySlug(categorySlug) {
    console.log('🔍 Looking for category slug:', categorySlug);
    
    try {
      // First attempt: try with cached categories
      let categories = await this.getCategories();
      console.log('📋 Available categories (cached):', categories.map(c => ({
        name: c.name, 
        slug: c.slug, 
        id: c.id,
        count: c.count
      })));
      
      let category = this.findCategoryBySlug(categories, categorySlug);
      
      if (!category) {
        console.log('⚠️ Category not found in cache, refreshing categories...');
        
        // Clear cache and fetch fresh categories
        this.clearCategoriesCache();
        categories = await this.getCategories();
        console.log('📋 Available categories (fresh):', categories.map(c => ({
          name: c.name, 
          slug: c.slug, 
          id: c.id,
          count: c.count
        })));
        
        // Second attempt: try with fresh categories
        category = this.findCategoryBySlug(categories, categorySlug);
      }
      
      if (!category) {
        const availableCategories = categories.map(c => ({name: c.name, slug: c.slug, id: c.id, count: c.count}));
        console.error(`❌ Category not found for slug: ${categorySlug}. Available categories:`, availableCategories);
        throw new Error(`Category "${categorySlug}" not found. Available categories: ${availableCategories.map(c => c.slug).join(', ')}`);
      }

      console.log('✅ Found category:', {name: category.name, slug: category.slug, id: category.id, count: category.count});
      return category.id;
    } catch (error) {
      console.error('❌ Error in getCategoryIdBySlug:', error);
      throw error;
    }
  }

  // Helper method to find category by slug with multiple matching strategies
  findCategoryBySlug(categories, categorySlug) {
    console.log('🔍 Searching for category slug:', categorySlug);
    console.log('📋 Available categories for matching:', categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: c.count
    })));
    
    const searchSlug = categorySlug.toLowerCase().trim();
    
    // Try multiple matching strategies
    const strategies = [
      // Exact slug match
      cat => cat.slug === searchSlug,
      // Case insensitive slug match
      cat => cat.slug.toLowerCase() === searchSlug,
      // Name to slug conversion match
      cat => cat.name.toLowerCase().replace(/\s+/g, '-') === searchSlug,
      // Direct name match
      cat => cat.name.toLowerCase() === searchSlug,
      // Partial slug match
      cat => cat.slug.toLowerCase().includes(searchSlug),
      // Partial name match
      cat => cat.name.toLowerCase().includes(searchSlug)
    ];
    
    for (let i = 0; i < strategies.length; i++) {
      const found = categories.find(strategies[i]);
      if (found) {
        console.log(`✅ Found category using strategy ${i + 1}:`, {
          id: found.id,
          name: found.name,
          slug: found.slug,
          count: found.count
        });
        return found;
      }
    }
    
    console.log('❌ No category found for slug:', searchSlug);
    return null;
  }

  // Helper method to clear categories from cache
  clearCategoriesCache() {
    const cacheKeys = Array.from(this.cache.keys());
    const categoryKeys = cacheKeys.filter(key => key.includes('/categories'));
    categoryKeys.forEach(key => {
      this.cache.delete(key);
      console.log('🗑️ Cleared cache key:', key);
    });
    
    // Also clear from request queue to force fresh requests
    const queueKeys = Array.from(this.requestQueue.keys());
    const categoryQueueKeys = queueKeys.filter(key => key.includes('/categories'));
    categoryQueueKeys.forEach(key => {
      this.requestQueue.delete(key);
      console.log('🗑️ Cleared request queue key:', key);
    });
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
    
    // Get the primary category, handling both single and multiple categories
    let primaryCategory = 'Uncategorized';
    if (categories.length > 0) {
      // Find the category that's not "Uncategorized" if multiple exist
      const nonUncategorized = categories.find(cat => cat.name !== 'Uncategorized');
      primaryCategory = nonUncategorized ? nonUncategorized.name : categories[0].name;
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
      image: featuredImage?.source_url || 'https://images.unsplash.com/photo-1595872018818-97555653a011',
      featured: wpPost.meta?.featured === '1' || false,
      trending: wpPost.meta?.trending === '1' || false,
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
  }
}

export const wordpressApi = new WordPressAPI();
export default wordpressApi;
