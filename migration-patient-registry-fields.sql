-- 1. ADD CLINICAL FIELDS TO M_Patients
ALTER TABLE public."M_Patients" 
ADD COLUMN IF NOT EXISTS "MiddleName" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "Address" TEXT,
ADD COLUMN IF NOT EXISTS "City" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "StateProvince" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "PostalCode" VARCHAR(20),
ADD COLUMN IF NOT EXISTS "Country" VARCHAR(100) DEFAULT 'Philippines',
ADD COLUMN IF NOT EXISTS "CivilStatusID" UUID REFERENCES public."M_ReferenceTableStatus"("ReferenceID"),
ADD COLUMN IF NOT EXISTS "BloodTypeID" UUID REFERENCES public."M_ReferenceTableStatus"("ReferenceID"),
ADD COLUMN IF NOT EXISTS "Occupation" VARCHAR(100);

-- 2. SEED LOOKUP VALUES (GENDER, CIVIL_STATUS, BLOOD_TYPE)
INSERT INTO public."M_ReferenceTableStatus" ("ReferenceGroup", "ReferenceCode", "ReferenceValue")
VALUES 
-- Gender
('GENDER', 'MALE', 'Male'),
('GENDER', 'FEMALE', 'Female'),
('GENDER', 'OTHER', 'Other'),
-- Civil Status
('CIVIL_STATUS', 'SINGLE', 'Single'),
('CIVIL_STATUS', 'MARRIED', 'Married'),
('CIVIL_STATUS', 'WIDOWED', 'Widowed'),
('CIVIL_STATUS', 'DIVORCED', 'Divorced'),
('CIVIL_STATUS', 'SEPARATED', 'Separated'),
-- Blood Type
('BLOOD_TYPE', 'A_POS', 'A+'),
('BLOOD_TYPE', 'A_NEG', 'A-'),
('BLOOD_TYPE', 'B_POS', 'B+'),
('BLOOD_TYPE', 'B_NEG', 'B-'),
('BLOOD_TYPE', 'AB_POS', 'AB+'),
('BLOOD_TYPE', 'AB_NEG', 'AB-'),
('BLOOD_TYPE', 'O_POS', 'O+'),
('BLOOD_TYPE', 'O_NEG', 'O-')
ON CONFLICT ("ReferenceGroup", "ReferenceCode") DO UPDATE 
SET "ReferenceValue" = EXCLUDED."ReferenceValue";
