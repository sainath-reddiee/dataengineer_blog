import React, { useState, useEffect } from 'react';
import { fetchPageBySlug } from '../services/wordpressApi';
import MetaTags from '../components/SEO/MetaTags';
import { Loader } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        // Use the slug "privacy-policy" to fetch the correct page
        const data = await fetchPageBySlug('privacy-policy');
        setPageContent(data);
      } catch (err) {
        setError('Failed to load the Privacy Policy. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPage();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-400">{error}</div>;
  }

  return (
    <>
      <MetaTags
        title="Privacy Policy"
        description="Read the Privacy Policy for dataengineerhub.blog."
        canonicalUrl="https://dataengineerhub.blog/privacy-policy"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {pageContent ? (
            <>
              <h1 className="text-3xl md:text-5xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: pageContent.title.rendered }} />
              <div className="prose prose-invert max-w-none lg:prose-xl" dangerouslySetInnerHTML={{ __html: pageContent.content.rendered }} />
            </>
          ) : (
            <p>Content could not be loaded.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;