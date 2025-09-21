import { v4 as uuidv4 } from 'uuid';

export const allArticles = [
  {
    id: uuidv4(),
    slug: 'building-scalable-data-pipelines-airflow',
    title: 'Building Scalable Data Pipelines with Apache Airflow',
    excerpt: 'Learn how to build production-ready data pipelines using Apache Airflow. This comprehensive guide covers DAGs, operators, and best practices.',
    category: 'Airflow',
    readTime: '12 min read',
    date: '2024-12-15',
    image: 'https://images.unsplash.com/photo-1592181572975-1d0d8880d175',
    featured: true,
    trending: false
  },
  {
    id: uuidv4(),
    slug: 'snowflake-data-warehouse-optimization',
    title: 'Snowflake Data Warehouse Optimization Techniques',
    excerpt: 'Master advanced Snowflake optimization techniques to improve query performance and reduce costs in your data warehouse.',
    category: 'Snowflake',
    readTime: '15 min read',
    date: '2024-12-14',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    featured: true,
    trending: true
  },
  {
    id: uuidv4(),
    slug: 'advanced-sql-window-functions',
    title: 'Advanced SQL Window Functions for Data Analysis',
    excerpt: 'Master SQL window functions including ROW_NUMBER, RANK, LAG, LEAD and advanced analytical queries for complex data analysis.',
    category: 'SQL',
    readTime: '8 min read',
    date: '2024-12-12',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d',
    featured: false,
    trending: false
  },
  {
    id: uuidv4(),
    slug: 'azure-data-factory-pipelines',
    title: 'Building Robust Data Pipelines with Azure Data Factory',
    excerpt: 'Learn how to create, monitor, and optimize data pipelines using Azure Data Factory for enterprise-scale data integration.',
    category: 'Azure',
    readTime: '11 min read',
    date: '2024-12-11',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    featured: false,
    trending: true
  },
  {
    id: uuidv4(),
    slug: 'dbt-data-transformation-guide',
    title: 'Complete Guide to Data Transformation with dbt',
    excerpt: 'Transform your raw data into analytics-ready datasets using dbt. Learn models, tests, documentation, and deployment strategies.',
    category: 'dbt',
    readTime: '14 min read',
    date: '2024-12-10',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    featured: false,
    trending: false
  },
  {
    id: uuidv4(),
    slug: 'python-pandas-data-engineering',
    title: 'Python Pandas for Data Engineering: Advanced Techniques',
    excerpt: 'Explore advanced Pandas techniques for data engineering including performance optimization, memory management, and large dataset processing.',
    category: 'Python',
    readTime: '13 min read',
    date: '2024-12-09',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935',
    featured: false,
    trending: false
  },
  {
    id: uuidv4(),
    slug: 'data-analytics-visualization-best-practices',
    title: 'Data Analytics and Visualization Best Practices',
    excerpt: 'Create compelling data visualizations and analytics dashboards. Learn design principles, tool selection, and storytelling with data.',
    category: 'Analytics',
    readTime: '9 min read',
    date: '2024-12-08',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    featured: false,
    trending: false
  },
  {
    id: uuidv4(),
    slug: 'aws-redshift-performance-tuning',
    title: 'AWS Redshift Performance Tuning and Optimization',
    excerpt: 'Optimize your AWS Redshift data warehouse for better performance. Learn about distribution keys, sort keys, and query optimization.',
    category: 'AWS',
    readTime: '16 min read',
    date: '2024-12-07',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    featured: false,
    trending: false
  },
  {
    id: uuidv4(),
    slug: 'snowflake-zero-copy-cloning',
    title: 'Snowflake Zero-Copy Cloning for Development Environments',
    excerpt: 'Leverage Snowflake\'s zero-copy cloning feature to create instant database copies for development, testing, and data science workflows.',
    category: 'Snowflake',
    readTime: '7 min read',
    date: '2024-12-06',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    featured: false,
    trending: false
  },
  {
    id: uuidv4(),
    slug: 'airflow-dynamic-dags-patterns',
    title: 'Dynamic DAG Patterns in Apache Airflow',
    excerpt: 'Learn advanced patterns for creating dynamic DAGs in Airflow including DAG factories, configuration-driven workflows, and template patterns.',
    category: 'Airflow',
    readTime: '12 min read',
    date: '2024-12-05',
    image: 'https://images.unsplash.com/photo-1592181572975-1d0d8880d175',
    featured: false,
    trending: false
  }
  {
    id: uuidv4(),
    slug: 'aws-glue-etl-best-practices',
    title: 'AWS Glue ETL Best Practices for Data Engineers',
    excerpt: 'Discover best practices for building efficient ETL pipelines using AWS Glue, including cost optimization and performance tuning.',
    category: 'AWS',
    readTime: '10 min read',
    date: '2024-12-13',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    featured: true,
    trending: false
  }
];