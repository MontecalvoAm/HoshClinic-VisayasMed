-- Make DoctorID nullable in T_Appointments to support unassigned bookings
ALTER TABLE public."T_Appointments" 
ALTER COLUMN "DoctorID" DROP NOT NULL;
