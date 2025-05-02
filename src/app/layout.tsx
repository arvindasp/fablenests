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
        <header className="bg-[#fdf6e3] shadow-md p-4 flex justify-between items-center text-lg font-semibold sticky top-0 z-50 px-6">
  <div className="flex items-center gap-6">
    <Link href="/">
      <Image
        src="/images/logo.webp"
        alt="Fablenests logo"
        width={40}
        height={40}
        className="rounded-full"
      />
    </Link>
    <div className="flex gap-6">
  <Link href="/" className="hover:underline">
    Home
  </Link>
  <Link href="/about" className="hover:underline">
    About Us
  </Link>
  <Link href="/account" className="hover:underline">
    Account
  </Link>
</div>
  </div>
  <AuthStatus />
</header>

          <main className="font-body">{children}</main>
          <footer className="bg-[#fdf6e3] text-center text-sm text-gray-600 py-6 border-t border-[#e8dbc7] font-body">
            <p>© {new Date().getFullYear()} Fablenests. All rights reserved.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
