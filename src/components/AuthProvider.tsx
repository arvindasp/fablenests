"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthInsertWrapper>{children}</AuthInsertWrapper>
    </SessionProvider>
  );
}

function AuthInsertWrapper({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    const insertUser = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/insert-user-from-google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session.user.email }),
          });

          const result = await response.json();
          console.log("✅ Google Insert Result:", result);

          if (!result.success) {
            console.error("Insert failed:", result.error);
          }
        } catch (err) {
          console.error("Unexpected insert error:", err);
        }
      }
    };

    insertUser();
  }, [session?.user?.email]);

  return <>{children}</>;
}
