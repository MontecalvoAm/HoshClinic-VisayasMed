-- Migration: Add Patient Findings Table
-- Belonging strictly to PatientID as per user feedback.

CREATE TABLE IF NOT EXISTS public."T_PatientFindings" (
    "FindingID" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "PatientID" UUID REFERENCES public."M_Patients"("PatientID") NOT NULL,
    "DoctorID" UUID REFERENCES public."M_Doctors"("DoctorID"), -- Authorized specialist
    "Title" VARCHAR(255) NOT NULL,
    "FindingType" VARCHAR(50) NOT NULL, -- e.g., X-ray, Lab, MRI
    "FileURL" TEXT NOT NULL,
    "Notes" TEXT,
    "CreatedBy" UUID,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "UpdatedBy" UUID,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "IsDeleted" SMALLINT DEFAULT 0 NOT NULL,
    "ActionType" VARCHAR(50) DEFAULT 'INSERT'
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS "idx_findings_patient" ON public."T_PatientFindings"("PatientID");
