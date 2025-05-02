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
      .select("id")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Supabase fetch error:", fetchError);
      return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }

    if (!existing) {
      // Insert only if user doesn't exist
      const { error: insertError } = await supabase
        .from("users")
        .insert({ email, plan: "free" });

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        return NextResponse.json({ error: "Insert failed" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
