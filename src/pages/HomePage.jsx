import React from 'react';
import Hero from '@/components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';
import TechCategories from '@/components/TechCategories';
import RecentPosts from '@/components/RecentPosts';
import Newsletter from '@/components/Newsletter';
import MetaTags from '@/components/SEO/MetaTags';

const HomePage = () => {
  return (
    <>
      <MetaTags
        title="DataEngineer Hub - Your Data Engineering Blog"
        description="Explore the latest in data engineering with insights on AWS, Snowflake, Azure, SQL, Airflow, dbt and more. Your go-to resource for data technology."
        keywords="data engineering, AWS, Snowflake, Azure, SQL, Airflow, dbt, Python, analytics, data warehouse, ETL, data pipeline"
        type="website"
      />
      <div className="-mt-4">
        <Hero />
      </div>
      <FeaturedPosts />
      <TechCategories />
      <RecentPosts initialLimit={3} />
      <Newsletter />
    </>
  );
};

export default HomePage;