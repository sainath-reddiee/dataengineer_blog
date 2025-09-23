import React, { useEffect, Suspense } from 'react';
// The 'BrowserRouter as Router' import has been removed. We now import 'useLocation'.
import { Route, Routes, useLocation } from 'react-router-dom';
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
 */
const EzoicAdRefresher = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.ezstandalone && typeof window.ezstandalone.showAds === 'function') {
      window.ezstandalone.cmd.push(function() {
        window.ezstandalone.showAds();
      });
    }
  }, [location]);

  return null;
};

function App() {
  return (
    // The <Router> component that was here has been removed.
    <Layout>
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
    // The closing </Router> tag was also removed.
  );
}

export default App;