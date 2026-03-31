-- MIGRATION: EXPAND USER SCHEMA
-- Run this in your Supabase SQL Editor to apply changes to the existing database.

-- 1. ADAPT M_Users Table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'M_Users' AND column_name = 'FirstName') THEN
        ALTER TABLE public."M_Users" ADD COLUMN "FirstName" VARCHAR(100);
        ALTER TABLE public."M_Users" ADD COLUMN "LastName" VARCHAR(100);
        ALTER TABLE public."M_Users" ADD COLUMN "MiddleName" VARCHAR(100);
    END IF;
END $$;

-- 2. CREATE M_UserDetails Table
CREATE TABLE IF NOT EXISTS public."M_UserDetails" (
    "UserDetailID" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "UserID" UUID REFERENCES public."M_Users"("UserID") UNIQUE NOT NULL,
    "DateOfBirth" DATE,
    "Gender" VARCHAR(50),
    "Nationality" VARCHAR(100),
    "MaritalStatus" VARCHAR(50),
    "PhoneNumber" VARCHAR(50),
    "Address" TEXT,
    "City" VARCHAR(100),
    "StateProvince" VARCHAR(100),
    "PostalCode" VARCHAR(20),
    "Country" VARCHAR(100),
    "ProfilePictureURL" TEXT,
    -- Audit Columns
    "CreatedBy" UUID,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "UpdatedBy" UUID,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "IsDeleted" SMALLINT DEFAULT 0 NOT NULL,
    "DeletedBy" UUID,
    "DeletedAt" TIMESTAMP WITH TIME ZONE,
    "ActionType" VARCHAR(50) DEFAULT 'INSERT'
);

-- Note: All existing constraints and indices are maintained.
