// src/lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase"; // make sure this path matches your project

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      const { error } = await supabase
        .from("users")
        .upsert(
          {
            email: user.email,
            plan: "free", // default plan
          },
          { onConflict: "email" }
        );

        if (error) {
          console.error("Supabase user insert error:", error.message);
        }
        
        return true;
    },
  },
};
