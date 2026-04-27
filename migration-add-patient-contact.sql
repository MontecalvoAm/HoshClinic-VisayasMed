-- Add contact fields to M_Patients
ALTER TABLE public."M_Patients" 
ADD COLUMN IF NOT EXISTS "Email" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "PhoneNumber" VARCHAR(50);
