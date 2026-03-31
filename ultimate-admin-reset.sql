-- ULTIMATE ADMIN RESET SCRIPT
-- This script completely removes and recreates the admin user.
-- Proceed with caution: this will delete the existing admin user!

DO $$
DECLARE
    new_user_id UUID := '6c3b2b74-2af2-4b65-8b35-d109f2571234'; -- Fixed UUID for consistency
    super_admin_role_id UUID;
BEGIN
    -- 1. Get Super Admin Role ID
    SELECT "RoleID" INTO super_admin_role_id FROM public."M_Roles" WHERE "RoleName" = 'Super Admin';
    
    -- 2. Delete existing user from all related tables to start fresh
    DELETE FROM public."M_Users" WHERE "Email" = 'admin@visayasmed.com.ph';
    DELETE FROM auth.users WHERE email = 'admin@visayasmed.com.ph';

    -- 3. Insert into auth.users with all critical columns
    INSERT INTO auth.users (
        id, 
        instance_id, 
        email, 
        encrypted_password, 
        email_confirmed_at,
        raw_app_meta_data, 
        raw_user_meta_data, 
        created_at, 
        updated_at,
        role, 
        aud,
        confirmation_token, 
        email_change, 
        email_change_token_new, 
        recovery_token,
        is_super_admin,
        is_sso_user
    )
    VALUES (
        new_user_id, 
        '00000000-0000-0000-0000-000000000000',
        'admin@visayasmed.com.ph',
        '$2b$10$AOOaYphNiD1ZOPa3tQClv.IdvkFALPgz6EjWoEPKyA/sVRwQt1PMK', -- @VisayasM3d
        now(), 
        '{"provider":"email","providers":["email"]}', 
        '{"full_name":"Admin User"}',
        now(), 
        now(), 
        'authenticated', 
        'authenticated',
        '', 
        '', 
        '', 
        '',
        false,
        false
    );

    -- 4. Insert into public."M_Users"
    INSERT INTO public."M_Users" ("UserID", "Email", "FullName", "RoleID", "ActionType")
    VALUES (new_user_id, 'admin@visayasmed.com.ph', 'Admin User', super_admin_role_id, 'INSERT');

    RAISE NOTICE 'Admin user completely reset with ID: %', new_user_id;
END $$;
