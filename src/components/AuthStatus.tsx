"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (session) {
    return (
      <button onClick={() => signOut()} className="hover:underline">
        Sign out
      </button>
    );
  } else {
    return (
      <button onClick={() => signIn("google")} className="hover:underline">
        Sign in
      </button>
    );
  }
}
