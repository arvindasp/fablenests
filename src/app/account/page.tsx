"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUserPlan } from "@/lib/getUserPlan";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Favorite = { id: string; title: string; created_at: string };

export default function YourAccountPage() {
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState<string | null>(null);
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const fetchPlan = async () => {
      if (session?.user?.email) {
        const userPlan = await getUserPlan(session.user.email);
        setPlan(userPlan);
      }
    };
    fetchPlan();
  }, [session?.user?.email]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/favorites")
        .then((res) => res.json())
        .then((data: Favorite[]) => setFavorites(data));
    }
  }, [session?.user?.email]);

  if (status === "loading") {
    return <p className="text-center mt-8 text-story-accent">Loading account info...</p>;
  }

  if (!session) {
    return (
      <div className="text-center mt-8 text-story-accent">
        <p className="text-lg">You must be logged in to view your account.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-story-bg text-story-accent font-body flex flex-col items-center px-4 py-12">
      <h1 className="text-4xl font-title mb-6">Your Account</h1>

      <div className="max-w-xl w-full bg-white/80 backdrop-blur-sm border-2 border-storybook-border rounded-3xl shadow-storybook p-6 text-lg space-y-6 text-center">
        {/* Profile Icon */}
        <div className="flex justify-center">
          {plan && (
            <Image
              src={`/images/${plan === "free" ? "hatchling" : "nestling"}.webp`}
              alt="Profile icon"
              width={120}
              height={120}
              className="rounded-full"
            />
          )}

          <p className="text-xl mt-4">
            <strong>Email:</strong> {session.user?.email}
          </p>
          <p>
            <strong>Plan:</strong>{' '}
            {plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "Loading..."}
          </p>

          {plan === "free" && (
            <button
              onClick={() => router.push("/pricing")}
              className="mt-4 text-story-accent font-bold hover:underline transition"
            >
              Upgrade to Nestling
            </button>
          )}

          {plan === "nestling" && (
            <>
              <p className="text-green-700 font-semibold">
                Thanks for supporting Fablenests! 💛
              </p>
              <button
                onClick={async () => {
                  const res = await fetch("/api/create-portal-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: session.user?.email }),
                  });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                  else alert("Could not create portal session.");
                }}
                className="mt-4 text-story-accent font-body bg-transparent border-none px-2 py-1 hover:underline focus:outline-none focus:ring-0 transition"
              >
                Manage Subscription
              </button>
            </>
          )}
        </div>
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <section className="mt-12 w-full max-w-xl">
          <h2 className="text-2xl font-title mb-4">My Favorites</h2>
          <ul className="space-y-4">
            {favorites.map((fav) => (
              <li
                key={fav.id}
                className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-3xl shadow-storybook"
              >
                <div>
                  <p className="font-semibold text-story-accent">{fav.title}</p>
                  <p className="text-sm text-story-accent/70">
                    Saved on {new Date(fav.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Link
                    href={`/story?title=${encodeURIComponent(fav.title)}&story=...`}
                    className="text-story-accent hover:underline transition"
                  >
                    Read
                  </Link>
                  <button
                    onClick={async () => {
                      await fetch(`/api/favorites/${fav.id}`, { method: "DELETE" });
                      setFavorites((prev) => prev.filter((x) => x.id !== fav.id));
                    }}
                    className="text-red-500 hover:underline transition"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
