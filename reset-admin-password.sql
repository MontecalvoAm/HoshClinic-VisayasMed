-- EXPLICIT PASSWORD UPDATE SCRIPT
-- Run this if "Invalid login credentials" persists.

UPDATE auth.users 
SET encrypted_password = '$2b$10$AOOaYphNiD1ZOPa3tQClv.IdvkFALPgz6EjWoEPKyA/sVRwQt1PMK',
    email_confirmed_at = now(),
    updated_at = now(),
    raw_app_meta_data = '{"provider":"email","providers":["email"]}',
    raw_user_meta_data = '{"full_name":"Admin User"}',
    role = 'authenticated'
WHERE email = 'admin@visayasmed.com.ph';

-- Also ensure the sync to public."M_Users" is correct
DO $$
DECLARE
    admin_id UUID;
    super_admin_role_id UUID;
BEGIN
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@visayasmed.com.ph';
    SELECT "RoleID" INTO super_admin_role_id FROM public."M_Roles" WHERE "RoleName" = 'Super Admin';

    IF admin_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM public."M_Users" WHERE "Email" = 'admin@visayasmed.com.ph') THEN
            INSERT INTO public."M_Users" ("UserID", "Email", "FullName", "RoleID", "ActionType")
            VALUES (admin_id, 'admin@visayasmed.com.ph', 'Admin User', super_admin_role_id, 'INSERT');
        ELSE
            UPDATE public."M_Users" 
            SET "RoleID" = super_admin_role_id, "UserID" = admin_id
            WHERE "Email" = 'admin@visayasmed.com.ph';
        END IF;
    END IF;
END $$;
