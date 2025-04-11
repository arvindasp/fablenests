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
          content: `You are a creative and thoughtful children's book author. Your job is to write short bedtime stories (500-700 words) based on the given genre and theme.`,
        },
        {
          role: "user",
          content: `Write a ${genre.toLowerCase()} story based on this theme: ${theme}`,
        },
      ],
    });

    const story = completion.choices[0].message.content;

    // Generate a short, fitting title for the story
    const titleCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You're a creative assistant that generates short, imaginative story titles for children's stories.`,
        },
        {
          role: "user",
          content: `Suggest a fun, imaginative and short title (3-6 words) for this story:

          ${story}`,
        },
      ],
    });

    const title = titleCompletion.choices[0].message.content?.replaceAll("\"", "").trim();

    return NextResponse.json({ story, title });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate story." },
      { status: 500 }
    );
  }
}
