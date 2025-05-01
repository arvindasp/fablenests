// src/app/api/insert-user-from-google/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // 🔍 Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("plan")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Fetch error:", fetchError.message);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // ✅ Only insert if not found
    if (!existingUser) {
      const { error: insertError } = await supabase
        .from("users")
        .insert({ email, plan: "free" });

      if (insertError) {
        console.error("Insert error:", insertError.message);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, inserted: true }, { status: 200 });
    }

    // ✅ User exists, do nothing
    return NextResponse.json({ success: true, inserted: false }, { status: 200 });

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
