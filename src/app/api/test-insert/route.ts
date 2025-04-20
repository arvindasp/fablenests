import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("users2")
    .insert([
      {
        email: "test@api-from-app.com",
        plan: "free",
      },
    ])
    .select();

  console.log("📦 Supabase Insert Result", { data, error });

  if (error) {
    // 👇 Add this full return block for detailed info
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

  return NextResponse.json({ data }, { status: 200 });
}
