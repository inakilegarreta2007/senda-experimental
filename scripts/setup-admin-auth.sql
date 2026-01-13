-- ============================================
-- SENDA - Admin Authentication Setup
-- ============================================
-- Execute this script in your Supabase SQL Editor
-- to set up the authentication system

-- 1. Create profiles table (if it doesn't exist)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'visitor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create RPC function to get current user's role
-- ============================================
-- This function bypasses Row Level Security (RLS)
-- and allows authenticated users to read their own role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.profiles 
    WHERE id = auth.uid()
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;

-- 3. Set your user as admin
-- ============================================
-- Replace 'technologyreta@gmail.com' with your email if different
INSERT INTO public.profiles (id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'technologyreta@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';

-- 4. Verify the setup
-- ============================================
-- This query should return your user with role = 'admin'
SELECT 
  u.email,
  p.role,
  p.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'technologyreta@gmail.com';

-- ============================================
-- OPTIONAL: Row Level Security (RLS)
-- ============================================
-- You can enable RLS for extra security, but it's not required
-- since we're using the RPC function

-- Enable RLS on profiles table
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
-- CREATE POLICY "Users can read own profile" 
-- ON public.profiles FOR SELECT 
-- TO authenticated 
-- USING (auth.uid() = id);

-- ============================================
-- Setup Complete!
-- ============================================
-- After running this script:
-- 1. Reload your application
-- 2. Navigate to /#/login
-- 3. Login with your credentials
-- 4. You should be redirected to /admin
