-- Down migration for storage RLS policies
-- This migration safely rolls back the storage security policies

-- Drop policies in reverse order
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own images" ON storage.objects;
