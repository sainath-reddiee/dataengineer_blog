import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, Cloud, Code, Workflow, BarChart3, Server } from 'lucide-react';

const TechCategories = () => {
  const categories = [
    {
      name: 'AWS',
      icon: Cloud,
      description: 'Cloud data services and architecture',
      gradient: 'from-orange-500 to-red-500',
      posts: 24
    },
    {
      name: 'Snowflake',
      icon: Database,
      description: 'Modern cloud data warehouse',
      gradient: 'from-blue-500 to-cyan-500',
      posts: 18
    },
    {
      name: 'dbt',
      icon: Code,
      description: 'Data transformation and modeling',
      gradient: 'from-green-500 to-teal-500',
      posts: 15
    },
    {
      name: 'Airflow',
      icon: Workflow,
      description: 'Workflow orchestration platform',
      gradient: 'from-purple-500 to-pink-500',
      posts: 12
    },
    {
      name: 'Python',
      icon: Server,
      description: 'Programming for data engineering',
      gradient: 'from-yellow-500 to-orange-500',
      posts: 21
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      description: 'Data analysis and visualization',
      gradient: 'from-indigo-500 to-purple-500',
      posts: 9
    }
  ];

  return (
    <section className="py-8">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-black mb-2">
            Explore by <span className="gradient-text">Technology</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Dive deep into specific technologies and frameworks that power modern data engineering.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={`/category/${category.name.toLowerCase()}`}
                  className="block group"
                >
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 h-full">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${category.gradient} mb-3`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    
                    <h3 className="text-base font-bold mb-1 group-hover:text-blue-400 transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-400 text-xs mb-2 leading-tight">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{category.posts} articles</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform text-blue-400" />
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