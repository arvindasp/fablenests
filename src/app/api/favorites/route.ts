// src/app/api/favorites/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("id, title, created_at")
    .eq("email", session.user.email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
