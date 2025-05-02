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

    // Check if user already exists
    const { data: existing, error: fetchError } = await supabase
      .from("users")
      .select("plan") // plan is enough for checking
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("🔴 Supabase fetch error:", fetchError);
      return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
    }

    if (!existing) {
      const { error: insertError } = await supabase
        .from("users")
        .insert({ email, plan: "free" });

      if (insertError) {
        console.error("🔴 Insert error:", insertError);
        return NextResponse.json({ error: "Insert failed" }, { status: 500 });
      }

      console.log(`✅ New user inserted: ${email}`);
    } else {
      console.log(`ℹ️ User already exists: ${email}`);
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
