"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p className="text-sm text-gray-600">Loading...</p>;

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
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
