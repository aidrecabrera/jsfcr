import { supabase } from "@/lib/supabase";
export async function isAuthenticated(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  if (data.session !== null) {
    console.log("Session data:", data);
    return true as boolean;
  }
  return false as boolean;
}

export async function logout() {
  await supabase.auth.signOut();
}
