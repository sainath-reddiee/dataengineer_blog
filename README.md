# DataEngineer Hub - React Frontend

This is the React frontend for DataEngineer Hub, a comprehensive blog about data engineering technologies including AWS, Snowflake, Azure, dbt, Airflow, and more.

## Architecture

- **Main Domain**: `https://dataengineerhub.blog` - React application (this project) - Public facing UI
- **Subdomain**: `https://app.dataengineerhub.blog` - WordPress backend with content management

## WordPress Integration

The React app connects to the WordPress REST API to fetch:
- Blog posts and articles
- Categories and tags
- Newsletter subscriptions
- Contact form submissions

## Technologies Used

- **Frontend**: React 18, Vite, TailwindCSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **Routing**: React Router DOM
- **Backend**: WordPress REST API
- **SEO**: React Helmet Async, Structured Data
- **Monetization**: Google AdSense Integration

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## SEO Optimization

This application includes comprehensive SEO optimizations:

- **Meta Tags**: Dynamic meta tags for each page
- **Open Graph**: Social media sharing optimization
- **Structured Data**: JSON-LD for rich snippets
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Search engine crawling instructions
- **Performance**: Preconnect hints and resource optimization

## AdSense Integration

The app includes Google AdSense integration with:

- **Automatic Ad Refresh**: Ads refresh on route changes
- **Multiple Ad Positions**: Header, sidebar, in-article, footer, between posts
- **Responsive Ads**: Auto-sizing based on screen size
- **Performance Optimized**: Lazy loading and efficient rendering

### Setting Up AdSense

1. Replace `YOUR_PUBLISHER_ID` in the following files:
   - `index.html`
   - `src/components/AdSense/AdsenseAd.jsx`

2. Replace ad slot IDs in `src/components/AdSense/AdManager.jsx`:
   - `YOUR_HEADER_AD_SLOT`
   - `YOUR_SIDEBAR_AD_SLOT`
   - `YOUR_IN_ARTICLE_AD_SLOT`
   - `YOUR_FOOTER_AD_SLOT`
   - `YOUR_BETWEEN_POSTS_AD_SLOT`

## WordPress Configuration

Make sure your WordPress site has the following:

1. **Custom Fields**: Add `featured` and `trending` meta fields to posts
2. **CORS Headers**: Enable CORS for your subdomain
3. **Custom Endpoints**: Newsletter and contact form endpoints
4. **Featured Images**: Enable post thumbnails

## Content Categories

The blog covers these main data engineering topics:
- AWS (Cloud services, S3, Redshift, Glue)
- Snowflake (Data warehouse, analytics)
- Azure (Microsoft cloud platform)
- SQL (Advanced queries, optimization)
- Airflow (Workflow orchestration)
- dbt (Data transformation)
- Python (Data engineering libraries)
- Analytics (Visualization, BI tools)

## Deployment

This React app should be deployed to your main domain `dataengineerhub.blog` while your WordPress installation should be moved to the subdomain `app.dataengineerhub.blog`.

## API Endpoints

The app connects to these WordPress REST API endpoints:
- `GET https://app.dataengineerhub.blog/wp-json/wp/v2/posts` - Fetch blog posts
- `GET https://app.dataengineerhub.blog/wp-json/wp/v2/categories` - Fetch categories
- `POST https://app.dataengineerhub.blog/wp-json/wp/v2/newsletter/subscribe` - Newsletter subscription
- `POST https://app.dataengineerhub.blog/wp-json/wp/v2/contact/submit` - Contact form submission

## Performance Features

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Lazy loading and responsive images
- **Caching**: API response caching
- **Preloading**: Critical resource preloading
- **Bundle Optimization**: Tree shaking and minification