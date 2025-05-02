// src/lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Note: must use SERVICE ROLE here
);

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

      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("❌ Supabase fetch error:", fetchError.message);
        return false;
      }

      if (!existingUser) {
        const { error: insertError } = await supabase
          .from("users")
          .insert({ email: user.email, plan: "free" });

        if (insertError) {
          console.error("❌ Failed to insert new user:", insertError.message);
          return false;
        }

        console.log(`✅ New user added to Supabase: ${user.email}`);
      } else {
        console.log(`ℹ️ User already exists: ${user.email}`);
      }

      return true;
    },
  },
};
