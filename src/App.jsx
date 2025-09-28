import React, { useEffect, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useSEO } from '@/hooks/useSEO';

// Import the new Error Boundary
import ErrorBoundary from '@/components/ErrorBoundary';

// Import MobileOptimization component
import MobileOptimization from '@/components/MobileOptimization';

// Lazy load all pages for better performance
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const CategoryPage = React.lazy(() => import('@/pages/CategoryPage'));
const AboutPage = React.lazy(() => import('@/pages/AboutPage'));
const AllArticlesPage = React.lazy(() => import('@/pages/AllArticlesPage'));
const ArticlePage = React.lazy(() => import('@/pages/ArticlePage'));
const ContactPage = React.lazy(() => import('@/pages/ContactPage'));
const PrivacyPolicyPage = React.lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsOfServicePage = React.lazy(() => import('@/pages/TermsOfServicePage'));
const NewsletterPage = React.lazy(() => import('@/pages/NewsletterPage'));

// Enhanced loading component for better UX
const PageLoader = ({ text = "Loading..." }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-purple-400 border-b-transparent rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="text-blue-300 font-medium text-lg">{text}</p>
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

/**
 * Ezoic Ad Refresher Component
 * Handles ad refresh on route changes for better ad performance
 */
const EzoicAdRefresher = () => {
  const location = useLocation();

  useEffect(() => {
    // Defer ad refresh to avoid blocking rendering
    const refreshAds = () => {
      try {
        if (window.ezstandalone && typeof window.ezstandalone.showAds === 'function') {
          window.ezstandalone.cmd.push(function() {
            window.ezstandalone.showAds();
            console.log('🎯 Ezoic ads refreshed for:', location.pathname);
          });
        }
        
        // Also handle legacy Ezoic implementations
        if (window.ezoic && typeof window.ezoic.refresh === 'function') {
          window.ezoic.refresh();
        }
      } catch (error) {
        console.warn('⚠️ Ad refresh failed:', error);
      }
    };

    // Use requestAnimationFrame to avoid blocking the main thread
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(refreshAds);
    }, 100); // Small delay to ensure page is rendered

    return () => clearTimeout(timeoutId);
  }, [location.pathname]); // Only trigger on path changes, not query params

  return null;
};

/**
 * Performance Monitor Component
 * Tracks route changes and performance metrics
 */
const PerformanceMonitor = () => {
  const location = useLocation();

  useEffect(() => {
    // Mark route change for performance tracking
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`route-change-${Date.now()}`);
    }

    // Track page views for analytics (if implemented)
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname,
      });
    }

    // Log route change for debugging
    console.log('📍 Route changed to:', location.pathname);
  }, [location.pathname]);

  return null;
};

/**
 * Main App Component
 */
function App() {
  // Initialize SEO optimizations
  useSEO();

  // Performance monitoring
  useEffect(() => {
    // Log app initialization
    console.log('🚀 DataEngineer Hub App initialized');
    
    // Performance monitoring
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark('app-initialized');
    }

    // Preload critical routes
    const preloadCriticalRoutes = () => {
      // Preload most visited pages
      import('@/pages/AllArticlesPage');
      import('@/pages/ArticlePage');
    };

    // Preload after initial render
    const timeoutId = setTimeout(preloadCriticalRoutes, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <ErrorBoundary>
      {/* Mobile optimization component - must be first */}
      <MobileOptimization />
      
      {/* Performance monitoring */}
      <PerformanceMonitor />
      
      {/* Ezoic ad refresher */}
      <EzoicAdRefresher />
      
      {/* Main app routes with suspense boundaries */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route 
            index 
            element={
              <Suspense fallback={<PageLoader text="Loading Home..." />}>
                <HomePage />
              </Suspense>
            } 
          />
          <Route 
            path="articles" 
            element={
              <Suspense fallback={<PageLoader text="Loading Articles..." />}>
                <AllArticlesPage />
              </Suspense>
            } 
          />
          <Route 
            path="articles/:slug" 
            element={
              <Suspense fallback={<PageLoader text="Loading Article..." />}>
                <ArticlePage />
              </Suspense>
            } 
          />
          <Route 
            path="category/:categoryName" 
            element={
              <Suspense fallback={<PageLoader text="Loading Category..." />}>
                <CategoryPage />
              </Suspense>
            } 
          />
          <Route 
            path="about" 
            element={
              <Suspense fallback={<PageLoader text="Loading About..." />}>
                <AboutPage />
              </Suspense>
            } 
          />
          <Route 
            path="contact" 
            element={
              <Suspense fallback={<PageLoader text="Loading Contact..." />}>
                <ContactPage />
              </Suspense>
            } 
          />
          <Route 
            path="privacy-policy" 
            element={
              <Suspense fallback={<PageLoader text="Loading Privacy Policy..." />}>
                <PrivacyPolicyPage />
              </Suspense>
            } 
          />
          <Route 
            path="terms-of-service" 
            element={
              <Suspense fallback={<PageLoader text="Loading Terms..." />}>
                <TermsOfServicePage />
              </Suspense>
            } 
          />
          <Route 
            path="newsletter" 
            element={
              <Suspense fallback={<PageLoader text="Loading Newsletter..." />}>
                <NewsletterPage />
              </Suspense>
            } 
          />
          {/* Debug route - only available in development or with debug flag */}
          {(import.meta.env.DEV || new URLSearchParams(window.location.search).has('debug')) && (
            <Route 
              path="debug" 
              element={
                <Suspense fallback={<PageLoader text="Loading Debug..." />}>
                  {React.lazy(() => import('@/components/ApiDebugger'))}
                </Suspense>
              } 
            />
          )}
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;