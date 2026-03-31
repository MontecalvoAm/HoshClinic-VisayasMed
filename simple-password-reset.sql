-- SIMPLE PASSWORD RESET (FOR TESTING)
-- Email: admin@visayasmed.com.ph
-- Password: password123

UPDATE auth.users 
SET encrypted_password = crypt('password123', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now(),
    aud = 'authenticated',
    role = 'authenticated'
WHERE email = 'admin@visayasmed.com.ph';
