-- ===========================================
-- ADD HR ROLE MIGRATION
-- Run this script to add HR role to existing database
-- ===========================================

-- Drop existing constraint and add new one with HR role
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('patient', 'doctor', 'admin', 'hr'));

SELECT 'HR role added successfully!' as status;
