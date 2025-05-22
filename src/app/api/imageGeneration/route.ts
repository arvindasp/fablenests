// src/app/api/imageGeneration/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient }            from "@supabase/supabase-js";
import OpenAI                      from "openai";
import { randomUUID }              from "crypto";

const openai       = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { theme, email, plan } = await req.json();
  // decide how many images:
  const n = plan === "nestling" ? 3 : 1;
  // generate
  const res = await openai.images.generate({
    prompt: `Vintage fable illustration of "${theme}" in watercolor style.`,
    n, size: "512x512"
  });

  const urls: string[] = [];
  for (let i = 0; i < res.data.length; i++) {
    const url = res.data[i].url!;
    const imageBuf = Buffer.from(await (await fetch(url)).arrayBuffer());
    const path     = `${email}/${randomUUID()}.png`;
    await supabaseAdmin
      .storage
      .from("story-images")
      .upload(path, imageBuf, { contentType: "image/png", upsert: true });
    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/story-images/${path}`;
    urls.push(publicUrl);
    await supabaseAdmin
      .from("story_images")
      .insert([{ email, image_url: publicUrl, page_index: i }]);
  }

  return NextResponse.json({ images: urls });
}
