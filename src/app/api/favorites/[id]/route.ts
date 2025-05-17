// src/app/api/favorites/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabase";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("id", params.id)
    .eq("email", session.user.email);

  if (error) {
    console.error("Supabase DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Deleted." });
}
