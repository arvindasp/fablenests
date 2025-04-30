"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f5ecd7] text-gray-800 font-body flex flex-col items-center px-4 py-12">
      <h1 className="text-5xl font-title mb-8 text-center">About Us</h1>

      {/* Main About Box */}
      <div className="max-w-3xl w-full bg-white border border-gray-300 rounded-lg shadow-md p-6 mb-8 text-lg text-center space-y-4">
        <p>
          At Fablenests, we believe bedtime is more than routine — it's a moment of wonder, connection, and calm.
          We craft personalized bedtime stories using artificial intelligence, turning your child’s favorite themes and ideas into magical, one-of-a-kind tales.
        </p>
        <p>
          We believe that the best use of AI is to help others, and with our product, storytelling becomes more affordable, more personal, and more magical than ever before.
        </p>
        <p>
          Whether you're here for a cozy storytime, to inspire imagination, or to enjoy a peaceful end to the day, Fablenests is here to help you build those moments — and to make the world a little gentler while doing it.
        </p>
        <p>
          Curious about how we give back? Learn more on our{" "}
          <a
            href="/ourMission"
            className="text-blue-600 underline hover:text-blue-800 transition-colors"
          >
            Our Mission
          </a>{" "}
          page.
        </p>
      </div>

      {/* Note from Creator */}
      <div className="max-w-3xl w-full bg-white border border-gray-300 rounded-lg shadow-md p-6 mb-8 text-lg text-center">
        <h2 className="text-2xl font-title mb-4">A Little Something from the Creator</h2>
        <p>
          Hi! I'm the creator of Fablenests. I started this project with the dream of making storytelling more magical and meaningful — for my generation and the next.
        </p>
      </div>

      {/* Contact Us */}
      <div className="max-w-3xl w-full bg-white border border-gray-300 rounded-lg shadow-md p-6 mb-12 text-lg text-center">
        <h2 className="text-2xl font-title mb-4">Contact Us</h2>
        <p>
          Have questions, feedback, or just want to say hello?
          We're always happy to hear from you.
        </p>
        <p className="mt-2">
          <a
            href="mailto:fablnests@gmail.com"
            className="text-blue-600 underline hover:text-blue-800 transition-colors"
          >
            fablenests@gmail.com
          </a>
        </p>
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
