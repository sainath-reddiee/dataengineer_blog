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
  noindex = false, // For pages you don't want indexed
}) => {
  const siteName = 'DataEngineer Hub';
  const twitterHandle = '@sainath29';
  const siteUrl = 'https://dataengineerhub.blog';
  
  // Create compelling title
  const fullTitle = title 
    ? `${title} | ${siteName}` 
    : `${siteName} - Master Data Engineering with Expert Tutorials & Guides`;
  
  // Create compelling description
  const fullDescription = description || 
    'Learn data engineering from industry experts. Get hands-on tutorials on Snowflake, AWS, Azure, SQL, Python, Airflow, dbt and more. Level up your data skills today.';
  
  const fullImage = image || `${siteUrl}/og-image.jpg`;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : siteUrl);

  // Article Schema
  const articleSchema = {
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
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "articleSection": category,
    "keywords": tags.join(", ")
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    "url": siteUrl,
    "name": siteName,
    "description": fullDescription,
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    "name": siteName,
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Expert data engineering tutorials and guides",
    "sameAs": [
      "https://twitter.com/sainath29",
      "https://linkedin.com/company/dataengineerhub",
      "https://github.com/dataengineerhub"
    ]
  };

  // BreadcrumbList Schema (for better navigation understanding)
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
        "item": `${siteUrl}/category/${category.toLowerCase()}`
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
      {type === 'article' && publishedTime && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
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

      {/* Performance Hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//app.dataengineerhub.blog" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Structured Data */}
      {type === 'article' ? (
        <>
          <script type="application/ld+json">
            {JSON.stringify(articleSchema)}
          </script>
          {breadcrumbSchema && (
            <script type="application/ld+json">
              {JSON.stringify(breadcrumbSchema)}
            </script>
          )}
        </>
      ) : (
        <>
          <script type="application/ld+json">
            {JSON.stringify(websiteSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(organizationSchema)}
          </script>
        </>
      )}
    </Helmet>
  );
};

export default MetaTags;