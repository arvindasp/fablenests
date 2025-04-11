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
      model: "gpt-4",
      max_tokens: 600, // reduce length
      temperature: 0.8, // keep creativity
      messages: [
        {
          role: "system",
          content: `You are a children's story writer. Keep the story short (around 300-400 words), imaginative, and fit for bedtime.`,
        },
        {
          role: "user",
          content: `Write a short ${genre.toLowerCase()} story for kids based on this theme: ${theme}`,
        },
      ],
    });

    const story = completion.choices[0].message.content;

    return NextResponse.json({ story, title: "Your Story" });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate story." },
      { status: 500 }
    );
  }
}
