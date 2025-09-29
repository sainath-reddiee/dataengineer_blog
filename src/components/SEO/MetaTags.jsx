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
}) => {
  const siteName = 'DataEngineer Hub';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Your Data Engineering Blog`;
  const fullDescription = description || 'Explore the latest in data engineering with insights on AWS, Snowflake, Azure, SQL, Airflow, dbt and more. Your go-to resource for data technology.';
  const fullImage = image || 'https://dataengineerhub.blog/og-image.jpg';
  const currentUrl = url || window.location.href;

  const schema = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": fullDescription,
    "image": fullImage,
    "author": {
      "@type": "Person",
      "name": author,
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": "https://dataengineerhub.blog/logo.png"
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
  } : {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "description": fullDescription,
    "url": "https://dataengineerhub.blog"
  };

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@sainath29" />

      {/* Article specific tags */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {category && <meta property="article:section" content={category} />}
          {tags.map((tag, i) => <meta property="article:tag" content={tag} key={i} />)}
        </>
      )}

      {/* Search Engine Directives */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>

      {/* Favicon and Theme */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://app.dataengineerhub.blog" />
    </Helmet>
  );
};

export default MetaTags;