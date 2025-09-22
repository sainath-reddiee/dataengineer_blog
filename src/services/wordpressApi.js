import { WORDPRESS_API_URL, API_ENDPOINTS } from '@/apiConfig';

const WP_API_BASE = `${WORDPRESS_API_URL}/wp-json/wp/v2`;

class WordPressAPI {
  constructor() {
    this.baseURL = WP_API_BASE;
    this.cache = new Map();
    this.cacheTimeout = 1 * 60 * 1000; // 1 minute cache for faster updates
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

  // Core request method - simplified
  async makeRequest(endpoint, options = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
    
    // Check cache first
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
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Response received:', Array.isArray(data) ? `${data.length} items` : typeof data);

      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error('❌ API Request failed:', endpoint, error);
      throw error;
    }
  }

  // Get posts - SIMPLIFIED
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
      _embed: 'true',
    });

    if (categoryId) {
      params.append('categories', categoryId.toString());
    }
    if (search) {
      params.append('search', search);
    }

    console.log('📋 Fetching posts with params:', Object.fromEntries(params));
    
    const posts = await this.makeRequest(`/posts?${params.toString()}`);
    
    if (!Array.isArray(posts)) {
      console.error('❌ Expected array of posts, got:', typeof posts);
      return { posts: [], totalPages: 1, totalPosts: 0 };
    }

    const transformedPosts = this.transformPosts(posts);
    
    // Filter featured posts if needed
    let filteredPosts = transformedPosts;
    if (featured === true) {
      filteredPosts = transformedPosts.filter(post => post.featured === true);
    } else if (featured === false) {
      filteredPosts = transformedPosts.filter(post => post.featured !== true);
    }

    console.log('✅ Posts processed:', filteredPosts.length);
    
    return {
      posts: filteredPosts,
      totalPages: 1, // Simplified for now
      totalPosts: filteredPosts.length
    };
  }

  // Get categories - SIMPLIFIED
  async getCategories() {
    console.log('📂 Fetching categories...');
    
    const categories = await this.makeRequest('/categories?per_page=100');
    
    if (!Array.isArray(categories)) {
      console.error('❌ Expected array of categories, got:', typeof categories);
      return [];
    }

    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      count: category.count || 0,
      description: category.description || '',
    }));

    console.log('📂 Categories loaded:', transformedCategories.length);
    console.log('📊 Category data:', transformedCategories.map(c => `${c.name}(${c.count})`).join(', '));
    
    return transformedCategories;
  }

  // Get category ID by slug - MUCH SIMPLIFIED
  async getCategoryIdBySlug(categorySlug) {
    console.log('🔍 Looking for category slug:', categorySlug);
    
    const categories = await this.getCategories();
    
    // Simple exact match first
    let category = categories.find(cat => cat.slug === categorySlug);
    
    // If not found, try case-insensitive
    if (!category) {
      category = categories.find(cat => cat.slug.toLowerCase() === categorySlug.toLowerCase());
    }
    
    // If still not found, try name matching
    if (!category) {
      category = categories.find(cat => cat.name.toLowerCase() === categorySlug.toLowerCase());
    }

    if (category) {
      console.log('✅ Found category:', category.name, 'ID:', category.id, 'Count:', category.count);
      return category.id;
    } else {
      console.error('❌ Category not found:', categorySlug);
      console.log('📋 Available categories:', categories.map(c => c.slug).join(', '));
      throw new Error(`Category "${categorySlug}" not found`);
    }
  }

  // Get posts by category - SIMPLIFIED
  async getPostsByCategory(categoryId, options = {}) {
    console.log('📂 Getting posts for category ID:', categoryId);
    return this.getPosts({ ...options, categoryId });
  }

  // Get single post by slug
  async getPostBySlug(slug) {
    console.log('📄 Fetching post by slug:', slug);
    
    const posts = await this.makeRequest(`/posts?slug=${slug}&_embed=true`);
    
    if (!Array.isArray(posts) || posts.length === 0) {
      throw new Error(`Post with slug "${slug}" not found`);
    }

    return this.transformPost(posts[0]);
  }

  // Transform post data - SIMPLIFIED
  transformPost(wpPost) {
    // Get featured image
    const featuredImage = wpPost._embedded?.['wp:featuredmedia']?.[0];
    let imageUrl = 'https://images.unsplash.com/photo-1595872018818-97555653a011?w=800&h=600&fit=crop';
    
    if (featuredImage?.source_url) {
      imageUrl = featuredImage.source_url;
    }

    // Get categories
    const categories = wpPost._embedded?.['wp:term']?.[0] || [];
    let primaryCategory = 'Uncategorized';
    if (categories.length > 0) {
      const nonUncategorized = categories.find(cat => cat.name !== 'Uncategorized');
      primaryCategory = nonUncategorized ? nonUncategorized.name : categories[0].name;
    }

    // Get author
    const author = wpPost._embedded?.author?.[0]?.name || 'DataEngineer Hub';

    return {
      id: wpPost.id,
      slug: wpPost.slug,
      title: wpPost.title?.rendered || 'Untitled',
      excerpt: this.cleanExcerpt(wpPost.excerpt?.rendered || ''),
      content: wpPost.content?.rendered || '',
      category: primaryCategory,
      readTime: this.calculateReadTime(wpPost.content?.rendered || ''),
      date: wpPost.date,
      image: imageUrl,
      featured: wpPost.featured === true || wpPost.featured === '1', // Handle both boolean and string
      trending: wpPost.trending === true || wpPost.trending === '1',
      author: author,
    };
  }

  transformPosts(wpPosts) {
    return wpPosts.map(post => this.transformPost(post));
  }

  cleanExcerpt(excerpt) {
    return excerpt.replace(/<[^>]*>/g, '').trim();
  }

  calculateReadTime(content) {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  }

  // Newsletter subscription
  async subscribeNewsletter(email) {
    try {
      const response = await fetch(`${this.baseURL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Subscription failed');
      return await response.json();
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      throw error;
    }
  }

  // Contact form submission
  async submitContactForm(formData) {
    try {
      const response = await fetch(`${this.baseURL}/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Contact form submission failed');
      return await response.json();
    } catch (error) {
      console.error('Contact form error:', error);
      throw error;
    }
  }
}

export const wordpressApi = new WordPressAPI();
export default wordpressApi;