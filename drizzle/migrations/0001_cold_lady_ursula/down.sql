-- Down migration for user creation trigger
-- This migration safely rolls back the user creation trigger

-- Drop trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop function
DROP FUNCTION IF EXISTS public.handle_new_user();
