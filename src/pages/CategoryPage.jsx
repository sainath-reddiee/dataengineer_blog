import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import RecentPosts from '@/components/RecentPosts';
import MetaTags from '@/components/SEO/MetaTags';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const formattedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  // Category descriptions for better SEO and user experience
  const categoryDescriptions = {
    snowflake: "Explore comprehensive tutorials and guides for Snowflake, the modern cloud data platform. Learn about data warehousing, analytics, and advanced Snowflake features.",
    aws: "Discover AWS data services including S3, Redshift, Glue, Lambda, and more. Master cloud data engineering with Amazon Web Services.",
    azure: "Learn Microsoft Azure data services and tools. From Azure Data Factory to Synapse Analytics, explore the Azure ecosystem for data engineers.",
    sql: "Master SQL with advanced queries, optimization techniques, and best practices. From basic SELECT statements to complex data transformations.",
    airflow: "Apache Airflow tutorials and guides for workflow orchestration. Learn to build, schedule, and monitor data pipelines with Airflow.",
    dbt: "Data Build Tool (dbt) tutorials for modern data transformation. Learn analytics engineering and data modeling best practices.",
    python: "Python for data engineering - libraries, frameworks, and practical examples. Master data processing with pandas, NumPy, and more.",
    analytics: "Data analytics, visualization, and business intelligence tools. Learn to create insightful reports and dashboards."
  };

  // Official brand logos using image URLs from CDN
  const getCategoryIcon = (category) => {
    const lowerCategory = category.toLowerCase();
    
    const iconUrls = {
      snowflake: 'https://cdn.brandfetch.io/idJz-fGD_q/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B',
      aws: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
      azure: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
      sql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      airflow: 'https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/apacheairflow/apacheairflow-original.svg',
      dbt: 'https://seeklogo.com/images/D/dbt-logo-500AB0BAA7-seeklogo.com.png',
      python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      analytics: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg'
    };
    
    const iconUrl = iconUrls[lowerCategory];
    
    if (iconUrl) {
      return (
        <img 
          src={iconUrl} 
          alt={`${category} logo`}
          className="w-10 h-10 object-contain"
          onError={(e) => {
            // Fallback to a default icon if image fails to load
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = '<div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-2xl">📁</div>';
          }}
        />
      );
    }
    
    // Default folder icon
    return (
      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
        <path fill="#6366F1" d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
      </svg>
    );
  };

  const categoryDescription = categoryDescriptions[categoryName.toLowerCase()] || 
    `Discover articles and tutorials about ${formattedCategoryName} technology and best practices.`;

  // Unique meta description for each category
  const metaDescription = categoryDescriptions[categoryName.toLowerCase()] || 
    `Browse all ${formattedCategoryName} articles on DataEngineer Hub. Learn best practices, tutorials, and advanced techniques for ${formattedCategoryName}.`;

  return (
    <>
      <MetaTags 
        title={`${formattedCategoryName} Tutorials & Articles | DataEngineer Hub`}
        description={metaDescription}
        keywords={`${categoryName.toLowerCase()}, data engineering, ${formattedCategoryName} tutorials, ${formattedCategoryName} guides, ${formattedCategoryName} best practices`}
      />
      <div className="pt-1 pb-8">
        <div className="container mx-auto px-6">
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Button 
              asChild 
              variant="outline" 
              className="border-2 border-blue-400/50 text-blue-300 hover:bg-blue-500/20 backdrop-blur-sm"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </motion.div>

          {/* Category Header with H1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-400/30 mb-6">
              <span role="img" aria-label={formattedCategoryName}>
                {getCategoryIcon(categoryName)}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black mb-4">
              <span className="gradient-text">{formattedCategoryName} Tutorials & Articles</span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {categoryDescription}
            </p>
            
            <div className="flex items-center justify-center mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400 bg-gray-800/30 px-4 py-2 rounded-full">
                <Folder className="h-4 w-4" />
                <span>Category: {formattedCategoryName}</span>
              </div>
            </div>
          </motion.div>
          
          {/* Posts Section with Enhanced Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <RecentPosts 
              category={categoryName.toLowerCase()} 
              showCategoryError={true}
              initialLimit={9} // Show more posts initially for category pages
              title={`All ${formattedCategoryName} Articles`}
              showLoadMore={true} // Enable load more functionality
              showViewToggle={true} // Enable grid/list view toggle
            />
          </motion.div>

          {/* Category Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-400/20 rounded-2xl"
          >
            <h3 className="text-xl font-bold mb-4 text-center gradient-text">
              Explore Other Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(categoryDescriptions).map(([slug, description]) => (
                <Link
                  key={slug}
                  to={`/category/${slug}`}
                  className={`p-3 rounded-lg text-center transition-all duration-300 ${
                    slug === categoryName.toLowerCase()
                      ? 'bg-blue-600/30 border border-blue-400/50'
                      : 'bg-gray-800/30 hover:bg-gray-700/50 border border-transparent hover:border-gray-600/50'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    {getCategoryIcon(slug)}
                  </div>
                  <div className={`text-sm font-medium ${
                    slug === categoryName.toLowerCase()
                      ? 'text-blue-300'
                      : 'text-gray-300'
                  }`}>
                    {slug.charAt(0).toUpperCase() + slug.slice(1)}
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button 
                asChild 
                variant="outline" 
                className="border-blue-400/50 text-blue-300 hover:bg-blue-500/20"
              >
                <Link to="/articles">
                  View All Articles
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;