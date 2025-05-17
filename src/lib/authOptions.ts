// src/lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;
      // Check if user exists in Supabase
      const { data: existingUser, error: fetchError } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", user.email)
        .single();
      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("❌ Supabase fetch error:", fetchError.message);
        return false;
      }
      // Insert new user if not exists
      if (!existingUser) {
        const { error: insertError } = await supabaseAdmin
          .from("users")
          .insert({ email: user.email, plan: "free" });
        if (insertError) {
          console.error("❌ Failed to insert new user:", insertError.message);
          return false;
        }
        console.log(`✅ New user added to Supabase: ${user.email}`);
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};