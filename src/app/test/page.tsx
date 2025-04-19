"use client";

import { supabase } from "@/lib/supabase";

export default function SupabaseManualTest() {
  const test = async () => {
    const { data, error } = await supabase
      .from("users")
      .insert([{ email: "manual@fablenests.com", plan: "free" }]);

    console.log("🔍 Manual test result:", { data, error });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <button
        onClick={test}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow"
      >
        Run Supabase Manual Insert
      </button>
    </div>
  );
}
