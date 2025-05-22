// src/app/api/storyGeneration/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const { theme, genre, language, email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Missing email." }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];

  // 1) Fetch user plan
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

  // 2) Check today's usage
  const { data: usage, error: usageError } = await supabaseAdmin
    .from("story_usage")
    .select("count")
    .eq("email", email)
    .eq("date", today)
    .single();
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

  // 3) Generate story text
  let story = "";
  const title = "Your Story";
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a children's story author. Write a short bedtime story (450-550 words) for kids. It should be a ${genre.toLowerCase()} story in ${language}.`,
        },
        {
          role: "user",
          content: `Write a ${genre.toLowerCase()} story about: ${theme}`,
        },
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

  // 4) Upsert usage
  const { error: upsertError } = await supabaseAdmin
    .from("story_usage")
    .upsert(
      [{ email, date: today, count: currentCount + 1 }],
      { onConflict: "email,date" }
    );
  if (upsertError) console.error("Usage upsert failed:", upsertError);

  // 5) Return story, title, and plan (for image generation)
  return NextResponse.json({ story, title, plan });
}