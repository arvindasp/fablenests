import Link from "next/link";
import "./globals.css";
import { Metadata } from "next";
import AuthStatus from "@/components/AuthStatus";
import AuthProvider from "@/components/AuthProvider";
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
      <body className="bg-[#fdf6e3] text-gray-900">
        <AuthProvider>
        <header className="bg-[#fdf6e3] shadow-md py-3 px-4 md:px-6 flex justify-between items-center text-lg font-semibold sticky top-0 z-50">
  <div className="flex items-center gap-4 md:gap-6">
    <Link href="/">
      <Image
        src="/images/logo.webp"
        alt="Fablenests logo"
        width={40}
        height={40}
        className="rounded-full"
      />
    </Link>
    <nav className="flex gap-4 md:gap-6 text-sm md:text-base">
      <Link href="/" className="hover:underline">Home</Link>
      <Link href="/about" className="hover:underline">About Us</Link>
      <Link href="/account" className="hover:underline">Account</Link>
    </nav>
  </div>
  <AuthStatus />
</header>

          <main className="font-body">{children}</main>
          <footer className="bg-[#fdf6e3] text-center text-sm text-gray-600 py-6 border-t border-[#e8dbc7] font-body">
  <p>© {new Date().getFullYear()} Fablenests. All rights reserved.</p>
  <div className="mt-2 space-x-4">
    <a href="/ourMission" className="hover:underline">
      Our Mission
    </a>
    <a href="/about" className="hover:underline">
      About Us
    </a>
    <a href="/privacy" className="hover:underline">
      Privacy Policy
    </a>
    <a href="/terms" className="hover:underline">
      Terms of Service
    </a>
  </div>
</footer>
        </AuthProvider>
      </body>
    </html>
  );
}
