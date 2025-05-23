"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { getUserPlan } from "@/lib/getUserPlan";
import { useEffect } from "react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchUserPlan() {
      if (session?.user?.email) {
        const plan = await getUserPlan(session.user.email);
        sessionStorage.setItem("userPlan", plan || "free");
        console.log("Fetched user plan:", plan);
      }
    }

    if (session) {
      fetchUserPlan();
    }
  }, [session]);

  if (status === "loading") return <p className="text-sm text-gray-600">Loading...</p>;

  if (!session) {
    return (
      <button
  onClick={() => signIn("google")}
  className="
text-story-accent font-body
bg-transparent border-none
hover:underline hover:text-blue-400
focus:outline-none focus:ring-0
active:text-blue-400
transition
"
>
  Login
</button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <p className="text-sm text-gray-700">Hello, {session.user?.name || session.user?.email}!</p>
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
      >
        Logout
      </button>
    </div>
  );
}
