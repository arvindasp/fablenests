"use client";

import Image from "next/image";

export default function OurMissionPage() {
  return (
    <div className="min-h-screen bg-[#f5ecd7] text-gray-800 font-body flex flex-col items-center px-4 py-12">
      <h1 className="text-5xl font-title mb-8 text-center">Our Mission</h1>

      <div className="max-w-3xl w-full bg-white border border-gray-300 rounded-lg shadow-md p-6 text-lg space-y-6 text-center">
        <p>
          At Fablenests, we believe every child deserves more than just a bedtime story — they deserve to feel seen, safe, and inspired.
        </p>

        <p>
          That’s why we create magical, personalized stories — and why we donate a portion of our revenue to organizations that help children around the world.
        </p>

        <p>
          Our mission is simple: to spark wonder in your home while helping children everywhere access opportunities, safety, and joy.
        </p>

        <p>
          Every time you subscribe to Fablenests, you're not just giving your child a better bedtime — you're helping ensure another child gets a better tomorrow.
        </p>

        <p className="font-semibold text-gray-700">
          10% of all revenue goes directly to children's charities.
        </p>

        <p className="text-base text-gray-600 italic">
          We're currently selecting our first official partner — updates coming soon.
        </p>
      </div>

      {/* Illustration */}
      <div className="w-full max-w-5xl mt-12">
        <Image
          src="/images/children-reading.webp"
          alt="Illustration of diverse children reading together in a magical setting"
          width={1600}
          height={400}
          priority
          className="mx-auto rounded-md"
        />
      </div>
    </div>
  );
}
