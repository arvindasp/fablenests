"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [theme, setTheme] = useState("");
  const [genre, setGenre] = useState("Adventure");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);

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
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, genre, language, email: session.user.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      router.push(
        `/story?title=${encodeURIComponent(data.title)}&story=${encodeURIComponent(
          data.story
        )}`
      );
    } catch (err) {
      console.error(err);
      alert("Something went wrong while generating your story.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-story-bg text-gray-800 font-body flex flex-col items-center px-4 py-12">
      <h1 className="text-5xl font-title mb-12 text-center text-story-accent leading-tight">
        Fablenests
        <br />
        Create Magical Stories
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full max-w-6xl">
        {/* Left illustration */}
        <motion.div
          className="hidden md:block bg-white/90 p-4 rounded-2xl shadow-storybook"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          <Image
            src="/images/monkey-fox.webp"
            alt="Monkey and Fox"
            width={300}
            height={300}
            priority
            className="rounded-xl"
          />
        </motion.div>

        {/* Form */}
        <div className="w-full max-w-xl space-y-6 text-center">
          <input
            type="text"
            placeholder="Enter a theme…"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 font-body shadow-sm focus:outline-none focus:ring-2 focus:ring-story-accent/50 transition"
          />

          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-gray-300 font-body shadow-sm focus:outline-none focus:ring-2 focus:ring-story-accent/50 transition"
            >
              {genres.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-gray-300 font-body shadow-sm focus:outline-none focus:ring-2 focus:ring-story-accent/50 transition"
            >
              {languages.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateStory}
            disabled={loading}
            className="w-full md:w-auto bg-storybook-btn px-8 py-3 rounded-lg text-white font-title shadow-storybook hover:bg-storybook-btn-hover focus:outline-none focus:ring-2 focus:ring-storybook-btn/50 transition"
          >
            {loading ? "Generating…" : "Generate Story"}
          </motion.button>

          {/** If you want inline previews, keep this; otherwise you’ll push to /story **/}
          {/*
          {story && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 p-6 rounded-2xl shadow-xl border-2 border-storybook-border font-body text-lg leading-relaxed whitespace-pre-line"
            >
              {story}
            </motion.div>
          )}
          */}
        </div>

        {/* Right illustration */}
        <motion.div
          className="hidden md:block bg-white/90 p-4 rounded-2xl shadow-storybook"
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          <Image
            src="/images/dolphin.webp"
            alt="Dolphin leaping"
            width={300}
            height={300}
            priority
            className="rounded-xl"
          />
        </motion.div>
      </div>
    </div>
  );
}
