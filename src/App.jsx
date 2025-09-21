import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

function App() {
  // Initialize SEO optimizations
  useSEO();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="articles" element={<AllArticlesPage />} />
        <Route path="articles/:slug" element={<ArticlePage />} />
        <Route path="category/:categoryName" element={<CategoryPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="terms-of-service" element={<TermsOfServicePage />} />
        <Route path="newsletter" element={<NewsletterPage />} />
      </Route>
    </Routes>
  );
}

export default App;