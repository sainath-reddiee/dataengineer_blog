import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaTags = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  author = 'DataEngineer Hub',
  publishedTime,
  modifiedTime,
  category,
  tags = []
}) => {
  const siteTitle = 'DataEngineer Hub - Your Data Engineering Blog';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'Explore the latest in data engineering with insights on AWS, Snowflake, Azure, SQL, Airflow, dbt and more. Your go-to resource for data technology.';
  const metaDescription = description || defaultDescription;
  const defaultImage = 'https://dataengineerhub.blog/og-image.jpg';
  const metaImage = image || defaultImage;
  const canonicalUrl = url || window.location.href;

  // Generate structured data for articles
  const structuredData = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": metaDescription,
    "image": metaImage,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "DataEngineer Hub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://dataengineerhub.blog/logo.png"
      }
    },
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "articleSection": category,
    "keywords": tags.join(', ')
  } : {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DataEngineer Hub",
    "description": metaDescription,
    "url": "https://dataengineerhub.blog"
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="DataEngineer Hub" />
      
      {/* Article specific Open Graph tags */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {category && <meta property="article:section" content={category} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:site" content="@sainath29" />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://app.dataengineerhub.blog" />
    </Helmet>
  );
};

export default MetaTags;