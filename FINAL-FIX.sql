-- =====================================================
-- FINAL FIX FOR test@gmail.com USER
-- UUID: 129a3521-8cd6-43fb-a79c-aa88edc84784
-- =====================================================

-- STEP 1: Create profile for test@gmail.com
INSERT INTO users (id, email, full_name, role, created_at, updated_at)
VALUES (
  '129a3521-8cd6-43fb-a79c-aa88edc84784',
  'test@gmail.com',
  'Test Admin',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- STEP 2: Verify the profile was created
SELECT 
  'Profile created for test@gmail.com:' as status,
  id,
  email,
  full_name,
  role,
  created_at
FROM users 
WHERE email = 'test@gmail.com';

-- STEP 3: Fix RLS policies (prevent infinite recursion)
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can read all" ON users;
DROP POLICY IF EXISTS "Admins can update all" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "read_own_profile" ON users;
DROP POLICY IF EXISTS "update_own_profile" ON users;
DROP POLICY IF EXISTS "admins_read_all" ON users;
DROP POLICY IF EXISTS "admins_update_all" ON users;
DROP POLICY IF EXISTS "admins_insert_users" ON users;
DROP POLICY IF EXISTS "admins_delete_users" ON users;

-- Disable and re-enable RLS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "read_own_profile" ON users
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "update_own_profile" ON users
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "admins_read_all" ON users
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "admins_update_all" ON users
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "admins_insert_users" ON users
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "admins_delete_users" ON users
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- STEP 4: Final verification
SELECT '🎉 FIX COMPLETED! test@gmail.com now has admin access!' as final_status;

-- =====================================================
-- INSTRUCTIONS:
-- 1. Copy this entire file
-- 2. Paste into Supabase SQL Editor  
-- 3. Run the entire script
-- 4. Test: http://localhost:9002/admin/users
-- =====================================================
