// src/lib/getUserPlan.ts
import { supabase } from "@/lib/supabase";

export async function getUserPlan(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("plan")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching user plan:", error.message);
    return null;
  }

  return data?.plan || null;
}
