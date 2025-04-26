// src/app/api/insert-user/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, plan } = await request.json();

    if (!email || !plan) {
      return NextResponse.json({ error: "Missing email or plan" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("users")
      .upsert({ email, plan }, { onConflict: "email" });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {
          error: error.message || "Insert failed",
          code: error.code || null,
          details: error.details || null,
          hint: error.hint || null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
