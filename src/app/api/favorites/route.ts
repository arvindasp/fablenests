// src/app/api/favorites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { supabaseAdmin } from "@/lib/supabaseAdmin";  // service-role client
import { getUserPlan } from "@/lib/getUserPlan";     // to check free vs nestling

// POST /api/favorites → save a new favorite (with free-tier cap)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const email = session.user.email;
  const { title, story } = await req.json();
  if (!title || !story) {
    return NextResponse.json({ error: "Missing title or story." }, { status: 400 });
  }

  // Enforce free-tier cap of 3 saves
  const plan = await getUserPlan(email);
  if (plan === "free") {
    const { count, error: countError } = await supabaseAdmin
      .from("favorites")
      .select("id", { head: true, count: "exact" })
      .eq("email", email);
    if (countError) {
      console.error("Supabase count error:", countError);
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }
    if ((count ?? 0) >= 3) {
      return NextResponse.json(
        { error: "Free users can save up to 3 stories. Upgrade to save more!" },
        { status: 403 }
      );
    }
  }

  // Insert the new favorite
  const { error: insertError } = await supabaseAdmin
    .from("favorites")
    .insert({ email, title, story, created_at: new Date() });

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

  const email = session.user.email;
  const { data, error } = await supabaseAdmin
    .from("favorites")
    .select("id, title, story, created_at")
    .eq("email", email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
