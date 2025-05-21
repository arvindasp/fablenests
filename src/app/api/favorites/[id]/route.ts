// src/app/api/favorites/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  // Extract the ID from the URL
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "Missing favorite ID." }, { status: 400 });
  }

  // Use the admin client to bypass RLS and delete the row
  const { error } = await supabaseAdmin
    .from("favorites")
    .delete()
    .eq("id", id)
    .eq("email", session.user.email);

  if (error) {
    console.error("Delete failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted." });
}
