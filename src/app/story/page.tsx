"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
const HTMLFlipBook = require("react-pageflip").default as any;


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

  return (
    <>
      <div className="text-4xl font-title mb-6 text-center text-[#2f1c12]">📖 {titleParam}</div>

      <HTMLFlipBook
  width={500}
  height={600}
  size="stretch"
  minWidth={315}
  maxWidth={600}
  minHeight={400}
  maxHeight={800}
  maxShadowOpacity={0.5}
  showCover={false}
  mobileScrollSupport={true}
  className="storybook-flipbook"
>
  {pages.map((pageText, index) => (
    <div
    key={index}
    className="bg-[#fdf6e3] text-gray-800 font-[Lora] p-8 text-lg leading-relaxed border-4 border-[#e3d8b5] rounded-2xl shadow-xl whitespace-pre-line overflow-y-auto max-h-[500px]"
  >
      {index === 0 ? (
        <>
          <span className="drop-cap">{pageText.charAt(0)}</span>
          {pageText.slice(1)}
        </>
      ) : (
        pageText
      )}
    </div>
  ))}
</HTMLFlipBook>


<p className="mt-6 text-sm font-[Lora] text-gray-600 text-center">
  Page flipping enabled — tap/click to flip
</p>
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
