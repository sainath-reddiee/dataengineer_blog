// scripts/submitSitemap.js
// Auto-submit sitemap to search engines after deployment
// Run: node scripts/submitSitemap.js

import https from 'https';
import http from 'http';

const SITE_URL = 'https://dataengineerhub.blog';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

// Search engine ping URLs
const SEARCH_ENGINES = [
  {
    name: 'Google',
    url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
  },
  {
    name: 'Bing',
    url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
  },
  {
    name: 'Yandex',
    url: `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
  }
];

// Make HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, status: res.statusCode, data });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Submit sitemap to search engines
async function submitSitemap() {
  console.log('🚀 Submitting sitemap to search engines...\n');
  console.log(`📍 Sitemap URL: ${SITEMAP_URL}\n`);

  const results = [];

  for (const engine of SEARCH_ENGINES) {
    try {
      console.log(`⏳ Pinging ${engine.name}...`);
      await makeRequest(engine.url);
      console.log(`✅ ${engine.name}: Sitemap submitted successfully`);
      results.push({ engine: engine.name, success: true });
    } catch (error) {
      console.error(`❌ ${engine.name}: Failed - ${error.message}`);
      results.push({ engine: engine.name, success: false, error: error.message });
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 SUBMISSION SUMMARY');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}/${SEARCH_ENGINES.length}`);
  console.log(`❌ Failed: ${failed}/${SEARCH_ENGINES.length}`);
  
  if (failed > 0) {
    console.log('\n⚠️  Some submissions failed. You may need to submit manually:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.engine}: ${r.error}`);
    });
  }

  console.log('\n💡 Additional Steps:');
  console.log('1. Verify in Google Search Console: https://search.google.com/search-console');
  console.log('2. Verify in Bing Webmaster Tools: https://www.bing.com/webmasters');
  console.log('3. Monitor indexing status over the next few days');
  console.log('4. Submit new sitemap after publishing new content\n');

  return results;
}

// Run the submitter
submitSitemap().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});