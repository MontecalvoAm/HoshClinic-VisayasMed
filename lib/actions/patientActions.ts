"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

/**
 * Fetches all active patient records for the EMR dashboard.
 */
export async function getPatients() {
  // 1. Fetch patients
  const { data: patients, error: pError } = await supabase
    .from('M_Patients')
    .select('*')
    .eq('IsDeleted', 0)
    .order('CreatedAt', { ascending: false });

  if (pError) {
    console.error("Error fetching patients:", pError.message, "| Details:", pError.details);
    return [];
  }

  // 2. Fetch all relevant lookup data in one go to avoid N+1 queries
  const { data: lookups, error: lError } = await supabase
    .from('M_ReferenceTableStatus')
    .select('ReferenceID, ReferenceValue, ReferenceGroup')
    .in('ReferenceGroup', ['GENDER', 'BLOOD_TYPE', 'CIVIL_STATUS'])
    .eq('IsDeleted', 0);

  if (lError) {
    console.error("Error fetching lookups:", lError.message);
  }

  // 3. Create a lookup map for quick access
  const lookupMap = (lookups || []).reduce((acc: any, item: any) => {
    acc[item.ReferenceID] = item.ReferenceValue;
    return acc;
  }, {});

  // 4. Map the data in JS
  return patients.map((p: any) => ({
    id: p.PatientID,
    name: `${p.FirstName} ${p.LastName}`,
    firstName: p.FirstName,
    lastName: p.LastName,
    middleName: p.MiddleName || "",
    email: p.Email || "N/A",
    phone: p.PhoneNumber || "N/A",
    dob: p.DateOfBirth,
    gender: lookupMap[p.GenderID] || "N/A",
    civilStatus: lookupMap[p.CivilStatusID] || "N/A",
    bloodType: lookupMap[p.BloodTypeID] || "N/A",
    address: p.Address || "N/A",
    city: p.City || "",
    state: p.StateProvince || "",
    lastVisit: p.CreatedAt ? new Date(p.CreatedAt).toISOString().split('T')[0] : "N/A",
    status: "Active" 
  }));
}

/**
 * Fetches all lookup values for a specific group (e.g., GENDER, BLOOD_TYPE).
 */
export async function getLookups(group: string) {
  const { data, error } = await supabase
    .from('M_ReferenceTableStatus')
    .select('ReferenceID, ReferenceValue')
    .eq('ReferenceGroup', group)
    .eq('IsDeleted', 0);

  if (error) {
    console.error(`Error fetching lookups for ${group}:`, error);
    return [];
  }

  return data.map(item => ({
    id: item.ReferenceID,
    label: item.ReferenceValue
  }));
}

/**
 * Updates a patient's information.
 */
export async function updatePatient(patientID: string, data: any) {
  try {
    const { error } = await supabase
      .from('M_Patients')
      .update({
        FirstName: data.firstName,
        LastName: data.lastName,
        MiddleName: data.middleName,
        DateOfBirth: data.dob,
        GenderID: data.genderID,
        CivilStatusID: data.civilStatusID,
        BloodTypeID: data.bloodTypeID,
        PhoneNumber: data.phone,
        Email: data.email,
        Address: data.address,
        City: data.city,
        StateProvince: data.state,
        PostalCode: data.postalCode,
        Occupation: data.occupation,
        UpdatedAt: new Date().toISOString()
      })
      .eq('PatientID', patientID);

    if (error) throw error;

    revalidatePath('/admin/patients');
    revalidatePath('/admin/appointments');
    return { success: true };
  } catch (err: any) {
    console.error("Error updating patient:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Soft deletes a patient record.
 */
export async function deletePatient(patientID: string) {
  try {
    const { error } = await supabase
      .from('M_Patients')
      .update({ 
        IsDeleted: 1,
        UpdatedAt: new Date().toISOString()
      })
      .eq('PatientID', patientID);

    if (error) throw error;

    revalidatePath('/admin/patients');
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting patient:", err);
    return { success: false, error: err.message };
  }
}
