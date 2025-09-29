import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';
import MobileOptimization from '@/components/MobileOptimization';
import { RouteChangeTracker } from '@/utils/analytics';
import performance from '@/utils/performance';
import { useApiDebugger } from '@/components/ApiDebugger'; // For debugging API

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AllArticlesPage = lazy(() => import('./pages/AllArticlesPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const NewsletterPage = lazy(() => import('./pages/NewsletterPage'));

const LoadingFallback = ({ text = "Loading..." }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-purple-400 border-b-transparent rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="text-blue-300 font-medium text-lg">{text}</p>
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  </div>
);

// Ezoic Ad Logic
const EzoicAdRefresher = () => {
  const location = useLocation();

  useEffect(() => {
    const refreshAds = () => {
      try {
        if (window.ezstandalone && typeof window.ezstandalone.showAds === 'function') {
          window.ezstandalone.cmd.push(function() {
            window.ezstandalone.showAds();
          });
        }
        if (window.ezoic && typeof window.ezoic.refresh === 'function') {
           window.ezoic.refresh();
        }
      } catch (e) {
        console.error("Ezoic ad refresh error:", e);
      }
    };
    
    // Refresh ads on route change with a small delay
    const timeoutId = setTimeout(() => {
        requestAnimationFrame(refreshAds);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return null;
};

// Google Analytics and Performance Tracking
const AnalyticsAndPerformance = () => {
  const location = useLocation();

  useEffect(() => {
    // Marks a performance timing point on route change
    if (typeof performance !== "undefined" && performance.mark) {
      performance.mark(`route-change-${Date.now()}`);
    }
    // Fires a Google Analytics event on route change
    if (typeof gtag !== "undefined") {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname,
      });
    }
  }, [location.pathname]);

  return null;
};


function App() {
  // Initialize performance marking
  useEffect(() => {
    if (typeof performance !== "undefined" && performance.mark) {
      performance.mark('app-initialized');
    }

    const prefetchTimer = setTimeout(() => {
      // Prefetching high-traffic pages after initial load
      import('./pages/AllArticlesPage');
      import('./pages/ArticlePage');
    }, 2000);

    return () => clearTimeout(prefetchTimer);
  }, []);
  
  const { debugMode, ApiDebugger } = useApiDebugger();

  return (
    <ErrorBoundary>
      <MobileOptimization />
      <AnalyticsAndPerformance/>
      <EzoicAdRefresher />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Suspense fallback={<LoadingFallback text="Loading Home..." />}><HomePage /></Suspense>} />
            <Route path="articles" element={<Suspense fallback={<LoadingFallback text="Loading Articles..." />}><AllArticlesPage /></Suspense>} />
            <Route path="articles/:slug" element={<Suspense fallback={<LoadingFallback text="Loading Article..." />}><ArticlePage /></Suspense>} />
            <Route path="category/:categoryName" element={<Suspense fallback={<LoadingFallback text="Loading Category..." />}><CategoryPage /></Suspense>} />
            <Route path="about" element={<Suspense fallback={<LoadingFallback text="Loading About..." />}><AboutPage /></Suspense>} />
            <Route path="contact" element={<Suspense fallback={<LoadingFallback text="Loading Contact..." />}><ContactPage /></Suspense>} />
            <Route path="privacy-policy" element={<Suspense fallback={<LoadingFallback text="Loading Privacy Policy..." />}><PrivacyPolicyPage /></Suspense>} />
            <Route path="terms-of-service" element={<Suspense fallback={<LoadingFallback text="Loading Terms..." />}><TermsOfServicePage /></Suspense>} />
            <Route path="newsletter" element={<Suspense fallback={<LoadingFallback text="Loading Newsletter..." />}><NewsletterPage /></Suspense>} />
            {debugMode && (
              <Route path="debug" element={<Suspense fallback={<LoadingFallback text="Loading Debug..." />}><ApiDebugger /></Suspense>} />
            )}
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

const Root = () => (
  <HelmetProvider>
    <App />
    <Toaster />
  </HelmetProvider>
);

export default Root;