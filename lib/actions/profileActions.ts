"use server";

import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function updateProfile(userID: string, payload: {
  firstName: string;
  lastName: string;
  middleName?: string;
  profilePictureURL?: string;
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
        UpdatedAt: new Date().toISOString(),
        ActionType: 'UPDATE'
      })
      .eq('UserID', userID);

    if (userError) throw userError;

    // 2. Update/Upsert M_UserDetails
    const { error: detailError } = await supabase
      .from('M_UserDetails')
      .upsert({
        UserID: userID,
        ProfilePictureURL: payload.profilePictureURL,
        UpdatedAt: new Date().toISOString(),
        ActionType: 'UPDATE'
      }, { onConflict: 'UserID' });

    if (detailError) throw detailError;

    // 3. Update Auth Metadata
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userID, {
      user_metadata: { full_name: fullName }
    });
    
    if (authError) throw authError;

    revalidatePath('/admin/settings');
    // Also revalidate layout to update header
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error: any) {
    console.error("Error in updateProfile:", error);
    return { success: false, error: error.message || "Failed to update profile." };
  }
}
