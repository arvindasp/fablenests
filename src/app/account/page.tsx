"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserPlan } from "@/lib/getUserPlan";
import { useRouter } from "next/navigation";

export default function YourAccountPage() {
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlan = async () => {
      if (session?.user?.email) {
        const userPlan = await getUserPlan(session.user.email);
        setPlan(userPlan);
      }
    };
    fetchPlan();
  }, [session]);

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
    <div className="min-h-screen bg-[#f5ecd7] text-gray-800 font-body flex flex-col items-center px-4 py-12">
      <h1 className="text-4xl font-title mb-6">Your Account</h1>

      <div className="max-w-xl w-full bg-white border border-gray-300 rounded-lg shadow-md p-6 text-lg space-y-4 text-center">
      <p><strong>Email:</strong> {session.user?.email}</p>
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
          <p className="text-green-700 font-semibold mt-4">Thanks for supporting Fablenests! 💛</p>
        )}
      </div>
    </div>
  );
}
