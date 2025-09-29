// scripts/generateSitemap.js
// Run this script: node scripts/generateSitemap.js
// Or add to package.json: "build:sitemap": "node scripts/generateSitemap.js"

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const WORDPRESS_API_URL = 'https://app.dataengineerhub.blog/wp-json/wp/v2';
const SITE_URL = 'https://dataengineerhub.blog';

// Static pages with priority and change frequency
const STATIC_PAGES = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/articles', changefreq: 'daily', priority: 0.9 },
  { url: '/about', changefreq: 'monthly', priority: 0.7 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
  { url: '/newsletter', changefreq: 'monthly', priority: 0.7 },
  { url: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
  { url: '/terms-of-service', changefreq: 'yearly', priority: 0.3 },
];

// Fetch all posts from WordPress
async function fetchAllPosts() {
  try {
    console.log('📡 Fetching posts from WordPress...');
    
    let allPosts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(
        `${WORDPRESS_API_URL}/posts?page=${page}&per_page=100&_fields=slug,modified,categories`
      );
      
      if (!response.ok) {
        if (response.status === 400) {
          hasMore = false;
          break;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const posts = await response.json();
      
      if (posts.length === 0) {
        hasMore = false;
      } else {
        allPosts = allPosts.concat(posts);
        console.log(`✅ Fetched page ${page} (${posts.length} posts)`);
        page++;
      }
    }

    console.log(`✅ Total posts fetched: ${allPosts.length}`);
    return allPosts;
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    return [];
  }
}

// Fetch all categories from WordPress
async function fetchAllCategories() {
  try {
    console.log('📡 Fetching categories from WordPress...');
    
    const response = await fetch(
      `${WORDPRESS_API_URL}/categories?per_page=100&_fields=slug,count`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const categories = await response.json();
    // Filter out categories with no posts
    const activeCategories = categories.filter(cat => cat.count > 0);
    
    console.log(`✅ Total categories fetched: ${activeCategories.length}`);
    return activeCategories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
}

// Generate XML sitemap
function generateSitemapXML(pages) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${pages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

// Main function
async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...\n');

  try {
    // Fetch data
    const posts = await fetchAllPosts();
    const categories = await fetchAllCategories();

    // Build sitemap entries
    const sitemapEntries = [];
    const now = new Date().toISOString();

    // Add static pages
    STATIC_PAGES.forEach(page => {
      sitemapEntries.push({
        url: `${SITE_URL}${page.url}`,
        lastmod: now,
        changefreq: page.changefreq,
        priority: page.priority,
      });
    });

    // Add blog posts
    posts.forEach(post => {
      sitemapEntries.push({
        url: `${SITE_URL}/articles/${post.slug}`,
        lastmod: post.modified || now,
        changefreq: 'weekly',
        priority: 0.8,
      });
    });

    // Add category pages
    categories.forEach(category => {
      sitemapEntries.push({
        url: `${SITE_URL}/category/${category.slug}`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.7,
      });
    });

    // Generate XML
    const sitemapXML = generateSitemapXML(sitemapEntries);

    // Write to file
    const publicDir = path.join(__dirname, '..', 'public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');

    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(sitemapPath, sitemapXML, 'utf8');

    console.log(`\n✅ Sitemap generated successfully!`);
    console.log(`📍 Location: ${sitemapPath}`);
    console.log(`📊 Total URLs: ${sitemapEntries.length}`);
    console.log(`   - Static pages: ${STATIC_PAGES.length}`);
    console.log(`   - Blog posts: ${posts.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Deploy your site with the updated sitemap.xml`);
    console.log(`   2. Submit to Google Search Console: https://search.google.com/search-console`);
    console.log(`   3. Submit to Bing Webmaster Tools: https://www.bing.com/webmasters`);

    return sitemapEntries;
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the generator
generateSitemap();