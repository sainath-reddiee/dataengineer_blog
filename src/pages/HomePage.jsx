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
        title="DataEngineer Hub - Data Engineering Tutorials, Snowflake, AWS, Azure & More"
        description="Learn data engineering with expert tutorials on Snowflake, AWS, Azure, SQL, Python, Airflow, and dbt. Get practical guides, best practices, and insights from industry professionals."
        keywords="data engineering, blog, tutorials, snowflake tutorials, aws data services, azure data engineering, sql optimization, python data engineering, apache airflow, dbt data transformation, data warehousing, cloud data platforms"
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
        
        {/* Enhanced RecentPosts with Load More functionality */}
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <RecentPosts 
            initialLimit={9} // Show more posts initially on homepage
            showLoadMore={true} // Enable "Load More" button
            showViewToggle={true} // Allow users to switch between grid/list view
            title="Latest Articles" // Custom title
            showCategoryError={false} // Don't show category-specific errors on homepage
          />
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