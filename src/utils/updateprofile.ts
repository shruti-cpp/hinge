import { supabase } from '../lib/supabaseClient';

type ProfileData = {
  id: string; // user's uuid
  full_name: string;
  profile_pic: string;
  timezone: string;
  gender?: string;
  language?: string;
};

export async function updateProfile(data: ProfileData) {
  const { error } = await supabase
    .from("profiles")
    .upsert([data], { onConflict: "id" });

  if (error) {
    console.error("❌ Error inserting/updating profile:", error);
  } else {
    console.log("✅ Profile updated successfully!");
  }
}
