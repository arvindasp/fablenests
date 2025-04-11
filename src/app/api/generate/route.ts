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
          content: `You are a creative assistant that writes short children's bedtime stories (500-700 words). 
          Your response must include:
          1. A short and fun title (3-6 words).
          2. A full story below the title. Format like:
          Title: The Curious Dragon
          
          Once upon a time...`,
        },
        {
          role: "user",
          content: `Write a ${genre.toLowerCase()} story based on this theme: ${theme}`,
        },
      ],
    });

    const fullText = completion.choices[0].message.content || "";
    const [titleLine, ...storyLines] = fullText.split("\n").filter(line => line.trim() !== "");

    const title = titleLine.replace(/^Title:\s*/i, "").trim();
    const story = storyLines.join("\n").trim();

    return NextResponse.json({ title, story });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate story." },
      { status: 500 }
    );
  }
}
