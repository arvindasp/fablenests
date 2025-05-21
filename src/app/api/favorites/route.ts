// src/app/api/favorites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { supabaseAdmin } from "@/lib/supabaseAdmin";  // service-role client

// POST /api/favorites → save a new favorite
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { title, story } = await req.json();
  if (!title || !story) {
    return NextResponse.json({ error: "Missing title or story." }, { status: 400 });
  }

  const { error: insertError } = await supabaseAdmin
    .from("favorites")
    .insert({ email: session.user.email, title, story, created_at: new Date() });

  if (insertError) {
    console.error("Supabase insert error:", insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Saved to favorites!" });
}

// GET /api/favorites → list your favorites
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  // Use the service-role client to bypass RLS and pull all your rows:
  const { data, error } = await supabaseAdmin
    .from("favorites")
    .select("id, title, story, created_at")
    .eq("email", session.user.email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
