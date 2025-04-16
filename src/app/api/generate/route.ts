export const dynamic = "force-dynamic";

import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { theme, genre, language } = await req.json();

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

    return NextResponse.json({ story, title });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate story." },
      { status: 500 }
    );
  }
}
