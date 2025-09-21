import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Cloud, 
  Database, 
  Workflow, 
  BarChart3, 
  Zap,
  Code2,
  GitBranch
} from 'lucide-react';
import { useCategories } from '@/hooks/useWordPress';

const TechCategories = () => {
  const { categories: apiCategories, loading } = useCategories();
  
  // Fallback categories with icons and colors
  const categoryConfig = [
    {
      name: 'AWS',
      icon: Cloud,
      description: 'Cloud data services, S3, Redshift, Glue, and more',
      color: 'from-orange-500 to-red-500',
      path: '/category/aws',
      animation: 'bounce'
    },
    {
      name: 'Snowflake',
      icon: Database,
      description: 'Modern cloud data warehouse and analytics',
      color: 'from-blue-500 to-cyan-500',
      path: '/category/snowflake',
      animation: 'pulse'
    },
    {
      name: 'Azure',
      icon: Cloud,
      description: 'Microsoft cloud data platform and services',
      color: 'from-blue-600 to-indigo-600',
      path: '/category/azure',
      animation: 'wiggle'
    },
    {
      name: 'SQL',
      icon: Database,
      description: 'Advanced queries, optimization, and best practices',
      color: 'from-green-500 to-emerald-500',
      path: '/category/sql',
      animation: 'shake'
    },
    {
      name: 'Airflow',
      icon: Workflow,
      description: 'Workflow orchestration and data pipeline automation',
      color: 'from-purple-500 to-violet-500',
      path: '/category/airflow',
      animation: 'swing'
    },
    {
      name: 'dbt',
      icon: GitBranch,
      description: 'Data transformation and analytics engineering',
      color: 'from-pink-500 to-rose-500',
      path: '/category/dbt',
      animation: 'flip'
    },
    {
      name: 'Python',
      icon: Code2,
      description: 'Data engineering with Python libraries and frameworks',
      color: 'from-yellow-500 to-orange-500',
      path: '/category/python',
      animation: 'rotate'
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      description: 'Data visualization, BI tools, and reporting',
      color: 'from-teal-500 to-cyan-500',
      path: '/category/analytics',
      animation: 'zoom'
    }
  ];

  // Merge API categories with config
  const categories = categoryConfig.map(config => {
    const apiCategory = apiCategories.find(cat => cat.name === config.name);
    return {
      ...config,
      posts: apiCategory ? apiCategory.count : 0
    };
  });

  // Animation variants for each category
  const animationVariants = {
    bounce: {
      hover: { y: -8, transition: { duration: 0.2, ease: "easeOut" } }
    },
    pulse: {
      hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeOut" } }
    },
    wiggle: {
      hover: { rotate: 2, transition: { duration: 0.2, ease: "easeOut" } }
    },
    shake: {
      hover: { x: 2, transition: { duration: 0.2, ease: "easeOut" } }
    },
    swing: {
      hover: { rotateZ: 3, transition: { duration: 0.2, ease: "easeOut" } }
    },
    flip: {
      hover: { rotateY: 15, transition: { duration: 0.2, ease: "easeOut" } }
    },
    rotate: {
      hover: { rotate: 10, transition: { duration: 0.2, ease: "easeOut" } }
    },
    zoom: {
      hover: { scale: 1.08, transition: { duration: 0.2, ease: "easeOut" } }
    }
  };
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Explore <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Deep dive into the tools and platforms that power modern data engineering
          </p>
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            const animationVariant = animationVariants[category.animation];
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={animationVariant.hover}
              >
                <Link to={category.path} className="block tech-card rounded-2xl p-6 group relative overflow-hidden h-full">
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <img 
                      className="w-full h-full object-cover"
                      alt={`${category.name} technology background`}
                      src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                  </div>
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${category.color} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <motion.div 
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.color} mb-4 self-start`}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-grow">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-gray-500">
                        {category.posts} articles
                      </span>
                      <motion.div 
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Zap className="h-4 w-4 text-blue-400" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechCategories;