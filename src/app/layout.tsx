// src/app/layout.tsx
import Link from "next/link";
import "./globals.css";
import { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import AuthStatus from "@/components/AuthStatus";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Fablenests – AI Bedtime Stories",
  description: "Create magical, personalized bedtime stories for kids with one click using AI.",
  openGraph: {
    title: "Fablenests – AI Bedtime Stories",
    description: "Create magical, personalized bedtime stories for kids with one click using AI.",
    url: "https://fablenests.com",
    siteName: "Fablenests",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fablenests – AI Bedtime Story Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fablenests – AI Bedtime Stories",
    description: "Create magical, personalized bedtime stories for kids with one click using AI.",
    creator: "@yourhandle",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="font-body">
      <body className="bg-story-bg text-story-accent">
        <AuthProvider>
          <header className="sticky top-0 z-50 w-full bg-story-bg shadow-md">
            <div className="max-w-6xl mx-auto flex items-center py-5 px-8 md:px-12">
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="/images/logo.webp"
                  alt="Fablenests logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-2xl font-title">Fablenests</span>
              </Link>
              <nav className="hidden md:flex flex-1 justify-center space-x-10 font-body">
                <Link href="/" className="hover:underline transition">Home</Link>
                <Link href="/about" className="hover:underline transition">About Us</Link>
                <Link href="/account" className="hover:underline transition">Account</Link>
              </nav>
              <div className="hidden md:block">
                <AuthStatus />
              </div>
            </div>
          </header>

          <main className="min-h-[calc(100vh-4.5rem)]">{children}</main>

          <footer className="bg-story-bg border-t border-storybook-border text-center text-sm text-story-accent py-6">
            <p>© {new Date().getFullYear()} Fablenests. All rights reserved.</p>
            <div className="mt-2 space-x-6 font-body">
              <Link href="/ourMission" className="hover:underline transition">Our Mission</Link>
              <Link href="/about" className="hover:underline transition">About Us</Link>
              <Link href="/privacy" className="hover:underline transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:underline transition">Terms of Service</Link>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
