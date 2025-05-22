// src/app/api/generate/route.ts
export const dynamic = "force-dynamic";

import { randomUUID } from "crypto";
import { Buffer } from "buffer";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { theme, genre, language, email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Missing email." }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);

  // 1) fetch user plan & usage
  const { data: user, error: uErr } = await supabaseAdmin
    .from("users")
    .select("plan")
    .eq("email", email)
    .single();
  if (uErr || !user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const maxStories = user.plan === "nestling" ? 5 : 1;
  const { data: usage, error: usageErr } = await supabaseAdmin
    .from("story_usage")
    .select("count")
    .eq("email", email)
    .eq("date", today)
    .single();
  if (usageErr && usageErr.code !== "PGRST116") {
    console.error("Usage check failed:", usageErr);
    return NextResponse.json({ error: "Failed to check usage." }, { status: 500 });
  }

  const currentCount = usage?.count ?? 0;
  if (currentCount >= maxStories) {
    return NextResponse.json(
      { error: `You've reached your daily limit of ${maxStories} stories.` },
      { status: 403 }
    );
  }

  // 2) generate the story
  let story = "";
  const title = "Your Story";
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a children's story author. Write a short bedtime story (450-550 words) for kids. It should be a ${genre.toLowerCase()} in ${language}.`,
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

  // 3) upsert usage
  const { error: upsertErr } = await supabaseAdmin
    .from("story_usage")
    .upsert(
      [{ email, date: today, count: currentCount + 1 }],
      { onConflict: "email,date" }
    );
  if (upsertErr) console.error("Usage upsert failed:", upsertErr);

  // 4) generate & store images
  const numImages = user.plan === "nestling" ? 3 : 1;
  const prompt = `A vintage Aesop-style fable illustration of "${theme}", children's book watercolor style.`;
  const imageUrls: string[] = [];

  try {
    const res = await openai.images.generate({
      prompt,
      n: numImages,
      size: "512x512",
    });

    for (let i = 0; i < res.data.length; i++) {
      const url = res.data[i].url;
      if (!url) continue;

      const resp = await fetch(url);
      const buf = Buffer.from(await resp.arrayBuffer());

      const path = `${email}/${today}/${randomUUID()}.png`;
      const { error: upErr } = await supabaseAdmin
        .storage
        .from("story-images")
        .upload(path, buf, {
          contentType: "image/png",
          upsert: true,
        });
      if (upErr) console.error("Image upload error:", upErr);

      const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/story-images/${path}`;
      imageUrls.push(publicUrl);

      const { error: metaErr } = await supabaseAdmin
        .from("story_images")
        .insert([{
          email,
          story_date: today,
          page_index: i,
          image_url: publicUrl,
        }]);
      if (metaErr) console.error("story_images insert error:", metaErr);
    }
  } catch (imgErr) {
    console.error("Image gen/upload error:", imgErr);
    // still return the story even if images fail
  }

  // 5) return everything
  return NextResponse.json({ title, story, images: imageUrls });
}
