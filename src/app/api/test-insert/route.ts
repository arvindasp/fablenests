import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        email: "test@api-from-app.com",
        plan: "free",
      },
    ])
    .select();

  console.log("📦 Server Insert Result:", { data, error });

  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ data }, { status: 200 });
}
