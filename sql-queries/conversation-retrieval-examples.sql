-- =====================================================
-- SOPHIA CONVERSATION DATA RETRIEVAL - SQL EXAMPLES
-- =====================================================
-- Use these queries directly in Supabase SQL Editor
-- to retrieve conversation data with various filters

-- -----------------------------------------------------
-- 1. GET ALL CONVERSATIONS WITH USER INFO (BASIC)
-- -----------------------------------------------------
SELECT 
    c.id as conversation_id,
    c.title,
    c.created_at,
    c.updated_at,
    u.email as user_email,
    u.full_name as user_name,
    u.role as user_role,
    am.model_name as ai_model,
    am.provider_name as ai_provider,
    -- Count messages per conversation
    (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id) as message_count
FROM conversations c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN ai_models am ON c.active_model_id = am.id
ORDER BY c.created_at DESC
LIMIT 50;

-- -----------------------------------------------------
-- 2. GET CONVERSATIONS BY SPECIFIC USER (EMAIL FILTER)
-- -----------------------------------------------------
SELECT 
    c.id,
    c.title,
    c.created_at,
    u.email,
    u.full_name,
    COUNT(m.id) as total_messages,
    COUNT(CASE WHEN m.sender = 'user' THEN 1 END) as user_messages,
    COUNT(CASE WHEN m.sender = 'assistant' THEN 1 END) as assistant_messages,
    am.model_name,
    am.provider_name
FROM conversations c
JOIN users u ON c.user_id = u.id
LEFT JOIN messages m ON c.id = m.conversation_id
LEFT JOIN ai_models am ON c.active_model_id = am.id
WHERE u.email = 'user@example.com'  -- Replace with actual email
GROUP BY c.id, c.title, c.created_at, u.email, u.full_name, am.model_name, am.provider_name
ORDER BY c.created_at DESC;

-- -----------------------------------------------------
-- 3. GET COMPLETE CONVERSATION WITH ALL MESSAGES
-- -----------------------------------------------------
-- Replace 'CONVERSATION-UUID-HERE' with actual conversation ID
SELECT 
    c.id as conversation_id,
    c.title as conversation_title,
    c.created_at as conversation_created,
    u.email as user_email,
    u.full_name as user_name,
    
    -- Message details
    m.id as message_id,
    m.sender,
    m.content,
    m.created_at as message_created,
    m.reasoning,
    m.attachments,
    m.status,
    
    -- AI model used for this message
    models.model_name as message_ai_model,
    models.provider_name as message_ai_provider
FROM conversations c
JOIN users u ON c.user_id = u.id
LEFT JOIN messages m ON c.id = m.conversation_id
LEFT JOIN ai_models models ON m.model_id = models.id
WHERE c.id = 'CONVERSATION-UUID-HERE'
ORDER BY m.created_at ASC;

-- -----------------------------------------------------
-- 4. GET CONVERSATIONS FROM LAST 7 DAYS
-- -----------------------------------------------------
SELECT 
    c.id,
    c.title,
    c.created_at,
    u.email,
    u.full_name,
    am.model_name,
    COUNT(m.id) as message_count,
    -- Calculate conversation duration
    EXTRACT(EPOCH FROM (MAX(m.created_at) - MIN(m.created_at)))/3600 as duration_hours
FROM conversations c
JOIN users u ON c.user_id = u.id
LEFT JOIN messages m ON c.id = m.conversation_id
LEFT JOIN ai_models am ON c.active_model_id = am.id
WHERE c.created_at >= NOW() - INTERVAL '7 days'
GROUP BY c.id, c.title, c.created_at, u.email, u.full_name, am.model_name
ORDER BY c.created_at DESC;

-- -----------------------------------------------------
-- 5. GET CONVERSATIONS WITH ATTACHMENTS (UPLOADED FILES)
-- -----------------------------------------------------
SELECT DISTINCT
    c.id,
    c.title,
    c.created_at,
    u.email,
    u.full_name,
    COUNT(m.id) as total_messages,
    -- Count messages with attachments
    COUNT(CASE WHEN jsonb_array_length(m.attachments) > 0 THEN 1 END) as messages_with_attachments
FROM conversations c
JOIN users u ON c.user_id = u.id
JOIN messages m ON c.id = m.conversation_id
WHERE jsonb_array_length(m.attachments) > 0
GROUP BY c.id, c.title, c.created_at, u.email, u.full_name
ORDER BY c.created_at DESC;

-- -----------------------------------------------------
-- 6. GET CONVERSATIONS BY AI MODEL USED
-- -----------------------------------------------------
SELECT 
    am.provider_name,
    am.model_name,
    COUNT(DISTINCT c.id) as conversation_count,
    COUNT(m.id) as total_messages,
    -- Average messages per conversation
    ROUND(COUNT(m.id)::numeric / COUNT(DISTINCT c.id), 2) as avg_messages_per_conversation
FROM ai_models am
LEFT JOIN conversations c ON am.id = c.active_model_id
LEFT JOIN messages m ON c.id = m.conversation_id
WHERE am.is_active = true
GROUP BY am.provider_name, am.model_name
ORDER BY conversation_count DESC;

-- -----------------------------------------------------
-- 7. SEARCH CONVERSATIONS BY CONTENT KEYWORDS
-- -----------------------------------------------------
-- Search for specific keywords in message content
SELECT DISTINCT
    c.id,
    c.title,
    c.created_at,
    u.email,
    u.full_name,
    COUNT(m.id) as matching_messages
FROM conversations c
JOIN users u ON c.user_id = u.id
JOIN messages m ON c.id = m.conversation_id
WHERE 
    m.content ILIKE '%logo%'  -- Replace with your search term
    OR m.content ILIKE '%análisis%'  -- Multiple keywords
    OR m.content ILIKE '%automatización%'
GROUP BY c.id, c.title, c.created_at, u.email, u.full_name
ORDER BY matching_messages DESC, c.created_at DESC;

-- -----------------------------------------------------
-- 8. GET USER ENGAGEMENT STATISTICS
-- -----------------------------------------------------
SELECT 
    u.email,
    u.full_name,
    u.created_at as user_joined,
    COUNT(DISTINCT c.id) as total_conversations,
    COUNT(m.id) as total_messages,
    COUNT(CASE WHEN m.sender = 'user' THEN 1 END) as messages_sent,
    COUNT(CASE WHEN m.sender = 'assistant' THEN 1 END) as messages_received,
    -- Average messages per conversation
    ROUND(COUNT(m.id)::numeric / NULLIF(COUNT(DISTINCT c.id), 0), 2) as avg_messages_per_conversation,
    -- First and last activity
    MIN(c.created_at) as first_conversation,
    MAX(c.updated_at) as last_activity
FROM users u
LEFT JOIN conversations c ON u.id = c.user_id
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY u.id, u.email, u.full_name, u.created_at
HAVING COUNT(DISTINCT c.id) > 0  -- Only users with conversations
ORDER BY total_messages DESC;

-- -----------------------------------------------------
-- 9. GET ERROR MESSAGES AND FAILED INTERACTIONS
-- -----------------------------------------------------
SELECT 
    c.id as conversation_id,
    c.title,
    u.email,
    u.full_name,
    m.id as message_id,
    m.content,
    m.created_at,
    m.status,
    models.model_name,
    models.provider_name
FROM conversations c
JOIN users u ON c.user_id = u.id
JOIN messages m ON c.id = m.conversation_id
LEFT JOIN ai_models models ON m.model_id = models.id
WHERE m.status = 'error'
ORDER BY m.created_at DESC;

-- -----------------------------------------------------
-- 10. EXPORT CONVERSATION FOR SPECIFIC USER (FULL DATA)
-- -----------------------------------------------------
-- Complete conversation export for a specific user
-- Replace 'user@example.com' with the actual user email
WITH user_conversations AS (
    SELECT c.* 
    FROM conversations c
    JOIN users u ON c.user_id = u.id
    WHERE u.email = 'user@example.com'
)
SELECT 
    -- Conversation info
    c.id as conversation_id,
    c.title as conversation_title,
    c.created_at as conversation_started,
    c.updated_at as conversation_last_updated,
    
    -- User info
    u.email as user_email,
    u.full_name as user_name,
    u.role as user_role,
    
    -- Message details
    m.id as message_id,
    m.sender as message_sender,
    m.content as message_content,
    m.created_at as message_timestamp,
    m.reasoning as ai_reasoning,
    m.attachments as message_attachments,
    m.status as message_status,
    
    -- AI Model info
    active_model.model_name as conversation_ai_model,
    active_model.provider_name as conversation_ai_provider,
    msg_model.model_name as message_ai_model,
    msg_model.provider_name as message_ai_provider
FROM user_conversations c
JOIN users u ON c.user_id = u.id
LEFT JOIN messages m ON c.id = m.conversation_id
LEFT JOIN ai_models active_model ON c.active_model_id = active_model.id
LEFT JOIN ai_models msg_model ON m.model_id = msg_model.id
ORDER BY c.created_at DESC, m.created_at ASC;

-- -----------------------------------------------------
-- QUICK STATS QUERIES
-- -----------------------------------------------------

-- Total conversations and messages
SELECT 
    COUNT(DISTINCT c.id) as total_conversations,
    COUNT(DISTINCT u.id) as unique_users,
    COUNT(m.id) as total_messages,
    COUNT(CASE WHEN m.sender = 'user' THEN 1 END) as user_messages,
    COUNT(CASE WHEN m.sender = 'assistant' THEN 1 END) as assistant_messages
FROM conversations c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN messages m ON c.id = m.conversation_id;

-- Messages by date (last 30 days)
SELECT 
    DATE(m.created_at) as date,
    COUNT(*) as messages_count,
    COUNT(DISTINCT m.conversation_id) as conversations_active
FROM messages m
WHERE m.created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(m.created_at)
ORDER BY date DESC;
