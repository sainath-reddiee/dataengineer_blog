-- Complete setup script for Meeting Notes RAG
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

-- Main table for meeting transcripts
CREATE OR REPLACE TABLE meeting_transcripts (
    meeting_id STRING PRIMARY KEY,
    meeting_title STRING NOT NULL,
    meeting_date TIMESTAMP_LTZ NOT NULL,
    meeting_type STRING, -- 'standup', 'planning', 'retrospective', 'one-on-one'
    attendees ARRAY,
    duration_minutes INTEGER,
    transcript_text STRING NOT NULL,
    action_items ARRAY,
    decisions_made ARRAY,
    topics_discussed ARRAY,
    recording_url STRING,
    created_at TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP(),
    updated_at TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP()
);

-- Add some realistic sample data
INSERT INTO meeting_transcripts VALUES
(
    'MTG-2024-001',
    'Q1 Product Planning',
    '2024-01-15 10:00:00',
    'planning',
    ARRAY_CONSTRUCT('Sarah Chen', 'Mike Rodriguez', 'Emily Watson', 'David Park'),
    60,
    'Sarah opened the meeting discussing Q1 priorities. The main focus is launching the new dashboard feature by end of February. Mike raised concerns about the API rate limiting affecting customer experience. After discussion, the team decided to implement a caching layer using Redis before launch. Emily suggested we should also add analytics to track dashboard load times. David mentioned the infrastructure team can provision the Redis cluster within a week. Action items: Mike to create Redis implementation plan, Emily to design analytics dashboard, David to provision infrastructure by Jan 22.',
    ARRAY_CONSTRUCT(
        'Mike: Create Redis implementation plan by Jan 18',
        'Emily: Design analytics dashboard mockup by Jan 20',
        'David: Provision Redis cluster by Jan 22'
    ),
    ARRAY_CONSTRUCT(
        'Implement Redis caching layer before dashboard launch',
        'Add analytics tracking for dashboard performance',
        'Q1 launch date confirmed for Feb 28'
    ),
    ARRAY_CONSTRUCT('Dashboard launch', 'API performance', 'Redis caching', 'Analytics'),
    'https://zoom.us/rec/share/mock-url-001',
    CURRENT_TIMESTAMP(),
    CURRENT_TIMESTAMP()
),
(
    'MTG-2024-002',
    'Database Migration Discussion',
    '2024-01-22 14:00:00',
    'technical',
    ARRAY_CONSTRUCT('Tom Liu', 'Sarah Chen', 'Alex Kumar'),
    45,
    'Tom presented three options for the database migration: PostgreSQL, MySQL, and staying with current setup. Sarah advocated strongly for PostgreSQL citing better JSON support and more robust concurrent write handling. Alex agreed, mentioning PostgreSQL full-text search capabilities would be beneficial for the search feature we are planning. The team also discussed migration timeline - estimated 3 weeks for full migration including testing. Concern raised about downtime, but Tom confirmed we can do blue-green deployment with minimal disruption. Decision: Move forward with PostgreSQL, start migration planning next week.',
    ARRAY_CONSTRUCT(
        'Tom: Create detailed migration plan by Jan 29',
        'Sarah: Review PostgreSQL best practices documentation',
        'Alex: Set up staging PostgreSQL environment by Feb 1'
    ),
    ARRAY_CONSTRUCT(
        'Selected PostgreSQL as new database',
        'Migration timeline: 3 weeks',
        'Use blue-green deployment strategy'
    ),
    ARRAY_CONSTRUCT('Database migration', 'PostgreSQL', 'Blue-green deployment'),
    'https://zoom.us/rec/share/mock-url-002',
    CURRENT_TIMESTAMP(),
    CURRENT_TIMESTAMP()
),
(
    'MTG-2024-003',
    'API Security Review',
    '2024-02-05 11:00:00',
    'security',
    ARRAY_CONSTRUCT('Jennifer Lee', 'Tom Liu', 'Mike Rodriguez'),
    90,
    'Jennifer led security audit of our API endpoints. Critical finding: several endpoints lack proper rate limiting, making them vulnerable to DDoS attacks. Mike explained current authentication uses JWT but token expiry is set too long at 7 days. Team agreed to reduce to 24 hours and implement refresh token mechanism. Jennifer recommended adding API key rotation policy every 90 days. Also discussed implementing request signing for sensitive endpoints. Tom mentioned we should add monitoring alerts for unusual API patterns. Decision: Implement all recommendations before March 1st launch. This is now a blocker for product launch.',
    ARRAY_CONSTRUCT(
        'Mike: Implement rate limiting on all API endpoints by Feb 12',
        'Tom: Set up monitoring and alerts by Feb 15',
        'Jennifer: Document API key rotation policy by Feb 10',
        'Mike: Reduce JWT expiry to 24h and add refresh tokens by Feb 16'
    ),
    ARRAY_CONSTRUCT(
        'All API security improvements are launch blockers',
        'JWT token expiry reduced from 7 days to 24 hours',
        'Implement 90-day API key rotation policy',
        'Add request signing for sensitive endpoints'
    ),
    ARRAY_CONSTRUCT('API security', 'Rate limiting', 'JWT tokens', 'Authentication'),
    'https://zoom.us/rec/share/mock-url-003',
    CURRENT_TIMESTAMP(),
    CURRENT_TIMESTAMP()
),
(
    'MTG-2024-004',
    'Weekly Engineering Standup',
    '2024-02-12 09:00:00',
    'standup',
    ARRAY_CONSTRUCT('Sarah Chen', 'Mike Rodriguez', 'Emily Watson', 'David Park', 'Tom Liu'),
    30,
    'Quick updates from everyone. Sarah completed the dashboard analytics implementation, looking good in staging. Mike finished API rate limiting yesterday, currently doing load testing. Emily working on mobile responsive design, encountered some CSS issues with the new dashboard on tablets. David reports Redis cluster is stable, handling 10k requests per second easily. Tom mentioned database migration testing is going well, planning cutover for next weekend. No blockers reported. Brief discussion about whether we need additional caching for mobile API endpoints - agreed to monitor after launch and optimize if needed.',
    ARRAY_CONSTRUCT(
        'Emily: Fix tablet responsive issues by Feb 14',
        'Mike: Complete load testing report by Feb 13',
        'Tom: Finalize migration cutover plan by Feb 14'
    ),
    ARRAY_CONSTRUCT(),
    ARRAY_CONSTRUCT('Sprint progress', 'Dashboard status', 'Mobile responsive', 'Database migration'),
    'https://zoom.us/rec/share/mock-url-004',
    CURRENT_TIMESTAMP(),
    CURRENT_TIMESTAMP()
),
(
    'MTG-2024-005',
    'Customer Feedback Review',
    '2024-02-20 15:00:00',
    'product',
    ARRAY_CONSTRUCT('Emily Watson', 'Sarah Chen', 'Product Manager Jane Smith'),
    60,
    'Jane presented findings from customer interviews conducted last week. Top request: ability to export dashboard data to Excel. 15 out of 20 customers mentioned this. Also strong demand for custom date range filters, currently we only support preset ranges. Sarah noted export feature is technically straightforward, could be done in one sprint. Emily suggested we should also add PDF export option. Jane agreed, mentioned several enterprise customers specifically asked for PDF reports for presentations. Team consensus: prioritize Excel export for Q2, PDF can be Q3. Also discussed adding keyboard shortcuts for power users - Emily volunteered to research what shortcuts would be most useful.',
    ARRAY_CONSTRUCT(
        'Sarah: Create technical spec for Excel export by Feb 27',
        'Emily: Research and propose keyboard shortcuts by Feb 29',
        'Jane: Follow up with customers about custom date ranges by Mar 1'
    ),
    ARRAY_CONSTRUCT(
        'Excel export prioritized for Q2 Sprint 1',
        'PDF export moved to Q3',
        'Custom date range filters to be designed',
        'Keyboard shortcuts under consideration'
    ),
    ARRAY_CONSTRUCT('Customer feedback', 'Feature requests', 'Excel export', 'Dashboard improvements'),
    'https://zoom.us/rec/share/mock-url-005',
    CURRENT_TIMESTAMP(),
    CURRENT_TIMESTAMP()
);

-- Verify data loaded
SELECT 
    meeting_id,
    meeting_title,
    meeting_date,
    ARRAY_SIZE(attendees) as attendee_count,
    ARRAY_SIZE(action_items) as action_count,
    LEFT(transcript_text, 100) || '...' as preview
FROM meeting_transcripts
ORDER BY meeting_date;

