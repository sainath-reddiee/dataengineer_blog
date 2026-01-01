<!-- wp:code -->
<pre class="wp-block-code"><code>-- Complete setup script for Meeting Notes RAG
-- Run this entire script to set up the system

-- 1. Database setup
CREATE DATABASE IF NOT EXISTS meeting_intelligence;
USE DATABASE meeting_intelligence;
CREATE SCHEMA IF NOT EXISTS meetings;
USE SCHEMA meetings;

-- 2. Compute
CREATE WAREHOUSE IF NOT EXISTS meeting_rag_wh
WITH WAREHOUSE_SIZE = 'SMALL'
     AUTO_SUSPEND = 60
     AUTO_RESUME = TRUE;
USE WAREHOUSE meeting_rag_wh;

-- 3. Main tables
CREATE OR REPLACE TABLE meeting_transcripts (
    meeting_id STRING PRIMARY KEY,
    meeting_title STRING NOT NULL,
    meeting_date TIMESTAMP_LTZ NOT NULL,
    meeting_type STRING,
    attendees ARRAY,
    transcript_text STRING NOT NULL,
    action_items ARRAY,
    decisions_made ARRAY,
    topics_discussed ARRAY
);

CREATE OR REPLACE TABLE meeting_chunks (
    chunk_id STRING PRIMARY KEY,
    meeting_id STRING,
    chunk_text STRING,
    chunk_metadata VARIANT,
    chunk_embedding VECTOR(FLOAT, 1024)
);

-- 4. Load sample data (use the INSERT statements from earlier)

-- 5. Create embeddings and search service
UPDATE meeting_chunks
SET chunk_embedding = SNOWFLAKE.CORTEX.EMBED_TEXT_1024(
    'snowflake-arctic-embed-l',
    chunk_text
);

CREATE OR REPLACE CORTEX SEARCH SERVICE meeting_search_service
ON chunk_text
WAREHOUSE = meeting_rag_wh
TARGET_LAG = '1 minute'
AS (
    SELECT chunk_id, chunk_text, chunk_metadata, chunk_embedding
    FROM meeting_chunks
);

-- 6. Create query function (use function from earlier)

-- 7. Test it!
SELECT ask_meeting_assistant('What are the current project blockers?');



