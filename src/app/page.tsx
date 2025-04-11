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
  const router = useRouter();

  const generateStory = async () => {
    const allowedPassword = "fablenest42"; // Set your secret password here
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme, genre }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      router.push(
        `/story?title=${encodeURIComponent(data.title)}&story=${encodeURIComponent(data.story)}`
      );
  
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
      <h1 className="text-5xl font-title mb-8 text-center">AI Bedtime Stories</h1>

      <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-6xl">
        {/* Left Image */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <Image
            src="/images/monkey-fox.webp"
            alt="Monkey and Fox"
            width={300}
            height={300}
            priority
            className="w-full h-auto"
          />
        </div>

        {/* Input & Button */}
        <div className="flex flex-col items-center text-center max-w-xl w-full">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4 w-full">
            <select
              name="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="p-3 rounded border border-gray-300 w-full font-body"
            >
              <option>Adventure</option>
              <option>Comedy</option>
              <option>Feel-Good</option>
              <option>Mystery</option>
              <option>Magical</option>
              <option>Sci-Fi</option>
              <option>Fairy Tale</option>
            </select>

            <input
              type="text"
              name="theme"
              placeholder="Enter a theme..."
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="p-3 rounded border border-gray-300 w-full font-body"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateStory}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded shadow-md hover:bg-blue-700 transition-colors font-body mb-8"
          >
            {loading ? "Generating..." : "Generate Story"}
          </motion.button>

          {story && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 p-6 rounded-lg shadow-xl border-2 border-[#eee3ce] max-w-3xl w-full font-body text-lg leading-relaxed whitespace-pre-line"
            >
              {story}
            </motion.div>
          )}
        </div>

        {/* Right Image */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <Image
            src="/images/dolphin.webp"
            alt="Dolphin leaping"
            width={300}
            height={300}
            priority
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}

