// /api/generate/route.ts
export const dynamic = "force-dynamic";

import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { theme, genre, language, email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Missing email." }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];

  // Get user plan
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("plan")
    .eq("email", email)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const plan = user.plan;
  const maxStories = plan === "nestling" ? 5 : 1;

  // Check today's usage
  const { data: usageData, error: usageError } = await supabase
    .from("story_usage")
    .select("count")
    .eq("email", email)
    .eq("date", today)
    .maybeSingle();

  if (usageError) {
    console.error("Error checking story usage:", usageError.message);
    return NextResponse.json({ error: "Failed to check usage." }, { status: 500 });
  }

  const currentCount = usageData?.count || 0;

  if (currentCount >= maxStories) {
    return NextResponse.json(
      { error: `You've reached your daily limit of ${maxStories} stories.` },
      { status: 403 }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a children's story author. Write a short bedtime story (250-350 words) for kids. The story should be a ${genre.toLowerCase()} and written in ${language}.`,
        },
        {
          role: "user",
          content: `Write a ${genre.toLowerCase()} story about: ${theme}`,
        },
      ],
    });

    const story = completion.choices[0].message.content;
    const title = "Your Story";

    // Update or insert usage
    const { error: upsertError } = await (supabase as any)
  .from("story_usage")
  .upsert(
    [{ email, date: today, count: 1 }],
    { onConflict: ["email", "date"] }
  );

if (upsertError) {
  console.error("Upsert error:", upsertError.message);
}
    return NextResponse.json({ story, title });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      { error: "Story generation failed." },
      { status: 500 }
    );
  }
}
