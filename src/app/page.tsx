"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const [theme, setTheme] = useState("");
  const [genre, setGenre] = useState("Adventure");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const router = useRouter();

  const languages = ["English", "Svenska", "Español", "Français"];

  const generateStory = async () => {
    const allowedPassword = "fablenest42";
    const enteredPassword = prompt("Enter the access password:");

    if (enteredPassword !== allowedPassword) {
      alert("Incorrect password. Access denied.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const usage = JSON.parse(localStorage.getItem("dailyUsage") || "{}");

    if (usage[today] >= 5) {
      alert("You can only generate 5 stories per day!");
      return;
    }

    setLoading(true);
    setStory("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, genre, language }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      router.push(`/story?title=${encodeURIComponent(data.title)}&story=${encodeURIComponent(data.story)}`);

      const updatedUsage = { ...usage, [today]: (usage[today] || 0) + 1 };
      localStorage.setItem("dailyUsage", JSON.stringify(updatedUsage));
    } catch (error) {
      console.error("Error generating story:", error);
      alert("Something went wrong while generating your story.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5ecd7] text-gray-800 font-body flex flex-col items-center px-4 py-12">
      <h1 className="text-5xl font-title mb-9 text-center text-[#2f1c12] leading-tight">
        Fablenests – Create Magical Stories
      </h1>

      <div className="flex flex-col md:flex-row items-start justify-center gap-10 w-full max-w-6xl">
        <div className="hidden md:block w-64">
          <Image
            src="/images/monkey-fox.webp"
            alt="Monkey and Fox"
            width={300}
            height={300}
            priority
            className="rounded-2xl shadow-lg"
          />
        </div>

        <div className="flex flex-col items-center text-center max-w-xl w-full">
  {/* Theme Input — now at the top and full width */}
  <div className="w-full mb-4">
    <input
      type="text"
      name="theme"
      placeholder="Enter a theme..."
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="p-3 rounded-xl border border-gray-300 w-full font-body shadow-sm focus:outline-none"
    />
  </div>

  {/* Genre + Language below, side-by-side on md+ screens */}
  <div className="flex flex-col md:flex-row gap-4 items-center mb-6 w-full">
    <select
      name="genre"
      value={genre}
      onChange={(e) => setGenre(e.target.value)}
      className="p-3 rounded-xl border border-gray-300 w-full md:w-1/2 font-body shadow-sm focus:outline-none"
    >
      <option>Adventure</option>
      <option>Comedy</option>
      <option>Feel-Good</option>
      <option>Mystery</option>
      <option>Magical</option>
      <option>Sci-Fi</option>
      <option>Fairy Tale</option>
    </select>

    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="p-3 rounded-xl border border-gray-300 w-full md:w-1/2 font-body shadow-sm focus:outline-none"
    >
      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {lang}
        </option>
      ))}
    </select>
  </div>
</div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateStory}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all font-body mb-8"
          >
            {loading ? "Generating..." : "Generate Story"}
          </motion.button>

          {story && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 p-6 rounded-2xl shadow-xl border-2 border-[#eee3ce] max-w-3xl w-full font-body text-lg leading-relaxed whitespace-pre-line"
            >
              {story}
            </motion.div>
          )}
        </div>

        <div className="hidden md:block w-64">
          <Image
            src="/images/dolphin.webp"
            alt="Dolphin leaping"
            width={300}
            height={300}
            priority
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
