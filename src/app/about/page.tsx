"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f5ecd7] text-gray-800 font-body flex flex-col items-center px-4 py-12">
      <h1 className="text-5xl font-bold mb-8 font-title text-center">About Us</h1>

      <div className="max-w-3xl w-full bg-white border border-gray-300 rounded-lg shadow-md p-6 mb-12 text-lg text-center">
        <p>
          Here at bedtimify, we have one goal: to make the best stories for you.
          We are based in Stockholm and use artificial intelligence to develop
          the perfect story for you, based on whatever you want to read about.
        </p>
      </div>

      <div className="w-full max-w-5xl mt-8">
        <Image
          src="/images/castle-mythology.webp"
          alt="A fantasy illustration with mythical creatures"
          width={1600}
          height={400}
          priority
          className="mx-auto rounded-md"
        />
      </div>
    </div>
  );
}
