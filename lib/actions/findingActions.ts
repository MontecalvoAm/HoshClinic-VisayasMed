"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

/**
 * Fetches all findings/documents for a specific patient.
 */
export async function getPatientFindings(patientID: string) {
  const { data, error } = await supabase
    .from('T_PatientFindings')
    .select(`
      *,
      M_Doctors (
        M_Users (
          FullName
        )
      )
    `)
    .eq('PatientID', patientID)
    .eq('IsDeleted', 0)
    .order('CreatedAt', { ascending: false });

  if (error) {
    console.error("Error fetching findings:", error);
    return [];
  }

  return data.map((f: any) => ({
    id: f.FindingID,
    title: f.Title,
    type: f.FindingType,
    url: f.FileURL,
    notes: f.Notes,
    date: new Date(f.CreatedAt).toLocaleDateString(),
    doctor: f.M_Doctors?.M_Users?.FullName || "System / Unassigned"
  }));
}

/**
 * Simulated upload finding (Full implementation requires Supabase Storage setup)
 */
export async function uploadFinding(patientID: string, title: string, category: string, fileURL: string) {
  try {
    const { error } = await supabase
      .from('T_PatientFindings')
      .insert({
        PatientID: patientID,
        Title: title,
        FindingType: category,
        FileURL: fileURL,
        CreatedAt: new Date().toISOString()
      });

    if (error) throw error;

    revalidatePath('/admin/patients');
    return { success: true };
  } catch (err: any) {
    console.error("Error saving finding:", err);
    return { success: false, error: err.message };
  }
}
