import React, { useEffect } from 'react'; // <-- 1. "useEffect" was added here
import { Routes, Route, useLocation } from 'react-router-dom'; // <-- 2. "useLocation" was added here
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import CategoryPage from '@/pages/CategoryPage';
import AboutPage from '@/pages/AboutPage';
import AllArticlesPage from '@/pages/AllArticlesPage';
import ArticlePage from '@/pages/ArticlePage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import NewsletterPage from '@/pages/NewsletterPage';
import { useSEO } from '@/hooks/useSEO';

/*
  ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  3. THIS HELPER COMPONENT WAS ADDED.
  It listens for page changes and tells Ezoic to refresh the ads.
  ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
*/
const EzoicAdRefresher = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.ezstandalone && typeof window.ezstandalone.showAds === 'function') {
      window.ezstandalone.cmd.push(function() {
        window.ezstandalone.showAds();
      });
    }
  }, [location]); // This runs every time the URL changes

  return null; // This component renders nothing.
};

function App() {
  // Initialize SEO optimizations
  useSEO();

  return (
    <> {/* <-- 4. A Fragment was added to wrap the two components */}
      <EzoicAdRefresher /> {/* <-- 5. The helper component is called here */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="articles" element={<AllArticlesPage />} />
          <Route path="article/:slug" element={<ArticlePage />} /> {/* Corrected path */}
          <Route path="category/:categoryName" element={<CategoryPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-of-service" element={<TermsOfServicePage />} />
          <Route path="newsletter" element={<NewsletterPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;