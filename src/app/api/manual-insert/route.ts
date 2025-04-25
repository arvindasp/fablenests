// app/api/manual-insert/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://uelrfiqkxnsudaqlocxz.supabase.co/rest/v1/users", {
    method: "POST",
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify({
      email: "manual@fablenests.com",
      plan: "free"
    })
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
