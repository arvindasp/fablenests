"use client";

import React, { useState } from "react";
import { useSession }         from "next-auth/react";
import { useRouter }          from "next/navigation";
import Image                  from "next/image";
import { motion }             from "framer-motion";

export default function HomePage() {
  const { data: session } = useSession();
  const router            = useRouter();

  const [theme, setTheme]       = useState("");
  const [genre, setGenre]       = useState("Adventure");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading]   = useState(false);

  const genres = [
    "Adventure",
    "Comedy",
    "Feel-Good",
    "Mystery",
    "Magical",
    "Sci-Fi",
    "Fairy Tale",
  ];

  const languages = ["English", "Svenska", "Español", "Français"];

  const generateStory = async () => {
    if (!session?.user?.email) {
      alert("You must be logged in to generate a story.");
      return;
    }
    setLoading(true);
    try {
      // 1) generate text & usage check
      const storyRes = await fetch("/api/storyGeneration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          genre,
          language,
          email: session.user.email,
        }),
      });
      const storyData = await storyRes.json();
      if (!storyRes.ok) throw new Error(storyData.error || "Story generation failed");

      const { story, title, plan } = storyData;

      // 2) generate images
      const imgRes = await fetch("/api/imageGeneration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          email: session.user.email,
          plan,
        }),
      });
      let images: string[] = [];
      if (imgRes.ok) {
        const imgData = await imgRes.json();
        images = imgData.images;
      }

      // 3) navigate with everything in the query
      const params = new URLSearchParams({
        title,
        story,
        images: JSON.stringify(images),
      });
      router.push(`/story?${params.toString()}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-story-bg text-story-accent font-body flex flex-col items-center px-6 py-16">
      {/* Page Title */}
      <h1 className="text-5xl md:text-5xl font-title mb-10 text-center leading-snug">
        Fablenests —
        <br />
        Create Magical Stories
      </h1>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 w-full max-w-6xl">
        {/* Left Illustration */}
        <div className="hidden md:block">
          <Image
            src="/images/monkey-fox.webp"
            alt="Monkey and Fox"
            width={260}
            height={260}
            priority
            className="rounded-2xl drop-shadow-storybook"
          />
        </div>

        {/* Form Card */}
        <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-storybook text-center space-y-6">
          <input
            type="text"
            placeholder="Enter a theme…"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 font-body shadow-sm focus:outline-none focus:ring-2 focus:ring-story-accent/50 transition"
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-gray-300 font-body shadow-sm focus:outline-none focus:ring-2 focus:ring-story-accent/50 transition"
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-gray-300 font-body shadow-sm focus:outline-none focus:ring-2 focus:ring-story-accent/50 transition"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            onClick={generateStory}
            disabled={loading}
            className="
              text-story-accent font-bold text-xl
              bg-transparent border-none
              px-2 py-1
              hover:underline hover:text-blue-400
              focus:outline-none focus:ring-0
              active:text-blue-400
              transition
            "
          >
            {loading ? "Generating…" : "Generate Story"}
          </motion.button>
        </div>

        {/* Right Illustration */}
        <div className="hidden md:block">
          <Image
            src="/images/dolphin.webp"
            alt="Dolphin leaping"
            width={260}
            height={260}
            priority
            className="rounded-2xl drop-shadow-storybook"
          />
        </div>
      </div>
    </div>
  );
}
