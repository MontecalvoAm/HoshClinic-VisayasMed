CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Using double quotes for all PascalCase Table and Column names to prevent lowercase folding in PostgreSQL

-- 1. REFERENCE TABLE (Central Status/Lookup)
CREATE TABLE IF NOT EXISTS public."M_ReferenceTableStatus" (
    "ReferenceID" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "ReferenceGroup" VARCHAR(50) NOT NULL,
    "ReferenceCode" VARCHAR(50) NOT NULL,
    "ReferenceValue" VARCHAR(255) NOT NULL,
    -- Audit Columns
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

-- 2. MODULE TABLE
CREATE TABLE IF NOT EXISTS public."M_Module" (
    "ModuleID" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "ModuleName" VARCHAR(100) NOT NULL,
    "Description" TEXT,
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

-- 3. ROLES TABLE
CREATE TABLE IF NOT EXISTS public."M_Roles" (
    "RoleID" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "RoleName" VARCHAR(50) UNIQUE NOT NULL,
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

-- Seed Roles
INSERT INTO public."M_Roles" ("RoleName") VALUES 
('Super Admin'),
('Admin'),
('Doctor'),
('Staff'),
('Patient')
ON CONFLICT ("RoleName") DO NOTHING;

-- 4. USERS TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public."M_Users" (
    "UserID" UUID PRIMARY KEY REFERENCES auth.users(id),
    "Email" VARCHAR(255) UNIQUE NOT NULL,
    "FirstName" VARCHAR(100),
    "LastName" VARCHAR(100),
    "MiddleName" VARCHAR(100),
    "FullName" VARCHAR(100) NOT NULL,
    "RoleID" UUID REFERENCES public."M_Roles"("RoleID"),
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

-- 5. USER DETAILS TABLE (More detailed user information)
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

-- 6. ROLE PERMISSION (Mapping)
CREATE TABLE IF NOT EXISTS public."MT_RolePermission" (
    "RolePermissionID" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "RoleID" UUID REFERENCES public."M_Roles"("RoleID"),
    "ModuleID" UUID REFERENCES public."M_Module"("ModuleID"),
    "PermissionType" VARCHAR(50) NOT NULL,
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

-- 6. USER OVERRIDE (Mapping)
CREATE TABLE IF NOT EXISTS public."MT_UserOverride" (
    "OverrideID" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "UserID" UUID REFERENCES public."M_Users"("UserID"),
    "ModuleID" UUID REFERENCES public."M_Module"("ModuleID"),
    "PermissionType" VARCHAR(50) NOT NULL,
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

-- 7. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public."M_Doctors" (
    "DoctorID" UUID PRIMARY KEY REFERENCES public."M_Users"("UserID"),
    "Specialization" VARCHAR(100) NOT NULL,
    "LicenseNumber" VARCHAR(50),
    "Bio" TEXT,
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

-- 8. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public."M_Patients" (
    "PatientID" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "UserID" UUID REFERENCES public."M_Users"("UserID"),
    "FirstName" VARCHAR(100) NOT NULL,
    "LastName" VARCHAR(100) NOT NULL,
    "DateOfBirth" DATE,
    "GenderID" UUID REFERENCES public."M_ReferenceTableStatus"("ReferenceID"),
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

-- 9. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public."T_Appointments" (
    "AppointmentID" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "PatientID" UUID REFERENCES public."M_Patients"("PatientID") NOT NULL,
    "DoctorID" UUID REFERENCES public."M_Doctors"("DoctorID") NOT NULL,
    "AppointmentDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "StatusID" UUID REFERENCES public."M_ReferenceTableStatus"("ReferenceID"),
    "Reason" TEXT,
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

-- 10. BILLING TABLE
CREATE TABLE IF NOT EXISTS public."T_Billing" (
    "BillingID" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "AppointmentID" UUID REFERENCES public."T_Appointments"("AppointmentID"),
    "PatientID" UUID REFERENCES public."M_Patients"("PatientID") NOT NULL,
    "TotalAmount" DECIMAL(10, 2) NOT NULL,
    "StatusID" UUID REFERENCES public."M_ReferenceTableStatus"("ReferenceID"),
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
