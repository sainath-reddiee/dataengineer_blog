// src/utils/analytics.js
// Google Analytics 4 Integration

export const GA_MEASUREMENT_ID = 'G-MTMNP6EV9C'; // Replace with your actual GA4 ID

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return;
  
  // Load gtag script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    send_page_view: false, // We'll send manually on route changes
  });

  console.log('✅ Google Analytics initialized');
};

// Track page views
export const trackPageView = (url) => {
  if (typeof window.gtag === 'undefined') return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
  
  console.log('📊 Page view tracked:', url);
};

// Track custom events
export const trackEvent = ({ action, category, label, value }) => {
  if (typeof window.gtag === 'undefined') return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
  
  console.log('📊 Event tracked:', { action, category, label, value });
};

// Track article reads
export const trackArticleRead = (articleTitle, category) => {
  trackEvent({
    action: 'read_article',
    category: 'engagement',
    label: articleTitle,
  });
};

// Track newsletter signups
export const trackNewsletterSignup = () => {
  trackEvent({
    action: 'newsletter_signup',
    category: 'conversion',
    label: 'Newsletter',
  });
};

// Track outbound links
export const trackOutboundLink = (url) => {
  trackEvent({
    action: 'click',
    category: 'outbound',
    label: url,
  });
};

// Track search queries
export const trackSearch = (query) => {
  trackEvent({
    action: 'search',
    category: 'engagement',
    label: query,
  });
};