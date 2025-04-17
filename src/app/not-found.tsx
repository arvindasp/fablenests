// src/app/not-found.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5ecd7] text-gray-800 font-body px-4 py-12">
      <Image
        src="/images/404-owl.webp"
        alt="Curious owl illustration"
        width={300}
        height={300}
        className="mb-6"
      />
      <h1 className="text-4xl font-title mb-4 text-center text-[#2f1c12]">Whooopsy! Page not found</h1>
      <p className="text-lg text-center mb-6 max-w-md">
        Looks like you've flown into the wrong nest. Let’s get you back to storytelling!
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
