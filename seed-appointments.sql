-- Seed Appointment Statuses
INSERT INTO public."M_ReferenceTableStatus" ("ReferenceGroup", "ReferenceCode", "ReferenceValue")
VALUES 
('APPOINTMENT_STATUS', 'PENDING', 'Pending'),
('APPOINTMENT_STATUS', 'CONFIRMED', 'Confirmed'),
('APPOINTMENT_STATUS', 'CANCELLED', 'Cancelled'),
('APPOINTMENT_STATUS', 'COMPLETED', 'Completed')
ON CONFLICT ("ReferenceGroup", "ReferenceCode") DO UPDATE 
SET "ReferenceValue" = EXCLUDED."ReferenceValue";

-- Seed Case Types
INSERT INTO public."M_ReferenceTableStatus" ("ReferenceGroup", "ReferenceCode", "ReferenceValue")
VALUES 
('CASE_TYPE', 'CHECK_UP', 'Check Up'),
('CASE_TYPE', 'CONSULTATION', 'Consultation'),
('CASE_TYPE', 'EMERGENCY', 'Emergency'),
('CASE_TYPE', 'FOLLOW_UP', 'Follow-up'),
('CASE_TYPE', 'VACCINATION', 'Vaccination')
ON CONFLICT ("ReferenceGroup", "ReferenceCode") DO UPDATE 
SET "ReferenceValue" = EXCLUDED."ReferenceValue";
