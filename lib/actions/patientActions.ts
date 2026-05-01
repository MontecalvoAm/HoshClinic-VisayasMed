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
export async function updatePatient(patientId: string, data: any) {
  try {
    // 1. Fetch all relevant lookup data
    const { data: lookups, error: lError } = await supabase
      .from("M_ReferenceTableStatus")
      .select("ReferenceID, ReferenceValue, ReferenceGroup")
      .in("ReferenceGroup", ["GENDER", "BLOOD_TYPE", "CIVIL_STATUS"])
      .eq("IsDeleted", 0);

    if (lError) {
      throw new Error(`Error fetching lookups: ${lError.message}`);
    }

    // 2. Create a reverse lookup map for quick access
    const lookupMap = (lookups || []).reduce((acc: any, item: any) => {
      if (!acc[item.ReferenceGroup]) {
        acc[item.ReferenceGroup] = {};
      }
      acc[item.ReferenceGroup][item.ReferenceValue] = item.ReferenceID;
      return acc;
    }, {});

    // 3. Map form data to database schema, converting string values to IDs
    const patientData = {
      FirstName: data.first_name,
      LastName: data.last_name,
      MiddleName: data.middle_name,
      DateOfBirth: data.birth_date,
      GenderID: lookupMap["GENDER"]?.[data.gender],
      CivilStatusID: lookupMap["CIVIL_STATUS"]?.[data.civil_status],
      BloodTypeID: lookupMap["BLOOD_TYPE"]?.[data.blood_type],
      Address: data.address,
      PhoneNumber: data.contact_number,
      UpdatedAt: new Date().toISOString(),
    };

    // 4. Perform the update
    const { error } = await supabase
      .from("M_Patients")
      .update(patientData)
      .eq("PatientID", patientId);

    if (error) {
      console.error("Error updating patient:", error);
      throw error;
    }

    revalidatePath("/admin/patients");
    return { success: true };
  } catch (err: any) {
    console.error("Error in updatePatient:", err);
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
