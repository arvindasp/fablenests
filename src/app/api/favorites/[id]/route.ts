// src/app/api/favorites/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabase";

export async function DELETE(request: NextRequest) {
  // 1) Auth check
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Not authenticated." },
      { status: 401 }
    );
  }

  // 2) Extract the `id` from the URL
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  const id = parts[parts.length - 1];
  if (!id) {
    return NextResponse.json(
      { error: "Missing favorite ID in URL." },
      { status: 400 }
    );
  }

  // 3) Delete only the row matching both id and user email
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("id", id)
    .eq("email", session.user.email);

  if (error) {
    console.error("Supabase DELETE error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Deleted." });
}
