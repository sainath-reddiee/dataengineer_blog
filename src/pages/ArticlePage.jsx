import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Newsletter from '@/components/Newsletter';
import MetaTags from '@/components/SEO/MetaTags';
import AdManager from '@/components/AdSense/AdManager';

const ArticlePage = () => {
  const { slug } = useParams();

  // This is mock data. In a real app, you'd fetch this based on the slug.
  const article = {
    title: "Building Scalable Data Pipelines with Apache Airflow",
    category: "Airflow",
    date: "Dec 15, 2024",
    readTime: "12 min read",
    author: "Jane Doe",
    image: "https://images.unsplash.com/photo-1592181572975-1d0d8880d175",
    excerpt: "Learn how to build production-ready data pipelines using Apache Airflow. This comprehensive guide covers DAGs, operators, and best practices for scalable data workflows.",
    tags: ["airflow", "data-pipeline", "etl", "workflow", "data-engineering"],
    content: `
      <p class="text-lg text-gray-300 leading-relaxed mb-6">Apache Airflow has become the de-facto standard for orchestrating complex data workflows. Its flexibility, scalability, and vibrant community make it a top choice for data engineers. In this article, we'll explore the core concepts of Airflow and walk through building a production-ready data pipeline.</p>
      <h2 class="text-3xl font-bold mt-12 mb-6 gradient-text">Understanding Airflow Concepts</h2>
      <p class="text-lg text-gray-300 leading-relaxed mb-6">Before we dive into code, let's clarify some key Airflow terminology:</p>
      <ul class="list-disc list-inside text-lg text-gray-300 leading-relaxed mb-6 space-y-2">
        <li><strong>DAG (Directed Acyclic Graph):</strong> A collection of all the tasks you want to run, organized in a way that reflects their relationships and dependencies.</li>
        <li><strong>Operator:</strong> A class that acts as a template for a certain type of task. For example, the <code>BashOperator</code> is used to execute a bash command.</li>
        <li><strong>Task:</strong> A parameterized instance of an operator.</li>
        <li><strong>Task Instance:</strong> A specific run of a task for a specific DAG and point in time.</li>
      </ul>
      <h2 class="text-3xl font-bold mt-12 mb-6 gradient-text">Setting Up Your First DAG</h2>
      <p class="text-lg text-gray-300 leading-relaxed mb-6">Let's create a simple DAG that fetches data from an API, processes it, and loads it into a database. We'll use Python to define our DAG file.</p>
      <div class="bg-slate-800 rounded-lg p-4 my-6">
        <pre><code class="language-python text-gray-300">
from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime

with DAG(
    dag_id='my_first_dag',
    start_date=datetime(2024, 1, 1),
    schedule_interval='@daily',
    catchup=False
) as dag:
    extract_data = BashOperator(
        task_id='extract_data',
        bash_command='echo "Extracting data..."'
    )
    
    transform_data = BashOperator(
        task_id='transform_data',
        bash_command='echo "Transforming data..."'
    )

    load_data = BashOperator(
        task_id='load_data',
        bash_command='echo "Loading data..."'
    )

    extract_data >> transform_data >> load_data
        </code></pre>
      </div>
      <p class="text-lg text-gray-300 leading-relaxed mb-6">This simple example demonstrates the core structure of a DAG. The <code>>></code> syntax defines the dependencies between tasks, creating a linear workflow.</p>
    `
  };

  return (
    <>
      <MetaTags
        title={article.title}
        description={article.excerpt}
        keywords={article.tags.join(', ')}
        image={article.image}
        type="article"
        author={article.author}
        publishedTime={new Date(article.date).toISOString()}
        category={article.category}
        tags={article.tags}
      />
      <div className="pt-8 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button asChild variant="outline" className="border-2 border-blue-400/50 text-blue-300 hover:bg-blue-500/20 backdrop-blur-sm">
              <Link to="/articles">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Articles
              </Link>
            </Button>
          </motion.div>

          {/* In-article Ad */}
          <AdManager position="in-article" />

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="mb-8">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {article.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400 mb-8">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{article.readTime}</span>
              </div>
            </div>
            
            <div className="relative h-96 rounded-2xl overflow-hidden mb-12">
              <img 
                className="w-full h-full object-cover"
                alt={article.title}
                src={article.image}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
            </div>

            {/* Mid-article Ad */}
            <AdManager position="in-article" />

            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
            
            {/* End-article Ad */}
            <AdManager position="in-article" />
          </motion.article>
          
          <div className="mt-20">
            <Newsletter />
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;