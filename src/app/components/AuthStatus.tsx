"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
    >
      Sign in with Google
    </button>
  );
}
