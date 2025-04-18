"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const wordsPerPage = 100;

function StoryReader() {
  const searchParams = useSearchParams();
  const storyParam = searchParams.get("story");
  const titleParam = searchParams.get("title") || "Your Story";

  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (storyParam) {
      const words = storyParam.split(" ");
      const pageChunks = [];

      for (let i = 0; i < words.length; i += wordsPerPage) {
        pageChunks.push(words.slice(i, i + wordsPerPage).join(" "));
      }

      setPages(pageChunks);
    }
  }, [storyParam]);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className="text-4xl font-title mb-6 text-center text-[#2f1c12]">📖 {titleParam}</div>

      <div className="relative w-full max-w-3xl min-h-[400px] bg-[#fdf6e3] border-4 border-[#e3d8b5] rounded-2xl shadow-xl p-10 text-xl font-[Lora] leading-relaxed text-gray-800 transition-all duration-300 whitespace-pre-line">
        <AnimatePresence mode="wait">
        <motion.div
  key={currentPage}
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -50 }}
  transition={{ duration: 0.4 }}
>
  {currentPage === 0 ? (
    <>
      <span className="drop-cap">{pages[0]?.charAt(0)}</span>
      {pages[0]?.slice(1)}
    </>
  ) : (
    pages[currentPage]
  )}
</motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center mt-6 w-full max-w-3xl px-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 transition-all font-[Lora]"
        >
          ← Prev
        </button>

        <span className="text-sm text-gray-600 font-[Lora]">
          Page {currentPage + 1} of {pages.length}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === pages.length - 1}
          className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 transition-all font-[Lora]"
        >
          Next →
        </button>
      </div>
    </>
  );
}

export default function StoryBookPage() {
  return (
    <div className="min-h-screen bg-[#f5ecd7] flex flex-col items-center justify-center px-6 py-12 font-body text-gray-800">
      <Suspense fallback={<div>Loading story...</div>}>
        <StoryReader />
      </Suspense>
    </div>
  );
}
