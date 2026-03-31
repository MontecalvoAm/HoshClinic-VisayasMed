-- DROP REDUNDANT LOWERCASE TABLES
-- Run this in your Supabase SQL Editor to clean up the database.
-- WARNING: This will permanently delete data in these tables. 
-- Ensure you have no important data in these lowercase tables before running.

DROP TABLE IF EXISTS public.m_doctors CASCADE;
DROP TABLE IF EXISTS public.m_module CASCADE;
DROP TABLE IF EXISTS public.m_patients CASCADE;
DROP TABLE IF EXISTS public.m_referencetable CASCADE;
DROP TABLE IF EXISTS public.m_roles CASCADE;
DROP TABLE IF EXISTS public.m_users CASCADE;
DROP TABLE IF EXISTS public.mt_rolepermissions CASCADE;
DROP TABLE IF EXISTS public.mt_useroverride CASCADE;
DROP TABLE IF EXISTS public.t_appointments CASCADE;
DROP TABLE IF EXISTS public.t_billing CASCADE;

-- Note: The PascalCase tables (e.g., "M_Users") are preserved 
-- because they were created with double quotes and are case-sensitive.
