import Link from "next/link";
import "./globals.css";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { SessionProvider } from "next-auth/react";
import AuthStatus from "@/components/AuthStatus";

export const metadata: Metadata = {
  title: "Bedtimify – AI Bedtime Stories",
  description: "Create magical, personalized bedtime stories for kids with one click using AI.",
  openGraph: {
    title: "Bedtimify – AI Bedtime Stories",
    description: "Create magical, personalized bedtime stories for kids with one click using AI.",
    url: "https://fablenests.com", // updated to your real domain
    siteName: "Bedtimify",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Bedtime Story Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bedtimify – AI Bedtime Stories",
    description: "Create magical, personalized bedtime stories for kids with one click using AI.",
    creator: "@yourhandle",
    images: ["/images/og-image.jpg"],
  },
};.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#fdf6e3] text-gray-900">
        <SessionProvider>
          <header className="bg-[#fdf6e3] shadow-md p-4 flex justify-between items-center text-lg font-semibold sticky top-0 z-50 px-6">
            <div className="flex gap-8">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </div>
            <AuthStatus />
          </header>
          <main>{children}</main>
          <footer className="bg-[#fdf6e3] text-center text-sm text-gray-600 py-6 border-t border-[#e8dbc7]">
            <p>© {new Date().getFullYear()} Bedtimify. All rights reserved.</p>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
