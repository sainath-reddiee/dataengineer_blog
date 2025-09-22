// This file provides a centralized source of dummy post data for testing.
// It mimics the structure returned by the WordPress API.

export const articles = [
  // AWS Category
  {
    id: 101,
    slug: 'getting-started-with-aws-s3',
    title: 'Getting Started with AWS S3: A Beginner\'s Guide',
    excerpt: 'Learn the basics of Amazon S3, how to create buckets, upload objects, and manage permissions in this comprehensive tutorial.',
    category: 'AWS',
    readTime: '8 min read',
    date: '2025-09-22T10:00:00',
    image: 'https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=800&h=600&fit=crop',
    featured: true,
    trending: true,
    author: 'Admin',
  },
  {
    id: 102,
    slug: 'understanding-aws-ec2-instances',
    title: 'Understanding AWS EC2 Instances',
    excerpt: 'A deep dive into Amazon EC2, exploring instance types, pricing models, and best practices for deploying virtual servers.',
    category: 'AWS',
    readTime: '12 min read',
    date: '2025-09-20T11:30:00',
    image: 'https://images.unsplash.com/photo-1560264280-88b68371db39?w=800&h=600&fit=crop',
    featured: false,
    trending: false,
    author: 'Admin',
  },

  // Snowflake Category
  {
    id: 201,
    slug: 'snowflake-architecture-deep-dive',
    title: 'Snowflake Architecture: A Deep Dive',
    excerpt: 'Explore the unique multi-cluster, shared data architecture of Snowflake that separates compute from storage.',
    category: 'Snowflake',
    readTime: '15 min read',
    date: '2025-09-21T09:00:00',
    image: 'https://images.unsplash.com/photo-1614036751023-53d1de2a8397?w=800&h=600&fit=crop',
    featured: false,
    trending: true,
    author: 'Admin',
  },
  {
    id: 202,
    slug: 'loading-data-into-snowflake',
    title: 'Efficiently Loading Data into Snowflake',
    excerpt: 'A practical guide on various methods to load data into Snowflake, including bulk loading and continuous ingestion with Snowpipe.',
    category: 'Snowflake',
    readTime: '10 min read',
    date: '2025-09-19T14:00:00',
    image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&h=600&fit=crop',
    featured: false,
    trending: false,
    author: 'Admin',
  },

  // Azure Category
  {
    id: 301,
    slug: 'introduction-to-azure-blob-storage',
    title: 'Introduction to Azure Blob Storage',
    excerpt: 'Discover Azure Blob Storage, Microsoft\'s object storage solution for the cloud, ideal for storing unstructured data.',
    category: 'Azure',
    readTime: '7 min read',
    date: '2025-09-18T16:00:00',
    image: 'https://images.unsplash.com/photo-1582298539343-24898e3b3b4f?w=800&h=600&fit=crop',
    featured: false,
    trending: false,
    author: 'Admin',
  },

  // dbt Category
  {
    id: 401,
    slug: 'what-is-dbt-and-why-use-it',
    title: 'What is dbt and Why Should You Use It?',
    excerpt: 'An overview of dbt (Data Build Tool) and how it helps data analysts and engineers transform data in their warehouse more effectively.',
    category: 'dbt',
    readTime: '9 min read',
    date: '2025-09-17T10:00:00',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop',
    featured: true,
    trending: false,
    author: 'Admin',
  },
  
  // Airflow Category
  {
    id: 501,
    slug: 'building-your-first-dag-in-airflow',
    title: 'Building Your First DAG in Airflow',
    excerpt: 'A step-by-step tutorial on creating, scheduling, and monitoring your first Directed Acyclic Graph (DAG) in Apache Airflow.',
    category: 'Airflow',
    readTime: '14 min read',
    date: '2025-09-16T15:00:00',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
    featured: false,
    trending: true,
    author: 'Admin',
  },

  // SQL Category
  {
    id: 601,
    slug: 'advanced-sql-window-functions',
    title: 'Advanced SQL: Mastering Window Functions',
    excerpt: 'Unlock the power of window functions in SQL to perform complex calculations across sets of rows related to the current row.',
    category: 'SQL',
    readTime: '11 min read',
    date: '2025-09-15T11:00:00',
    image: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?w=800&h=600&fit=crop',
    featured: false,
    trending: false,
    author: 'Admin',
  },
];