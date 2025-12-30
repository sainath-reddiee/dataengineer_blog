
CREATE DATABASE IF NOT EXISTS snowflake_docs_rag;
USE DATABASE snowflake_docs_rag;

-- Create schema for organization
CREATE SCHEMA IF NOT EXISTS documentation;
USE SCHEMA documentation;

-- You'll need a warehouse for compute
CREATE WAREHOUSE IF NOT EXISTS rag_warehouse 
WITH 
    WAREHOUSE_SIZE = 'SMALL'
    AUTO_SUSPEND = 60
    AUTO_RESUME = TRUE
    INITIALLY_SUSPENDED = TRUE;

USE WAREHOUSE rag_warehouse;

-- Make sure you have Cortex permissions
-- Your account admin needs to grant this
GRANT DATABASE ROLE SNOWFLAKE.CORTEX_USER TO ROLE your_role_name;

CREATE OR REPLACE TABLE raw_documentation (
    doc_id INTEGER AUTOINCREMENT,
    doc_title STRING,
    doc_category STRING,
    doc_url STRING,
    doc_content STRING,
    last_updated DATE
);

-- Insert sample documentation (abbreviated for tutorial)
INSERT INTO raw_documentation (doc_title, doc_category, doc_url, doc_content, last_updated)
VALUES
(
    'CREATE TABLE',
    'SQL Commands',
    'https://docs.snowflake.com/en/sql-reference/sql/create-table',
    'Creates a new table in the current/specified schema. Syntax: CREATE &#91; OR REPLACE ] TABLE &#91; IF NOT EXISTS ] table_name ( column_name data_type &#91; column_constraint ] &#91; , ... ] ) &#91; table_constraint ] &#91; ... ]. The CREATE TABLE command defines a new table with columns of specified data types. You can specify NOT NULL constraints, DEFAULT values, and foreign key relationships. Example: CREATE TABLE employees (id INTEGER NOT NULL, name STRING, hire_date DATE DEFAULT CURRENT_DATE());',
    '2024-08-15'
),
(
    'Window Functions',
    'SQL Functions',
    'https://docs.snowflake.com/en/sql-reference/functions-analytic',
    'Window functions perform calculations across rows related to the current row. Unlike aggregate functions, window functions do not cause rows to become grouped into a single output row. Common window functions include ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD(), and aggregate functions with OVER clause. Syntax: function_name() OVER (PARTITION BY column ORDER BY column). Example: SELECT employee_name, department, salary, AVG(salary) OVER (PARTITION BY department) as dept_avg_salary FROM employees;',
    '2024-09-20'
),
(
    'Time Travel',
    'Data Management',
    'https://docs.snowflake.com/en/user-guide/data-time-travel',
    'Time Travel enables accessing historical data that has been changed or deleted at any point within a defined period. The default retention period is 1 day for Standard Edition and up to 90 days for Enterprise Edition. You can query historical data using the AT or BEFORE clause with a timestamp or offset. Example: SELECT * FROM my_table AT(OFFSET =&gt; -60*5) queries data from 5 minutes ago. Time Travel is useful for recovering accidentally deleted data, analyzing data changes over time, and creating snapshots for testing.',
    '2024-10-05'
),
(
    'Snowflake Cortex',
    'AI and ML',
    'https://docs.snowflake.com/en/user-guide/snowflake-cortex',
    'Snowflake Cortex provides AI and ML capabilities directly in Snowflake. It includes LLM functions like COMPLETE, SUMMARIZE, TRANSLATE, SENTIMENT, and EXTRACT_ANSWER. Cortex also includes vector functions for embeddings and search. All functions run securely within your Snowflake account without data leaving your environment. Example: SELECT SNOWFLAKE.CORTEX.COMPLETE(\'llama3.1-70b\', \'Explain Snowflake in simple terms\');',
    '2024-11-10'
),
(
    'Streams and Tasks',
    'Data Engineering',
    'https://docs.snowflake.com/en/user-guide/streams',
    'Streams record data manipulation language (DML) changes made to tables, including inserts, updates, and deletes. This enables building change data capture (CDC) pipelines. Tasks are scheduled SQL statements that can process stream data automatically. Together, streams and tasks enable continuous data pipelines. Example: CREATE STREAM my_stream ON TABLE source_table; CREATE TASK my_task WAREHOUSE = compute_wh SCHEDULE = \'5 MINUTE\' WHEN SYSTEM$STREAM_HAS_DATA(\'my_stream\') AS INSERT INTO target_table SELECT * FROM my_stream;',
    '2024-09-30'
);
CREATE OR REPLACE TABLE documentation_chunks (
    chunk_id INTEGER AUTOINCREMENT,
    doc_id INTEGER,
    chunk_number INTEGER,
    doc_title STRING,
    doc_category STRING,
    chunk_text STRING,
    chunk_metadata VARIANT
);

-- For this example, our docs are already reasonably sized
-- In production, you'd split longer documents
INSERT INTO documentation_chunks (doc_id, chunk_number, doc_title, doc_category, chunk_text, chunk_metadata)
SELECT 
    doc_id,
    1 as chunk_number,
    doc_title,
    doc_category,
    doc_content as chunk_text,
    OBJECT_CONSTRUCT(
        'url', doc_url,
        'last_updated', last_updated,
        'word_count', ARRAY_SIZE(SPLIT(doc_content, ' '))
    ) as chunk_metadata
FROM raw_documentation;

-- Verify chunks
SELECT 
    chunk_id,
    doc_title,
    LEFT(chunk_text, 100) || '...' as preview,
    chunk_metadata:word_count::INTEGER as words
FROM documentation_chunks
ORDER BY chunk_id;

-- Add column for embeddings
ALTER TABLE documentation_chunks 
ADD COLUMN chunk_embedding VECTOR(FLOAT, 1024);

-- Generate embeddings using Cortex
-- The 'snowflake-arctic-embed-l' model creates 1024-dimension vectors
UPDATE documentation_chunks
SET chunk_embedding = SNOWFLAKE.CORTEX.EMBED_TEXT_1024(
    'snowflake-arctic-embed-l',
    chunk_text
);

-- Check that embeddings were created
SELECT 
    chunk_id,
    doc_title,
    chunk_embedding IS NOT NULL as has_embedding,
    VECTOR_L2_DISTANCE(chunk_embedding, chunk_embedding) as self_distance
FROM documentation_chunks
LIMIT 5;

-- Create Cortex Search Service
CREATE OR REPLACE CORTEX SEARCH SERVICE documentation_search_service
ON chunk_text
WAREHOUSE = rag_warehouse
TARGET_LAG = '1 hour'
AS (
    SELECT
        chunk_id,
        chunk_text,
        doc_title,
        doc_category,
        chunk_metadata,
        chunk_embedding
    FROM documentation_chunks
);

-- Check service status
SHOW CORTEX SEARCH SERVICES;

CREATE OR REPLACE FUNCTION ask_snowflake_docs(question STRING)
RETURNS STRING
LANGUAGE SQL
AS
$$
    -- Step 1: Search for relevant documentation chunks
    WITH relevant_docs AS (
        SELECT 
            chunk_text,
            doc_title,
            chunk_metadata:url::STRING as url
        FROM TABLE(
            documentation_search_service!SEARCH(
                QUERY =&gt; question,
                LIMIT =&gt; 3
            )
        )
    ),
    -- Step 2: Combine retrieved context
    context AS (
        SELECT 
            LISTAGG(
                'Source: ' || doc_title || '\n' || chunk_text || '\n' ||
                'Reference: ' || url,
                '\n\n---\n\n'
            ) as combined_context
        FROM relevant_docs
    )
    -- Step 3: Generate answer using LLM
    SELECT SNOWFLAKE.CORTEX.COMPLETE(
        'llama3.1-70b',
        'You are a helpful Snowflake documentation assistant. Answer the user\'s question based ONLY on the provided context. If the context doesn\'t contain enough information to answer fully, say so. Always cite which source you used.

Context from Snowflake documentation:
' || combined_context || '

User question: ' || question || '

Please provide a clear, accurate answer with citations:'
    )
    FROM context
$$

-- Question 1: Basic syntax
SELECT ask_snowflake_docs('How do I create a table in Snowflake?');

-- Question 2: Specific feature
SELECT ask_snowflake_docs('Explain what Time Travel is and give me an example');

-- Question 3: Advanced topic
SELECT ask_snowflake_docs('How do window functions work with partitioning?');

-- Question 4: Edge case
SELECT ask_snowflake_docs('What is the capital of France?');
-- (This should correctly say it's not in the documentation!)

