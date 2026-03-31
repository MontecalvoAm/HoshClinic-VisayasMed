-- UNIFIED SETUP & ADMIN INSERTION SCRIPT
-- This script ensures all tables are created with the correct PascalCase naming
-- and then inserts the admin user.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLES WITH DOUBLE QUOTES (To preserve PascalCase)
CREATE TABLE IF NOT EXISTS public."M_ReferenceTableStatus" (
    "ReferenceID" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "ReferenceGroup" VARCHAR(50) NOT NULL,
    "ReferenceCode" VARCHAR(50) NOT NULL,
    "ReferenceValue" VARCHAR(255) NOT NULL,
    "CreatedBy" UUID,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "UpdatedBy" UUID,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "IsDeleted" SMALLINT DEFAULT 0 NOT NULL,
    "DeletedBy" UUID,
    "DeletedAt" TIMESTAMP WITH TIME ZONE,
    "ActionType" VARCHAR(50) DEFAULT 'INSERT',
    UNIQUE("ReferenceGroup", "ReferenceCode")
);

CREATE TABLE IF NOT EXISTS public."M_Module" (
    "ModuleID" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "ModuleName" VARCHAR(100) NOT NULL,
    "Description" TEXT,
    "CreatedBy" UUID,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "UpdatedBy" UUID,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "IsDeleted" SMALLINT DEFAULT 0 NOT NULL,
    "DeletedBy" UUID,
    "DeletedAt" TIMESTAMP WITH TIME ZONE,
    "ActionType" VARCHAR(50) DEFAULT 'INSERT'
);

CREATE TABLE IF NOT EXISTS public."M_Roles" (
    "RoleID" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "RoleName" VARCHAR(50) UNIQUE NOT NULL,
    "CreatedBy" UUID,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "UpdatedBy" UUID,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "IsDeleted" SMALLINT DEFAULT 0 NOT NULL,
    "DeletedBy" UUID,
    "DeletedAt" TIMESTAMP WITH TIME ZONE,
    "ActionType" VARCHAR(50) DEFAULT 'INSERT'
);

-- Seed Roles
INSERT INTO public."M_Roles" ("RoleName") VALUES 
('Super Admin'),
('Admin'),
('Doctor'),
('Staff'),
('Patient')
ON CONFLICT ("RoleName") DO NOTHING;

CREATE TABLE IF NOT EXISTS public."M_Users" (
    "UserID" UUID PRIMARY KEY REFERENCES auth.users(id),
    "Email" VARCHAR(255) UNIQUE NOT NULL,
    "FullName" VARCHAR(100) NOT NULL,
    "RoleID" UUID REFERENCES public."M_Roles"("RoleID"),
    "CreatedBy" UUID,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "UpdatedBy" UUID,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "IsDeleted" SMALLINT DEFAULT 0 NOT NULL,
    "DeletedBy" UUID,
    "DeletedAt" TIMESTAMP WITH TIME ZONE,
    "ActionType" VARCHAR(50) DEFAULT 'INSERT'
);

-- Note: Other tables can be created later or via schema.sql. 
-- We'll focus on the ones needed for login and the error reported.

-- 3. ADMIN USER INSERTION BLOCK
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
    super_admin_role_id UUID;
BEGIN
    -- Get Super Admin Role ID
    SELECT "RoleID" INTO super_admin_role_id FROM public."M_Roles" WHERE "RoleName" = 'Super Admin';

    -- Check if user already exists in auth.users
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@visayasmed.com.ph') THEN
        
        INSERT INTO auth.users (
            id, instance_id, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
            role, confirmation_token, email_change, email_change_token_new, recovery_token
        )
        VALUES (
            new_user_id, '00000000-0000-0000-0000-000000000000',
            'admin@visayasmed.com.ph',
            '$2b$10$AOOaYphNiD1ZOPa3tQClv.IdvkFALPgz6EjWoEPKyA/sVRwQt1PMK', -- @VisayasM3d
            now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Admin User"}',
            now(), now(), 'authenticated', '', '', '', ''
        );

        -- Link to public."M_Users"
        INSERT INTO public."M_Users" ("UserID", "Email", "FullName", "RoleID", "ActionType")
        VALUES (new_user_id, 'admin@visayasmed.com.ph', 'Admin User', super_admin_role_id, 'INSERT');

        RAISE NOTICE 'Admin user created successfully with ID: %', new_user_id;
    ELSE
        -- Sync if in auth but not M_Users
        IF NOT EXISTS (SELECT 1 FROM public."M_Users" WHERE "Email" = 'admin@visayasmed.com.ph') THEN
            SELECT id INTO new_user_id FROM auth.users WHERE email = 'admin@visayasmed.com.ph';
            INSERT INTO public."M_Users" ("UserID", "Email", "FullName", "RoleID", "ActionType")
            VALUES (new_user_id, 'admin@visayasmed.com.ph', 'Admin User', super_admin_role_id, 'INSERT');
            RAISE NOTICE 'Existing auth user linked to M_Users: %', new_user_id;
        ELSE
            RAISE NOTICE 'User already exists in both auth.users and M_Users.';
        END IF;
    END IF;
END $$;
