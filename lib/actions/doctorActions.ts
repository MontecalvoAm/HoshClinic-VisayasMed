"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getDoctors(page: number = 1, pageSize: number = 8, searchQuery: string = "") {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Fetch users who have the role "Doctor"
  let query = supabase
    .from('M_Users')
    .select(`
      UserID,
      FullName,
      Email,
      M_Roles!inner (
        RoleName
      ),
      M_Doctors (
        Specialization,
        LicenseNumber,
        Bio
      )
    `, { count: 'exact' })
    .eq('M_Roles.RoleName', 'Doctor')
    .eq('IsDeleted', 0);

  if (searchQuery) {
    query = query.or(`FullName.ilike.%${searchQuery}%,Email.ilike.%${searchQuery}%`);
  }

  const { data, error, count } = await query
    .range(from, to)
    .order('CreatedAt', { ascending: false });

  if (error) {
    console.error("Error fetching doctors:", error);
    return { data: [], count: 0 };
  }

  const doctorsWithDetails = await Promise.all(data.map(async (user: any) => {
    const doctorProfile = user.M_Doctors?.[0] || {};
    
    // Get appointment count
    const { count: aptCount } = await supabase
      .from('T_Appointments')
      .select('*', { count: 'exact', head: true })
      .eq('DoctorID', user.UserID);

    return {
      id: user.UserID,
      name: user.FullName,
      email: user.Email,
      specialization: doctorProfile.Specialization || "General Specialist",
      licenseNumber: doctorProfile.LicenseNumber || "Pending",
      bio: doctorProfile.Bio || "",
      appointments: aptCount || 0,
      status: 'Active',
      rating: 5.0
    };
  }));

  return {
    data: doctorsWithDetails,
    count: count || 0
  };
}

export async function createDoctor(payload: {
  fullName: string;
  email: string;
  specialization: string;
  licenseNumber?: string;
  bio?: string;
}) {
  try {
    // Note: In a real app, you'd also create an auth user. 
    // Here we assume the user might exist or we just create the records in M_Users and M_Doctors.
    // For simplicity, we'll generate a UUID for a dummy link if auth isn't handled here.
    
    // 1. Check if user exists in M_Users by email
    const { data: existingUser } = await supabase
      .from('M_Users')
      .select('UserID, FullName')
      .eq('Email', payload.email)
      .single();

    let userId = existingUser?.UserID;

    if (!existingUser) {
      return { 
        success: false, 
        error: `Account Not Found: The email '${payload.email}' is not registered in the system. A user account must be created first before assigning a specialist profile.` 
      };
    }

    // 2. Check if this user is already a doctor
    const { data: existingDoctor } = await supabase
      .from('M_Doctors')
      .select('DoctorID')
      .eq('DoctorID', userId)
      .single();

    if (existingDoctor) {
      return { 
        success: false, 
        error: `Duplicate Profile: ${existingUser.FullName} is already registered as a medical specialist.` 
      };
    }

    // 3. Create Doctor entry
    const { error: doctorError } = await supabase
      .from('M_Doctors')
      .insert([{
        DoctorID: userId,
        Specialization: payload.specialization,
        LicenseNumber: payload.licenseNumber,
        Bio: payload.bio,
        ActionType: 'INSERT'
      }]);

    if (doctorError) throw doctorError;

    revalidatePath('/admin/doctors');
    return { success: true };
  } catch (error: any) {
    console.error("Error creating doctor:", error);
    return { success: false, error: error.message };
  }
}
