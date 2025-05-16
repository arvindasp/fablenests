// src/app/api/favorites/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserPlan } from "@/lib/getUserPlan";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const plan = await getUserPlan(session.user.email);
  if (plan !== "nestling") {
    return NextResponse.json(
      { error: "Only Nestling subscribers can save favorites." },
      { status: 403 }
    );
  }

  const { title, story } = await req.json();
  if (!title || !story) {
    return NextResponse.json({ error: "Missing title or story." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("favorites")
    .insert({
      email: session.user.email,
      title,
      story,
      created_at: new Date(),
    });

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Saved to favorites!" });
}
