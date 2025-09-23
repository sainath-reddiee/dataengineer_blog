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

  // New Dummy AWS Post for Testing
  {
    id: 701,
    slug: 'aws-lambda-data-processing-guide',
    title: 'AWS Lambda for Data Processing: A Complete Guide',
    excerpt: 'Learn how to build scalable data processing pipelines using AWS Lambda, including best practices for handling large datasets and optimizing performance.',
    category: 'AWS',
    readTime: '12 min read',
    date: '2025-01-15T10:00:00',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    featured: true,
    trending: true,
    author: 'DataEngineer Hub',
    content: `
      <h2>Introduction to AWS Lambda for Data Processing</h2>
      <p>AWS Lambda has revolutionized how we approach serverless data processing. In this comprehensive guide, we'll explore how to leverage Lambda functions for building robust, scalable data pipelines.</p>
      
      <h3>Why Choose AWS Lambda for Data Processing?</h3>
      <p>Lambda offers several advantages for data processing workloads:</p>
      <ul>
        <li><strong>Serverless Architecture:</strong> No infrastructure management required</li>
        <li><strong>Auto-scaling:</strong> Automatically scales based on demand</li>
        <li><strong>Cost-effective:</strong> Pay only for compute time used</li>
        <li><strong>Event-driven:</strong> Perfect for real-time data processing</li>
      </ul>
      
      <h3>Setting Up Your First Lambda Function</h3>
      <p>Let's start by creating a simple Lambda function that processes data from S3:</p>
      
      <pre><code>import json
import boto3

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    
    # Process S3 event
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        
        # Your data processing logic here
        print(f"Processing file: {key} from bucket: {bucket}")
    
    return {
        'statusCode': 200,
        'body': json.dumps('Data processed successfully!')
    }</code></pre>
      
      <h3>Best Practices for Lambda Data Processing</h3>
      <p>When building data processing pipelines with Lambda, consider these best practices:</p>
      
      <h4>1. Memory and Timeout Configuration</h4>
      <p>Configure your Lambda function with appropriate memory allocation. More memory also means more CPU power, which can significantly improve processing speed for data-intensive tasks.</p>
      
      <h4>2. Error Handling and Retry Logic</h4>
      <p>Implement robust error handling to ensure your data pipeline can recover from failures:</p>
      
      <pre><code>try:
    # Process data
    result = process_data(data)
except Exception as e:
    # Log error and handle gracefully
    logger.error(f"Processing failed: {str(e)}")
    # Send to DLQ or retry queue
    send_to_dlq(data, str(e))</code></pre>
      
      <h3>Integration with Other AWS Services</h3>
      <p>Lambda works seamlessly with other AWS services for comprehensive data processing solutions:</p>
      
      <ul>
        <li><strong>S3:</strong> Trigger Lambda on file uploads</li>
        <li><strong>Kinesis:</strong> Process streaming data in real-time</li>
        <li><strong>DynamoDB:</strong> Store processed results</li>
        <li><strong>SQS:</strong> Queue messages for batch processing</li>
      </ul>
      
      <h3>Performance Optimization Tips</h3>
      <p>To get the best performance from your Lambda data processing functions:</p>
      
      <ol>
        <li>Use connection pooling for database connections</li>
        <li>Implement proper caching strategies</li>
        <li>Optimize your code for cold start performance</li>
        <li>Use provisioned concurrency for predictable workloads</li>
      </ol>
      
      <h3>Monitoring and Debugging</h3>
      <p>AWS provides excellent tools for monitoring your Lambda functions:</p>
      
      <ul>
        <li><strong>CloudWatch Logs:</strong> View function logs and errors</li>
        <li><strong>CloudWatch Metrics:</strong> Monitor performance metrics</li>
        <li><strong>X-Ray:</strong> Trace requests through your application</li>
      </ul>
      
      <h3>Conclusion</h3>
      <p>AWS Lambda provides a powerful platform for building scalable data processing solutions. By following the best practices outlined in this guide, you can create efficient, cost-effective data pipelines that scale automatically with your needs.</p>
      
      <p>Start experimenting with Lambda for your data processing needs today, and discover how serverless architecture can transform your data engineering workflows.</p>
    `
  },
];