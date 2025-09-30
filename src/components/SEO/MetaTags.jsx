// src/components/SEO/MetaTags.jsx
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
  tags = [],
  noindex = false,
}) => {
  const siteName = 'DataEngineer Hub';
  const twitterHandle = '@sainath29';
  const siteUrl = 'https://dataengineerhub.blog';
  
  // Create compelling title (max 60 chars for SEO)
  const fullTitle = title 
    ? `${title} | ${siteName}` 
    : `${siteName} - Master Data Engineering with Expert Tutorials`;
  
  // Create description (120-160 chars for SEO)
  const fullDescription = description || 
    'Learn data engineering from industry experts. Get hands-on tutorials on Snowflake, AWS, Azure, SQL, Python, Airflow, dbt and more. Level up your data skills today.';
  
  const fullImage = image || `${siteUrl}/og-image.jpg`;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : siteUrl);

  // Format dates properly (ISO 8601)
  const formatDate = (date) => {
    if (!date) return null;
    try {
      return new Date(date).toISOString();
    } catch {
      return null;
    }
  };

  const formattedPublishedTime = formatDate(publishedTime);
  const formattedModifiedTime = formatDate(modifiedTime || publishedTime);

  // Article Schema
  const articleSchema = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": fullDescription,
    "image": {
      "@type": "ImageObject",
      "url": fullImage,
      "width": 1200,
      "height": 630
    },
    "author": {
      "@type": "Person",
      "name": author,
      "url": `${siteUrl}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`,
        "width": 250,
        "height": 250
      }
    },
    "datePublished": formattedPublishedTime,
    "dateModified": formattedModifiedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "articleSection": category,
    "keywords": tags.join(", ")
  } : null;

  // BreadcrumbList Schema
  const breadcrumbSchema = type === 'article' && category ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Articles",
        "item": `${siteUrl}/articles`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category,
        "item": `${siteUrl}/category/${encodeURIComponent(category.toLowerCase())}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": title,
        "item": currentUrl
      }
    ]
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={currentUrl} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <>
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        </>
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || siteName} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title || siteName} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />

      {/* Article Specific */}
      {type === 'article' && formattedPublishedTime && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:published_time" content={formattedPublishedTime} />
          {formattedModifiedTime && (
            <meta property="article:modified_time" content={formattedModifiedTime} />
          )}
          {category && <meta property="article:section" content={category} />}
          {tags.map((tag, i) => (
            <meta property="article:tag" content={tag} key={`tag-${i}`} />
          ))}
        </>
      )}

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#1e293b" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Structured Data */}
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default MetaTags;