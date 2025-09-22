import React from 'react';
import Hero from '../components/Hero';
import FeaturedPosts from '../components/FeaturedPosts';
import TrendingPosts from '../components/TrendingPosts'; // Import the new component
import RecentPosts from '../components/RecentPosts';
import TechCategories from '../components/TechCategories';
import Newsletter from '../components/Newsletter';
import CallToAction from '../components/CallToAction';
import MetaTags from '../components/SEO/MetaTags';

const HomePage = () => {
  return (
    <>
      <MetaTags 
        title="DataEngineer Hub - Your Source for Data Engineering Insights"
        description="Welcome to DataEngineer Hub. Get the latest articles, tutorials, and insights on data engineering, Snowflake, AWS, Azure, SQL, Python, Airflow, and dbt."
        keywords="data engineering, blog, data engineer, snowflake, aws, azure, sql, python, airflow, dbt"
      />
      <div className="bg-white text-gray-800">
        <Hero />
        <FeaturedPosts />
        <TrendingPosts /> {/* Add the new component here */}
        <TechCategories />
        <RecentPosts />
        <Newsletter />
        <CallToAction />
      </div>
    </>
  );
};

export default HomePage;