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
      const pageChunks: string[] = [];

      for (let i = 0; i < words.length; i += wordsPerPage) {
        pageChunks.push(words.slice(i, i + wordsPerPage).join(" "));
      }

      setPages(pageChunks);
    }
  }, [storyParam]);

  return (
    <>
      <h1 className="text-4xl font-title mb-6 text-center text-story-accent transition-transform duration-300 hover:scale-105 hover:text-story-accent/80">
        📖 {titleParam}
      </h1>

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
            className="
              bg-white
              text-story-accent
              font-body
              p-8 text-lg leading-relaxed
              border-4 border-story-accent
              rounded-2xl shadow-xl
              whitespace-pre-line overflow-y-auto max-h-[500px]
            "
          >
            {index === 0 ? (
              <>
                <span className="drop-cap text-4xl font-bold float-left mr-2 leading-none">
                  {pageText.charAt(0)}
                </span>
                {pageText.slice(1)}
              </>
            ) : (
              pageText
            )}
          </div>
        ))}
      </HTMLFlipBook>

      <p className="mt-6 text-sm font-body text-story-accent/70 text-center">
        💡 Tap or swipe to flip the page
      </p>
    </>
  );
}

export default function StoryBookPage() {
  return (
    <div className="min-h-screen bg-story-bg flex flex-col items-center justify-center px-6 py-12 font-body text-story-accent">
      <Suspense fallback={<div>Loading story...</div>}>
        <StoryReader />
      </Suspense>
    </div>
  );
}
