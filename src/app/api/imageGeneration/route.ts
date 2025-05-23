// src/app/api/imagegeneration/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { randomUUID } from "crypto";
import { Buffer } from "buffer";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // 1) validate input
  const { theme, email, plan } = await req.json();
  if (!theme || !email || !plan) {
    return NextResponse.json(
      { error: "Missing theme, email, or plan." },
      { status: 400 }
    );
  }

  // 2) decide how many images
  const n = plan === "nestling" ? 3 : 1;

  try {
    // 3) call OpenAI
    const aiRes = await openai.images.generate({
      prompt: `Vintage fable illustration of "${theme}" in a soft watercolor style.`,
      n,
      size: "512x512",
    });

    const urls: string[] = [];

    // 4) download, store, record each image
    for (let i = 0; i < aiRes.data.length; i++) {
      const imgUrl = aiRes.data[i].url;
      if (!imgUrl) continue;

      // fetch the binary
      const resp = await fetch(imgUrl);
      const buf = Buffer.from(await resp.arrayBuffer());

      // upload to your Supabase bucket
      const path = `${email}/${randomUUID()}.png`;
      const { error: upErr } = await supabaseAdmin
        .storage
        .from("story-images")
        .upload(path, buf, {
          contentType: "image/png",
          upsert: true,
        });
      if (upErr) {
        console.error("Supabase upload error:", upErr);
        continue;
      }

      // build public URL
      const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/story-images/${path}`;
      urls.push(publicUrl);

      // record metadata
      const { error: metaErr } = await supabaseAdmin
        .from("story_images")
        .insert([{ email, image_url: publicUrl, page_index: i }]);
      if (metaErr) console.error("story_images insert error:", metaErr);
    }

    // 5) respond with all URLs
    return NextResponse.json({ images: urls });
  } catch (err) {
    console.error("Image generation/upload failed:", err);
    return NextResponse.json(
      { error: "Failed to generate or store images." },
      { status: 500 }
    );
  }
}
