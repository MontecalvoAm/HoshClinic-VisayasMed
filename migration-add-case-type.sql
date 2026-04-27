-- Add CaseTypeID to T_Appointments
ALTER TABLE public."T_Appointments" 
ADD COLUMN IF NOT EXISTS "CaseTypeID" UUID REFERENCES public."M_ReferenceTableStatus"("ReferenceID");
