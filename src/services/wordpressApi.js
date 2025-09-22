import { WORDPRESS_API_URL, API_ENDPOINTS } from '@/apiConfig';

const WP_API_BASE = `${WORDPRESS_API_URL}/wp-json/wp/v2`;

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

  // Enhanced request method with proper header extraction
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
      
      // Extract pagination headers
      const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0');
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
      
      console.log('✅ API Response received:', {
        dataType: Array.isArray(data) ? `${data.length} items` : typeof data,
        totalPosts,
        totalPages
      });

      const result = {
        data,
        totalPosts,
        totalPages,
        timestamp: Date.now()
      };

      // Cache the result
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error('❌ API Request failed:', endpoint, error);
      throw error;
    }
  }

  // Get posts with proper pagination
  async getPosts({ 
    page = 1, 
    per_page = 10, 
    categoryId = null, 
    search = null,
    featured = null,
    trending = null // Add trending parameter
  } = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      _embed: 'true',
      status: 'publish'
    });

    if (categoryId) {
      params.append('categories', categoryId.toString());
    }
    if (search) {
      params.append('search', search);
    }
    // Add these lines for server-side filtering
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
    
    // The client-side filtering is no longer needed here, so we can remove it.

    console.log('✅ Posts processed:', {
      total: transformedPosts.length,
      totalPages: result.totalPages,
      totalPosts: result.totalPosts
    });
    
    return {
      posts: transformedPosts, // Return the posts directly
      totalPages: result.totalPages,
      totalPosts: result.totalPosts
    };
  }

  // Get categories with proper error handling
  async getCategories() {
    console.log('📂 Fetching categories...');
    
    const result = await this.makeRequest('/categories?per_page=100&hide_empty=false');
    const categories = result.data;
    
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

  // Get category ID by slug with better matching
  async getCategoryIdBySlug(categorySlug) {
    console.log('🔍 Looking for category slug:', categorySlug);
    
    const categories = await this.getCategories();
    
    // Try exact slug match first
    let category = categories.find(cat => cat.slug === categorySlug);
    
    // If not found, try case-insensitive slug match
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
      console.log('📋 Available categories:', categories.map(c => `${c.slug}(${c.count})`).join(', '));
      throw new Error(`Category "${categorySlug}" not found`);
    }
  }

  // Get posts by category
  async getPostsByCategory(categoryId, options = {}) {
    console.log('📂 Getting posts for category ID:', categoryId);
    return this.getPosts({ ...options, categoryId });
  }

  // Get single post by slug
  async getPostBySlug(slug) {
    console.log('📄 Fetching post by slug:', slug);
    
    const result = await this.makeRequest(`/posts?slug=${slug}&_embed=true`);
    const posts = result.data;
    
    if (!Array.isArray(posts) || posts.length === 0) {
      throw new Error(`Post with slug "${slug}" not found`);
    }

    return this.transformPost(posts[0]);
  }

  // Enhanced post transformation
  transformPost(wpPost) {
    // Get featured image with better fallback
    const featuredImage = wpPost._embedded?.['wp:featuredmedia']?.[0];
    let imageUrl = 'https://images.unsplash.com/photo-1595872018818-97555653a011?w=800&h=600&fit=crop';
    
    // Try multiple sources for featured image
    if (wpPost.featured_image_url) {
      imageUrl = wpPost.featured_image_url;
    } else if (featuredImage?.source_url) {
      imageUrl = featuredImage.source_url;
    } else if (featuredImage?.media_details?.sizes?.large?.source_url) {
      imageUrl = featuredImage.media_details.sizes.large.source_url;
    } else if (featuredImage?.media_details?.sizes?.medium?.source_url) {
      imageUrl = featuredImage.media_details.sizes.medium.source_url;
    }

    // Get categories with better handling
    const categories = wpPost._embedded?.['wp:term']?.[0] || [];
    let primaryCategory = 'Uncategorized';
    if (categories.length > 0) {
      const nonUncategorized = categories.find(cat => cat.name !== 'Uncategorized');
      primaryCategory = nonUncategorized ? nonUncategorized.name : categories[0].name;
    }

    // Get author
    const author = wpPost._embedded?.author?.[0]?.name || 'DataEngineer Hub';

    // Enhanced meta field handling - check multiple sources
    const featured = wpPost.featured === true || 
                    wpPost.featured === 1 || 
                    wpPost.featured === '1' || 
                    wpPost.meta?.featured === '1' ||
                    wpPost.meta?.featured === 1;
                    
    const trending = wpPost.trending === true || 
                    wpPost.trending === 1 || 
                    wpPost.trending === '1' || 
                    wpPost.meta?.trending === '1' ||
                    wpPost.meta?.trending === 1;

    // Use plain excerpt if available, otherwise clean the rendered excerpt
    let excerpt = '';
    if (wpPost.excerpt_plain) {
      excerpt = wpPost.excerpt_plain;
    } else if (wpPost.excerpt?.rendered) {
      excerpt = this.cleanExcerpt(wpPost.excerpt.rendered);
    }

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