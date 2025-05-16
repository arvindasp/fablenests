"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserPlan } from "@/lib/getUserPlan";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function YourAccountPage() {
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        if (session?.user?.email) {
          const userPlan = await getUserPlan(session.user.email);
          setPlan(userPlan);
        }
      } catch (error) {
        console.error("Failed to fetch user plan:", error);
        setPlan(null);
      }
    };
    fetchPlan();
  }, [session?.user?.email]);

  if (status === "loading") {
    return <p className="text-center mt-8 text-gray-600">Loading account info...</p>;
  }

  if (!session) {
    return (
      <div className="text-center mt-8">
        <p className="text-lg text-gray-700">You must be logged in to view your account.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-story-bg text-story-accent font-body flex flex-col items-center px-4 py-12">
      <h1 className="text-4xl font-title mb-6">Your Account</h1>

      <div className="max-w-xl w-full bg-white border border-gray-300 rounded-lg shadow-md p-6 text-lg space-y-6 text-center">
        {/* Profile Icon */}
        <div className="flex justify-center">
        {plan && (
  <div className="flex justify-center">
    <Image
      src={`/images/${plan === "free" ? "hatchling" : "nestling"}.webp`}
      alt="Owl profile icon"
      width={120}
      height={120}
      className="rounded-full"
    />
  </div>
)}
        </div>

        <p className="text-xl"><strong>Email:</strong> {session.user?.email}</p>
        <p><strong>Plan:</strong> {plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "Loading..."}</p>

        {plan === "free" && (
          <button
            onClick={() => router.push("/pricing")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
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
                if (data.url) {
                  window.location.href = data.url;
                } else {
                  alert("Could not create portal session.");
                  console.error("Stripe error:", data.error);
                }
              }}
              className="
mt-4
text-story-accent font-body
bg-transparent border-none
px-2 py-1
hover:underline
focus:outline-none focus:ring-0
transition
"
            >
              Manage Subscription
            </button>
          </>
        )}
      </div>
    </div>
  );
}
