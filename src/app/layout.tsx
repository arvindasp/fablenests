import Link from "next/link";
import "./globals.css";
import { Metadata } from "next";
import AuthStatus from "@/components/AuthStatus";
import AuthProvider from "@/components/AuthProvider";

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
        <header className="bg-[#fdf6e3] shadow-md p-4 sticky top-0 z-50">
  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-8 text-lg font-semibold px-2 sm:px-6">
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 items-center">
      <Link href="/" className="hover:underline">
        Home
      </Link>
      <Link href="/about" className="hover:underline">
        About Us
      </Link>
    </div>
    <AuthStatus />
  </div>
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
