import React, { Suspense } from 'react';
import Hero from '../components/Hero';
import MetaTags from '../components/SEO/MetaTags';

// Lazy load non-critical components for better initial page load
const FeaturedPosts = React.lazy(() => import('../components/FeaturedPosts'));
const TrendingPosts = React.lazy(() => import('../components/TrendingPosts'));
const RecentPosts = React.lazy(() => import('../components/RecentPosts'));
const TechCategories = React.lazy(() => import('../components/TechCategories'));
const Newsletter = React.lazy(() => import('../components/Newsletter'));
const CallToAction = React.lazy(() => import('../components/CallToAction'));

// Loading skeleton for better UX
const SectionSkeleton = ({ height = "h-64" }) => (
  <div className={`${height} bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse rounded-2xl mb-8`}>
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

const HomePage = () => {
  return (
    <>
      <MetaTags 
        title="DataEngineer Hub - Your Source for Data Engineering Insights"
        description="Welcome to DataEngineer Hub. Get the latest articles, tutorials, and insights on data engineering, Snowflake, AWS, Azure, SQL, Python, Airflow, and dbt."
        keywords="data engineering, blog, data engineer, snowflake, aws, azure, sql, python, airflow, dbt"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        {/* Hero is critical - load immediately */}
        <Hero />
        
        {/* Lazy load remaining components with suspense boundaries */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <FeaturedPosts />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="h-80" />}>
          <TrendingPosts />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="h-72" />}>
          <TechCategories />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <RecentPosts />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="h-64" />}>
          <Newsletter />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <CallToAction />
        </Suspense>
      </div>
    </>
  );
};

export default HomePage;