-- RESET ALL USERS PASSWORD SCRIPT
-- This script sets the password for all users in auth.users to '@VisayasM3d'
-- Use this to unlock users who were created without a password.

-- Target Password: @VisayasM3d
-- Hash: $2b$10$AOOaYphNiD1ZOPa3tQClv.IdvkFALPgz6EjWoEPKyA/sVRwQt1PMK

UPDATE auth.users
SET encrypted_password = '$2b$10$AOOaYphNiD1ZOPa3tQClv.IdvkFALPgz6EjWoEPKyA/sVRwQt1PMK'
WHERE email != 'admin@visayasmed.com.ph'; -- Safety: don't touch the main admin if it's working
