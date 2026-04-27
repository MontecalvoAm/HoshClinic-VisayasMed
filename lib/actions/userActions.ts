"use server";

import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function getUsers(
  page: number = 1, 
  pageSize: number = 10, 
  searchQuery: string = "", 
  roleFilter: string = "All Roles",
  dateFilter: string = "All Time"
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('M_Users')
    .select(`
      UserID,
      FirstName,
      LastName,
      MiddleName,
      FullName,
      Email,
      CreatedAt,
      RoleID,
      M_Roles!inner (
        RoleName
      )
    `, { count: 'exact' })
    .eq('IsDeleted', 0);

  if (searchQuery) {
    query = query.ilike('FullName', `%${searchQuery}%`);
  }

  if (roleFilter !== "All Roles") {
    query = query.eq('M_Roles.RoleName', roleFilter);
  }

  if (dateFilter !== "All Time") {
    // If it's a specific date (YYYY-MM-DD)
    const startDate = new Date(dateFilter);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(dateFilter);
    endDate.setHours(23, 59, 59, 999);
    
    query = query.gte('CreatedAt', startDate.toISOString())
                 .lte('CreatedAt', endDate.toISOString());
  }

  const { data, error, count } = await query
    .range(from, to)
    .order('CreatedAt', { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return { data: [], count: 0 };
  }

  // Fetch doctor metadata if any of these users are doctors
  const userIDs = data.map(u => u.UserID);
  const { data: doctorData } = await supabase
    .from('M_Doctors')
    .select('*')
    .in('DoctorID', userIDs);

  return {
    data: data.map((user: any) => {
      const docInfo = doctorData?.find(d => d.DoctorID === user.UserID);
      return {
        id: user.UserID,
        firstName: user.FirstName,
        lastName: user.LastName,
        middleName: user.MiddleName,
        name: user.FullName,
        email: user.Email,
        role: user.M_Roles?.RoleName || "User",
        roleID: user.RoleID,
        createdAt: user.CreatedAt,
        specialization: docInfo?.Specialization || "",
        licenseNumber: docInfo?.LicenseNumber || "",
        bio: docInfo?.Bio || ""
      };
    }),
    count: count || 0
  };
}

export async function getRoles() {
  const { data, error } = await supabase
    .from('M_Roles')
    .select('RoleID, RoleName')
    .eq('IsDeleted', 0);

  if (error) {
    console.error("Error fetching roles:", error);
    return [];
  }

  return data.map(role => ({
    id: role.RoleID,
    name: role.RoleName
  }));
}

export async function createUser(payload: {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  password: string;
  roleID: string;
  specialization?: string;
  licenseNumber?: string;
  bio?: string;
}) {
  try {
    const fullName = `${payload.firstName} ${payload.lastName}`;

    // 1. Create the user in Supabase Auth using the ADMIN client (service role key)
    const { data: { user: authUser }, error: signupError } = await supabaseAdmin.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });
    
    if (signupError) throw signupError;

    // 2. Insert into the public.M_Users table
    const { error: userError } = await supabase
      .from('M_Users')
      .insert([{
        UserID: authUser?.id,
        Email: payload.email,
        FirstName: payload.firstName,
        LastName: payload.lastName,
        MiddleName: payload.middleName,
        FullName: fullName,
        RoleID: payload.roleID,
        ActionType: 'INSERT'
      }]);

    if (userError) throw userError;

    // 3. If it's a Doctor, also insert into M_Doctors
    const { data: roleData } = await supabase
      .from('M_Roles')
      .select('RoleName')
      .eq('RoleID', payload.roleID)
      .single();

    if (roleData?.RoleName === 'Doctor') {
      const { error: doctorError } = await supabase
        .from('M_Doctors')
        .insert([{
          DoctorID: authUser?.id,
          Specialization: payload.specialization || "General Medicine",
          LicenseNumber: payload.licenseNumber,
          Bio: payload.bio,
          ActionType: 'INSERT'
        }]);
      
      if (doctorError) throw doctorError;
    }

    revalidatePath('/admin/users');
    revalidatePath('/admin/doctors');
    return { success: true };
  } catch (error: any) {
    console.error("Error in createUser:", error);
    return { 
      success: false, 
      error: error.message || "An unexpected error occurred during user creation." 
    };
  }
}

export async function updateUser(userID: string, payload: {
  firstName: string;
  lastName: string;
  middleName?: string;
  roleID: string;
  specialization?: string;
  licenseNumber?: string;
  bio?: string;
  password?: string;
}) {
  try {
    const fullName = `${payload.firstName} ${payload.lastName}`;

    // 1. Update public.M_Users
    const { error: userError } = await supabase
      .from('M_Users')
      .update({
        FirstName: payload.firstName,
        LastName: payload.lastName,
        MiddleName: payload.middleName,
        FullName: fullName,
        RoleID: payload.roleID,
        UpdatedAt: new Date().toISOString(),
        ActionType: 'UPDATE'
      })
      .eq('UserID', userID);

    if (userError) throw userError;

    // 2. Update Auth Metadata and Password
    const updateData: any = {
      user_metadata: { full_name: fullName }
    };
    
    if (payload.password && payload.password.trim() !== "") {
      updateData.password = payload.password;
    }

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userID, updateData);
    
    if (authError) throw authError;

    // 3. Handle Doctor Metadata
    const { data: roleData } = await supabase
      .from('M_Roles')
      .select('RoleName')
      .eq('RoleID', payload.roleID)
      .single();

    if (roleData?.RoleName === 'Doctor') {
      // Upsert into M_Doctors
      const { error: doctorError } = await supabase
        .from('M_Doctors')
        .upsert([{
          DoctorID: userID,
          Specialization: payload.specialization || "General Medicine",
          LicenseNumber: payload.licenseNumber,
          Bio: payload.bio,
          UpdatedAt: new Date().toISOString(),
          ActionType: 'UPDATE'
        }]);
      
      if (doctorError) throw doctorError;
    } else {
      // If role changed from Doctor to something else, we might want to soft delete the doctor record
      // But for now, we'll just keep it or let it be.
    }

    revalidatePath('/admin/users');
    revalidatePath('/admin/doctors');
    return { success: true };
  } catch (error: any) {
    console.error("Error in updateUser:", error);
    return { success: false, error: error.message || "Failed to update identity." };
  }
}
