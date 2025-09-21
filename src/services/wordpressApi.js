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
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
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
    categories = null, 
    search = null,
    featured = null 
  } = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      _embed: 'true', // Include featured images and categories
    });

    if (categories) {
      params.append('categories', categories);
    }
    if (search) {
      params.append('search', search);
    }

    const posts = await this.fetchWithCache(`/posts?${params.toString()}`);
    const transformedPosts = this.transformPosts(posts);
    
    // Filter featured posts after transformation if needed
    if (featured !== null) {
      return transformedPosts.filter(post => post.featured === featured);
    }
    
    return transformedPosts;
  }

  // Get single post by slug
  async getPostBySlug(slug) {
    const posts = await this.fetchWithCache(`/posts?slug=${slug}&_embed=true`);
    if (posts.length === 0) {
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
  async getPostsByCategory(categorySlug, { page = 1, per_page = 10 } = {}) {
    const categories = await this.getCategories();
    console.log('Available categories:', categories);
    console.log('Looking for category:', categorySlug);
    
    const category = categories.find(cat => 
      cat.slug === categorySlug || 
      cat.slug === categorySlug.toLowerCase() ||
      cat.name.toLowerCase() === categorySlug.toLowerCase() ||
      cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase()
    );
    
    if (!category) {
      console.warn(`Category not found for slug: ${categorySlug}`);
      // Return empty results instead of throwing error
      return [];
    }

    console.log('Found category:', category);
    return this.getPosts({ page, per_page, categories: category.id });
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
