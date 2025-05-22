"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
const HTMLFlipBook = require("react-pageflip").default as any;

const wordsPerPage = 100;

function StoryReader() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const storyParam = searchParams.get("story") || "";
  const titleParam = searchParams.get("title") || "Your Story";
  // 1) grab & parse the images array from the query string
const rawImages = searchParams.get("images") || "[]";
let images: string[] = [];
try {
images = JSON.parse(rawImages);
} catch {
images = [];
}

  const [pages, setPages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: titleParam, story: storyParam }),
    });
    if (res.ok) setSaved(true);
    else console.error(await res.json());
    setSaving(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-3xl mb-6 px-4">
        <h1 className="text-4xl font-title text-story-accent">
          📖 {titleParam}
        </h1>
        {session?.user?.email && (
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`
              text-story-accent font-body
              bg-transparent border-none
              px-2 py-1 rounded-lg
              ${saved ? "opacity-50 cursor-default" : "hover:underline"}
              focus:outline-none focus:ring-0
              transition
            `}
          >
            {saving ? "Saving…" : saved ? "Saved!" : "Save to Favorites"}
          </button>
        )}
      </div>

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
        border-4 border-storybook-border
        rounded-2xl shadow-xl
        whitespace-pre-line overflow-y-auto max-h-[500px]
      "
    >
      {/* Illustration for this page */}
      {images[index] && (
        <img
          src={images[index]}
          alt={`Illustration for page ${index + 1}`}
          className="mb-4 w-full max-w-[450px] rounded-lg shadow-md mx-auto"
        />
      )}

      {/* Story text */}
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
