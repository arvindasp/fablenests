export const dynamic = "force-dynamic";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { theme, genre } = await req.json();

  try {
    // Generate short story
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a children's story author. Write a very short bedtime story (around 250-350 words) for kids based on the given genre and theme.",
        },
        {
          role: "user",
          content: `Write a ${genre.toLowerCase()} story about: ${theme}`,
        },
      ],
    });

    const story = completion.choices[0].message.content;

    // Try to generate a title, fallback if it fails
    let title = "Your Story";

    try {
      const titleCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You generate creative and short story titles for children's stories (3-6 words max).",
          },
          {
            role: "user",
            content: `Suggest a creative title for this story:\n\n${story}`,
          },
        ],
      });

      const generatedTitle = titleCompletion.choices[0].message.content?.trim();
      if (generatedTitle) {
        title = generatedTitle.replaceAll('"', '');
      }
    } catch (titleError) {
      console.warn("Title generation failed, using fallback.");
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
