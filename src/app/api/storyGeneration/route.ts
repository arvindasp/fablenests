// src/app/api/storygeneration/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  console.log('🥚 hit storygeneration')
  // 1) Parse & validate
  const { theme, genre, language, email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Missing email." }, { status: 400 });
  }

  // normalize date to YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // 2) Look up user plan
  const { data: user, error: userError } = await supabaseAdmin
    .from("users")
    .select("plan")
    .eq("email", email)
    .single();
  if (userError || !user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  const plan = user.plan;
  const maxStories = plan === "nestling" ? 5 : 1;

  // 3) Check today's usage
  const { data: usage, error: usageError } = await supabaseAdmin
    .from("story_usage")
    .select("count")
    .eq("email", email)
    .eq("date", today)
    .single();
  // ignore “no rows” error code
  if (usageError && usageError.code !== "PGRST116") {
    console.error("Usage check failed:", usageError);
    return NextResponse.json({ error: "Failed to check usage." }, { status: 500 });
  }
  const currentCount = usage?.count ?? 0;
  if (currentCount >= maxStories) {
    return NextResponse.json(
      { error: `You've reached your daily limit of ${maxStories} stories.` },
      { status: 403 }
    );
  }

  // 4) Generate the story via OpenAI
  let story = "";
  const title = "Your Story";
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a children's story author. Write a short bedtime story (450-550 words) in ${language}. It should feel ${genre.toLowerCase()}.`,
        },
        { role: "user", content: `Write a ${genre.toLowerCase()} story about: ${theme}` },
      ],
    });
    story = completion.choices?.[0]?.message?.content ?? "";
  } catch (err) {
    console.error("OpenAI Error:", err);
    return NextResponse.json(
      { error: "Something went wrong while generating your story." },
      { status: 500 }
    );
  }

  // 5) Upsert usage count (fire-and-forget)
  try {
    await supabaseAdmin
      .from("story_usage")
      .upsert(
        [{ email, date: today, count: currentCount + 1 }],
        { onConflict: "email,date" }
      );
  } catch (upsertErr) {
    console.error("Usage upsert failed:", upsertErr);
  }

  // 6) Return the story, title, and plan for subsequent image generation
  return NextResponse.json({ story, title, plan });
}
