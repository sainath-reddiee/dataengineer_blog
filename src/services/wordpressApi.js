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

  // Enhanced request method
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
        throw new Error(`HTTP ${response.status}: ${errorText}`);
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
      throw error;
    }
  }

  // Corrected getPosts function with server-side filtering
  async getPosts({ 
    page = 1, 
    per_page = 10, 
    categoryId = null, 
    search = null,
    featured = null,
    trending = null
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
  }

  // Get categories
  async getCategories() {
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
  }

  // Get category ID by slug
  async getCategoryIdBySlug(categorySlug) {
    console.log('🔍 Looking for category slug:', categorySlug);
    
    const categories = await this.getCategories();
    
    const category = categories.find(cat => 
      cat.slug.toLowerCase() === categorySlug.toLowerCase() || 
      cat.name.toLowerCase() === categorySlug.toLowerCase()
    );

    if (category) {
      return category.id;
    } else {
      console.error('❌ Category not found:', categorySlug);
      throw new Error(`Category "${categorySlug}" not found`);
    }
  }

  // Get posts by category
  async getPostsByCategory(categoryId, options = {}) {
    return this.getPosts({ ...options, categoryId });
  }

  // Get single post by slug
  async getPageBySlug(slug) {
  const result = await this.makeRequest(`/pages?slug=${slug}&_embed=true`);
  const pages = result.data;

  if (!Array.isArray(pages) || pages.length === 0) {
      throw new Error(`Page with slug "${slug}" not found`);
  }

  // Pages don't need the same complex transformation as posts,
  // so we can return the essential data directly.
  return pages[0];
}

  // Corrected transformPost for robust image handling
  transformPost(wpPost) {
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
    return `${Math.ceil(wordCount / wordsPerMinute)} min read`;
  }
}

export const wordpressApi = new WordPressAPI();
export default wordpressApi;