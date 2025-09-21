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