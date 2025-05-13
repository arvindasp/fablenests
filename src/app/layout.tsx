// app/layout.tsx
import Link from "next/link";
import "./globals.css";
import { Metadata } from "next";
import AuthStatus from "@/components/AuthStatus";
import AuthProvider from "@/components/AuthProvider";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Fablenests – AI Bedtime Stories",
  description:
    "Create magical, personalized bedtime stories for kids with one click using AI.",
  openGraph: {
    title: "Fablenests – AI Bedtime Stories",
    description:
      "Create magical, personalized bedtime stories for kids with one click using AI.",
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
    description:
      "Create magical, personalized bedtime stories for kids with one click using AI.",
    creator: "@yourhandle",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="font-body">
      <body className="bg-story-bg text-gray-900">
        <AuthProvider>
          <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-sm shadow-md">
            <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-6">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/images/logo.webp"
                    alt="Fablenests logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="ml-2 text-2xl font-title text-story-accent">
                    Fablenests
                  </span>
                </Link>
                <nav className="hidden md:flex space-x-6 text-story-accent font-body">
                  <Link
                    href="/"
                    className="hover:text-story-accent/80 transition"
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className="hover:text-story-accent/80 transition"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/account"
                    className="hover:text-story-accent/80 transition"
                  >
                    Account
                  </Link>
                </nav>
              </div>
              <div>
                <AuthStatus />
              </div>
            </div>
          </header>

          <main className="min-h-[calc(100vh-4rem)]">{children}</main>

          <footer className="bg-white/70 backdrop-blur-sm text-center text-sm text-gray-600 py-6 border-t border-storybook-border font-body">
            <p>© {new Date().getFullYear()} Fablenests. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <Link href="/ourMission" className="hover:text-story-accent/80">
                Our Mission
              </Link>
              <Link href="/about" className="hover:text-story-accent/80">
                About Us
              </Link>
              <Link href="/privacy" className="hover:text-story-accent/80">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-story-accent/80">
                Terms of Service
              </Link>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
