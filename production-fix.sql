-- Production database fix for missing user records
-- Run this in Supabase SQL Editor

-- First, let's see which users are missing from local database
-- (This will show auth users that don't have corresponding records in public.users)
SELECT 
    au.id,
    au.email,
    au.raw_user_meta_data->>'full_name' as full_name,
    au.created_at,
    u.id as existing_user_record
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL
AND au.email_confirmed_at IS NOT NULL;

-- Now insert the missing user records
-- (Run this after reviewing the above results)
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', '') as full_name,
    'member' as role,
    au.created_at,
    NOW() as updated_at
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL
AND au.email_confirmed_at IS NOT NULL
AND au.email IS NOT NULL;

-- Verify the fix worked
SELECT 
    COUNT(*) as total_auth_users,
    (SELECT COUNT(*) FROM public.users) as total_local_users,
    COUNT(*) - (SELECT COUNT(*) FROM public.users) as missing_records
FROM auth.users 
WHERE email_confirmed_at IS NOT NULL;
