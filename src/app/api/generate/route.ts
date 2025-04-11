export const dynamic = "force-dynamic";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { theme, genre } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // faster, lower latency
      max_tokens: 500, // fits well within Vercel's free timeout
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: `You are a friendly children's author. Write a short bedtime story (250–300 words) based on the given genre and theme.`,
        },
        {
          role: "user",
          content: `Write a short ${genre.toLowerCase()} story for kids based on this theme: ${theme}`,
        },
      ],
    });

    const story = completion.choices[0].message.content?.trim();

    return NextResponse.json({ story });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate story." },
      { status: 500 }
    );
  }
}
