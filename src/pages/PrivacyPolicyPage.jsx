import React, { useState, useEffect } from 'react';
import { wordpressApi } from '@/services/wordpressApi';
import MetaTags from '@/components/SEO/MetaTags';
import { Loader } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const pageData = await wordpressApi.getPageBySlug('privacy-policy');
        setPage(pageData);
      } catch (err) {
        setError('Failed to load Privacy Policy.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error || !page) {
    return <div className="text-center py-20 text-red-400">{error || 'Page not found.'}</div>;
  }

  return (
    <>
      <MetaTags
        title="Privacy Policy"
        description="Privacy Policy for dataengineerhub.blog"
      />
      <div className="container mx-auto px-6 max-w-4xl py-12">
        <h1 className="text-3xl md:text-4xl font-black mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;