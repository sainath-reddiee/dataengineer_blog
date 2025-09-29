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

  // Official logos as SVG icons - using CDN hosted official brand logos
  const getCategoryIcon = (category) => {
    const lowerCategory = category.toLowerCase();
    
    // SVG icons with official brand colors
    const icons = {
      snowflake: (
        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
          <path fill="#29B5E8" d="M12 0L9.5 2.5 12 5 14.5 2.5 12 0zM6.5 3.5L4 6l2.5 2.5L9 6 6.5 3.5zM17.5 3.5L15 6l2.5 2.5L20 6l-2.5-2.5zM12 7l-2.5 2.5L12 12l2.5-2.5L12 7zM3.5 6.5L1 9l2.5 2.5L6 9 3.5 6.5zM20.5 6.5L18 9l2.5 2.5L23 9l-2.5-2.5zM9.5 9.5L7 12l2.5 2.5L12 12 9.5 9.5zM14.5 9.5L12 12l2.5 2.5L17 12l-2.5-2.5zM0 12l2.5 2.5L5 12 2.5 9.5 0 12zM19 12l2.5 2.5L24 12l-2.5-2.5L19 12zM6.5 14.5L4 17l2.5 2.5L9 17l-2.5-2.5zM17.5 14.5L15 17l2.5 2.5L20 17l-2.5-2.5zM12 14l-2.5 2.5L12 19l2.5-2.5L12 14zM3.5 17.5L1 20l2.5 2.5L6 20l-2.5-2.5zM20.5 17.5L18 20l2.5 2.5L23 20l-2.5-2.5zM12 19l-2.5 2.5L12 24l2.5-2.5L12 19z"/>
        </svg>
      ),
      aws: (
        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
          <path fill="#FF9900" d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335c-.072.048-.144.071-.208.071-.08 0-.16-.039-.239-.112a2.493 2.493 0 0 1-.287-.375 6.46 6.46 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.671 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.718-1.646.48-.415 1.117-.623 1.917-.623.264 0 .535.023.815.064.287.04.583.104.888.176v-.583c0-.607-.127-1.031-.375-1.277-.255-.246-.686-.367-1.294-.367-.28 0-.567.031-.863.103-.295.072-.583.16-.863.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.215 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.255 0 .518-.047.799-.14.287-.096.543-.271.758-.535.128-.16.224-.336.272-.535.047-.2.08-.447.08-.743v-.36a6.698 6.698 0 0 0-.711-.111 5.418 5.418 0 0 0-.727-.048c-.518 0-.903.103-1.158.319-.255.215-.375.528-.375.942 0 .39.095.686.295.894.192.2.487.317.862.317zm6.428.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.312.081.064.047.12.159.168.31l1.342 5.284 1.245-5.284c.04-.16.096-.263.168-.31.071-.048.183-.08.327-.08h.638c.151 0 .255.025.327.081.071.047.127.159.168.31l1.261 5.348 1.381-5.348c.048-.16.111-.263.168-.31.064-.048.175-.08.319-.08h.742c.128 0 .2.063.2.2 0 .047-.009.096-.017.16-.008.063-.024.144-.056.271l-1.923 6.17c-.048.16-.104.264-.168.312-.064.056-.168.08-.312.08h-.687c-.151 0-.255-.024-.327-.08-.071-.048-.127-.16-.167-.319L13.41 7.33l-1.23 5.275c-.04.16-.095.263-.167.319-.072.056-.184.08-.328.08zm10.245.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.91-.32-.128-.07-.215-.15-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.047.2.08.271.119.566.21.878.27.319.064.63.096.95.096.502 0 .894-.088 1.165-.264.279-.176.415-.44.415-.79 0-.224-.072-.415-.207-.575-.144-.16-.462-.304-.95-.44l-1.365-.431c-.694-.215-1.205-.535-1.525-.95-.32-.416-.479-.886-.479-1.405 0-.423.088-.798.264-1.118.175-.319.415-.591.71-.814.295-.215.646-.383 1.044-.494.407-.112.83-.168 1.277-.168.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256-.063 0-.167-.024-.303-.08-.463-.216-1.229-.319-1.692-.319-.455 0-.815.072-1.061.223-.248.152-.367.375-.367.71 0 .224.08.423.231.591.151.16.479.32.974.463l1.342.415c.687.215 1.19.519 1.5.91.32.391.471.846.471 1.365 0 .431-.088.822-.263 1.158-.176.336-.423.631-.743.87-.32.24-.71.416-1.158.535-.431.104-.91.16-1.421.16z"/>
        </svg>
      ),
      azure: (
        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
          <path fill="#0078D4" d="M22.379 23.343a1.62 1.62 0 0 0 1.536-2.14v.002L17.35 1.76A1.62 1.62 0 0 0 15.816.657H8.184A1.62 1.62 0 0 0 6.65 1.76L.086 21.204a1.62 1.62 0 0 0 1.536 2.139h4.741a1.62 1.62 0 0 0 1.535-1.103l.977-2.892 4.947 3.675c.28.208.618.32.966.32h7.59m-3.042-3.587-3.189-2.372.746-2.215 5.686-5.558-3.243 10.145"/>
        </svg>
      ),
      sql: (
        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
          <path fill="#CC2927" d="M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 2c4.41 0 8 1.12 8 2.5S16.41 9 12 9s-8-1.12-8-2.5S7.59 4 12 4zm0 14c-4.41 0-8-1.12-8-2.5v-2.09c1.86 1.04 4.78 1.59 8 1.59s6.14-.55 8-1.59v2.09c0 1.38-3.59 2.5-8 2.5zm8-6c0 1.38-3.59 2.5-8 2.5s-8-1.12-8-2.5V9.91C5.86 10.95 8.78 11.5 12 11.5s6.14-.55 8-1.59V12z"/>
        </svg>
      ),
      airflow: (
        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
          <path fill="#017CEE" d="M12.002 2.005c-5.52 0-9.998 4.48-9.998 9.997 0 4.236 2.636 7.863 6.356 9.33.464.085.634-.201.634-.446 0-.22-.008-.806-.012-1.582-2.782.603-3.37-1.343-3.37-1.343-.422-1.072-1.03-1.357-1.03-1.357-.842-.576.063-.564.063-.564.932.065 1.423.957 1.423.957.828 1.42 2.173.998 2.702.762.084-.593.324-.998.589-1.227-2.06-.234-4.228-1.03-4.228-4.584 0-1.013.362-1.84.955-2.487-.096-.234-.414-1.176.09-2.453 0 0 .778-.249 2.549.951.74-.206 1.533-.309 2.322-.312.788.003 1.581.106 2.322.312 1.771-1.2 2.549-.951 2.549-.951.504 1.277.186 2.219.09 2.453.593.647.955 1.474.955 2.487 0 3.562-2.172 4.347-4.241 4.577.334.287.63.855.63 1.723 0 1.244-.012 2.246-.012 2.551 0 .248.168.537.64.446 3.717-1.469 6.352-5.094 6.352-9.33 0-5.517-4.479-9.997-10-9.997z"/>
        </svg>
      ),
      dbt: (
        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
          <path fill="#FF694B" d="M12 0L3 7v10l9 7 9-7V7l-9-7zm6.5 16L12 20.5 5.5 16V8.5L12 4l6.5 4.5V16z"/>
          <path fill="#FF694B" d="M12 6.5L7.5 9.5v6l4.5 3 4.5-3v-6L12 6.5z"/>
        </svg>
      ),
      python: (
        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
          <path fill="#3776AB" d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.42 3.35-3.42h5.766s3.24.052 3.24-3.148V3.202S18.28 0 11.913 0zM8.708 1.85c.578 0 1.046.484 1.046 1.08 0 .596-.468 1.08-1.046 1.08-.579 0-1.046-.484-1.046-1.08 0-.596.467-1.08 1.046-1.08z"/>
          <path fill="#FFD43B" d="M12.087 24c6.092 0 5.712-2.656 5.712-2.656l-.007-2.752h-5.814v-.826h8.121s3.9.445 3.9-5.735c0-6.18-3.403-5.96-3.403-5.96h-2.03v2.867s.109 3.42-3.35 3.42H9.45s-3.24-.052-3.24 3.148v5.292S5.72 24 12.087 24zm3.206-1.85c-.579 0-1.046-.484-1.046-1.08 0-.596.467-1.08 1.046-1.08.578 0 1.046.484 1.046 1.08 0 .596-.468 1.08-1.046 1.08z"/>
        </svg>
      ),
      analytics: (
        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
          <path fill="#4285F4" d="M3 13h2v8H3v-8zm4-6h2v14H7V7zm4 10h2v4h-2v-4zm4-8h2v12h-2V9zm4 4h2v8h-2v-8z"/>
        </svg>
      )
    };
    
    return icons[lowerCategory] || (
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