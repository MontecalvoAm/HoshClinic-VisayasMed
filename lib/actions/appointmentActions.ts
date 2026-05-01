"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

/**
 * Fetches all active case types for the booking form dropdown.
 */
export async function getCaseTypes() {
  const { data, error } = await supabase
    .from('M_ReferenceTableStatus')
    .select('ReferenceID, ReferenceValue')
    .eq('ReferenceGroup', 'CASE_TYPE')
    .eq('IsDeleted', 0);

  if (error) {
    console.error("Error fetching case types:", error);
    return [];
  }

  return data.map(item => ({
    id: item.ReferenceID,
    label: item.ReferenceValue
  }));
}

/**
 * Handles the creation of a new appointment, including guest patient creation.
 */
export async function createAppointment(formData: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  caseTypeID: string;
  preferredDate: string;
  doctorID?: string;
  reason?: string;
}) {
  try {
    // 1. Get the PENDING status ID
    const { data: statusData, error: statusError } = await supabase
      .from('M_ReferenceTableStatus')
      .select('ReferenceID')
      .eq('ReferenceGroup', 'APPOINTMENT_STATUS')
      .eq('ReferenceCode', 'PENDING')
      .single();

    if (statusError) throw new Error("Could not find PENDING status ID");
    const pendingStatusID = statusData.ReferenceID;

    // 2. Find or create patient record
    // We try to find a patient with the same email first to avoid duplicates
    const { data: existingPatient } = await supabase
      .from('M_Patients')
      .select('PatientID')
      .eq('Email', formData.email)
      .maybeSingle();

    let patientId;

    if (existingPatient) {
      patientId = existingPatient.PatientID;
    } else {
      const { data: newPatient, error: patientError } = await supabase
        .from('M_Patients')
        .insert([{
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Email: formData.email,
          PhoneNumber: formData.phoneNumber,
        }])
        .select()
        .single();

      if (patientError) {
        console.error("Error creating patient:", patientError);
        throw new Error("Failed to create patient record");
      }
      patientId = newPatient.PatientID;
    }

    const appointmentDateUTC = new Date(formData.preferredDate).toISOString();

    // 3. Create appointment
    const { error: appError } = await supabase
      .from('T_Appointments')
      .insert([{
        PatientID: patientId,
        DoctorID: formData.doctorID || null,
        AppointmentDate: appointmentDateUTC,
        StatusID: pendingStatusID,
        CaseTypeID: formData.caseTypeID,
        Reason: formData.reason || ""
      }]);

    if (appError) {
      console.error("Error creating appointment:", appError);
      throw new Error("Failed to create appointment record");
    }

    revalidatePath('/admin/appointments');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Updates an existing appointment's details.
 */
export async function updateAppointment(id: string, updates: {
  doctorID?: string | null;
  statusID?: string;
  caseTypeID?: string;
  appointmentDate?: string;
  reason?: string;
  patientInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }
}) {
  try {
    // 1. Update Appointment details in T_Appointments
    const appointmentUpdate: any = {
      UpdatedAt: new Date().toISOString()
    };
    
    if (updates.doctorID !== undefined) appointmentUpdate.DoctorID = updates.doctorID === "" ? null : updates.doctorID;
    if (updates.statusID) appointmentUpdate.StatusID = updates.statusID;
    if (updates.caseTypeID) appointmentUpdate.CaseTypeID = updates.caseTypeID;
    if (updates.appointmentDate !== undefined) appointmentUpdate.AppointmentDate = updates.appointmentDate;
    if (updates.reason !== undefined) appointmentUpdate.Reason = updates.reason;

    const { data: appData, error: appError } = await supabase
      .from('T_Appointments')
      .update(appointmentUpdate)
      .eq('AppointmentID', id)
      .select('PatientID')
      .single();

    if (appError) throw appError;

    // 2. Update Patient details in M_Patients if provided
    if (updates.patientInfo && appData?.PatientID) {
      const { error: patientError } = await supabase
        .from('M_Patients')
        .update({
          FirstName: updates.patientInfo.firstName,
          LastName: updates.patientInfo.lastName,
          Email: updates.patientInfo.email,
          PhoneNumber: updates.patientInfo.phoneNumber,
        })
        .eq('PatientID', appData.PatientID);
        
      if (patientError) {
        console.error("Error updating patient info:", patientError);
        throw new Error("Failed to update patient record");
      }
    }

    revalidatePath('/admin/appointments');
    return { success: true };
  } catch (err: any) {
    console.error("Error updating appointment:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Deletes an existing appointment.
 */
export async function deleteAppointment(id: string) {
  try {
    const { error } = await supabase
      .from('T_Appointments')
      .delete()
      .eq('AppointmentID', id);

    if (error) throw error;

    revalidatePath('/admin/appointments');
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting appointment:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetches all active statuses for the appointment system.
 */
export async function getStatuses() {
  const { data, error } = await supabase
    .from('M_ReferenceTableStatus')
    .select('ReferenceID, ReferenceValue')
    .eq('ReferenceGroup', 'APPOINTMENT_STATUS')
    .eq('IsDeleted', 0);

  if (error) {
    console.error("Error fetching statuses:", error);
    return [];
  }

  return data.map(item => ({
    id: item.ReferenceID,
    label: item.ReferenceValue
  }));
}

/**
 * Fetches all appointments with joined details for the admin dashboard.
 */
export async function getAppointments() {
  const { data, error } = await supabase
    .from('T_Appointments')
    .select(`
      AppointmentID,
      AppointmentDate,
      Reason,
      PatientID,
      DoctorID,
      StatusID,
      CaseTypeID,
      M_Patients (
        FirstName,
        LastName,
        PhoneNumber,
        Email
      ),
      M_Doctors (
        Specialization,
        M_Users (
          FullName
        )
      ),
      Status:M_ReferenceTableStatus!StatusID (
        ReferenceValue
      ),
      CaseType:M_ReferenceTableStatus!CaseTypeID (
        ReferenceValue
      )
    `)
    .eq('IsDeleted', 0)
    .order('AppointmentDate', { ascending: false });

  if (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }

  return data.map((app: any) => ({
    id: app.AppointmentID,
    patientName: app.M_Patients ? `${app.M_Patients.FirstName} ${app.M_Patients.LastName}` : "Unknown Patient",
    patientFirstName: app.M_Patients?.FirstName || "",
    patientLastName: app.M_Patients?.LastName || "",
    patientPhone: app.M_Patients?.PhoneNumber || "N/A",
    patientEmail: app.M_Patients?.Email || "N/A",
    doctorName: app.M_Doctors?.M_Users?.FullName || "Unassigned",
    doctorID: app.DoctorID || "",
    doctorSpecialization: app.M_Doctors?.Specialization || "General Medicine",
    date: app.AppointmentDate,
    status: app.Status?.ReferenceValue || "Pending",
    statusID: app.StatusID,
    type: app.CaseType?.ReferenceValue || "General",
    caseTypeID: app.CaseTypeID,
    patientID: app.PatientID,
    reason: app.Reason
  }));
}

/**
 * Marks an appointment as COMPLETED and updates the associated patient's registration status.
 */
export async function completeAppointmentRegistration(appointmentID: string) {
  try {
    // 1. Get COMPLETED status ID
    const { data: statusData, error: statusError } = await supabase
      .from('M_ReferenceTableStatus')
      .select('ReferenceID')
      .eq('ReferenceGroup', 'APPOINTMENT_STATUS')
      .eq('ReferenceCode', 'COMPLETED')
      .single();

    if (statusError) throw new Error("Could not find COMPLETED status ID");
    const completedStatusID = statusData.ReferenceID;

    // 2. Update Appointment status
    const { error: appError } = await supabase
      .from('T_Appointments')
      .update({
        StatusID: completedStatusID,
        UpdatedAt: new Date().toISOString()
      })
      .eq('AppointmentID', appointmentID);

    if (appError) throw appError;

    revalidatePath('/admin/appointments');
    revalidatePath('/admin/patients');
    return { success: true };
  } catch (err: any) {
    console.error("Error completing registration:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Directly marks an appointment as CONFIRMED.
 */
export async function confirmAppointment(appointmentID: string) {
  try {
    // 1. Get CONFIRMED status ID
    const { data: statusData, error: statusError } = await supabase
      .from('M_ReferenceTableStatus')
      .select('ReferenceID')
      .eq('ReferenceGroup', 'APPOINTMENT_STATUS')
      .eq('ReferenceCode', 'CONFIRMED')
      .single();

    if (statusError) throw new Error("Could not find CONFIRMED status ID");
    const confirmedStatusID = statusData.ReferenceID;

    // 2. Update Appointment status
    const { error: appError } = await supabase
      .from('T_Appointments')
      .update({
        StatusID: confirmedStatusID,
        UpdatedAt: new Date().toISOString()
      })
      .eq('AppointmentID', appointmentID);

    if (appError) throw appError;

    revalidatePath('/admin/appointments');
    return { success: true };
  } catch (err: any) {
    console.error("Error confirming appointment:", err);
    return { success: false, error: err.message };
  }
}
