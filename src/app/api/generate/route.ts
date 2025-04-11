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
      messages: [
        {
          role: "system",
          content: `You are a creative assistant that writes short bedtime stories (500–700 words) for kids and provides a short title for the story. Return your response in the following JSON format:
{
  "title": "...",
  "story": "..."
}`,
        },
        {
          role: "user",
          content: `Write a ${genre.toLowerCase()} story based on this theme: ${theme}`,
        },
      ],
    });

    const responseText = completion.choices[0].message.content;

    let title = "Untitled";
    let story = "No story found.";

    try {
      const parsed = JSON.parse(responseText || "{}");
      title = parsed.title || title;
      story = parsed.story || story;
    } catch (err) {
      console.error("Failed to parse OpenAI response:", err);
    }

    return NextResponse.json({ story, title });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate story." },
      { status: 500 }
    );
  }
}
