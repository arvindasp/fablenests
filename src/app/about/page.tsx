"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f5ecd7] text-gray-800 font-body flex flex-col items-center px-4 py-12">
      <h1 className="text-5xl font-title mb-8 text-center">About Us</h1>

      {/* Main About Text */}
      <div className="max-w-3xl w-full bg-white border border-gray-300 rounded-lg shadow-md p-6 mb-8 text-lg text-center">
        <p>
          Here at Fablenests, we have one goal: to create the best stories for you.
          We use artificial intelligence to develop the perfect story for you, based on whatever you want to read about.
        </p>
      </div>

      {/* Contact Us Box */}
      <div className="max-w-3xl w-full bg-white border border-gray-300 rounded-lg shadow-md p-6 mb-12 text-lg text-center">
        <h2 className="text-2xl font-title mb-4">Contact Us</h2>
        <p>If you have recommendations, feedback, questions, or just want to reach out, feel free to contact us at fablnests@gmail.com, we are very open to conversation.</p>
      </div>

      {/* Illustration */}
      <div className="w-full max-w-5xl">
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

