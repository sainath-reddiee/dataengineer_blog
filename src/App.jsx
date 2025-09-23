import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';

// Lazy load the page components for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const AllArticlesPage = React.lazy(() => import('./pages/AllArticlesPage'));
const ArticlePage = React.lazy(() => import('./pages/ArticlePage'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = React.lazy(() => import('./pages/TermsOfServicePage'));
const NewsletterPage = React.lazy(() => import('./pages/NewsletterPage'));

/**
 * A component that listens to route changes and tells Ezoic to refresh ads.
 * This is crucial for single-page applications.
 */
const EzoicAdRefresher = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if the Ezoic script and its functions are available
    if (window.ezstandalone && typeof window.ezstandalone.showAds === 'function') {
      // This command tells Ezoic to find all ad placeholders on the new page and load ads.
      window.ezstandalone.cmd.push(function() {
        window.ezstandalone.showAds();
      });
    }
  }, [location]); // This effect runs every time the URL changes

  return null; // This component does not render anything
};

function App() {
  return (
    <Router>
      <Layout>
        {/* The EzoicAdRefresher component will now monitor all route changes */}
        <EzoicAdRefresher />
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="loader"></div></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/articles" element={<AllArticlesPage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/newsletter" element={<NewsletterPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;