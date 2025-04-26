// src/app/api/insert-user/route.ts

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
    }
  );

export async function POST(request: Request) {
  try {
    const { email, plan } = await request.json();

    if (!email || !plan) {
      return NextResponse.json(
        { error: "Missing email or plan" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .upsert({ email, plan }, { onConflict: "email" });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
