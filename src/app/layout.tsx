import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import SiteHeader from "@/components/site-header";
import AuthProvider from "@/components/auth-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pulse Gym Manager",
  description:
    "Simple, Vercel-ready gym management with admin CRUD and member visibility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-950 text-white antialiased`}
      >
        <AuthProvider>
          <SiteHeader />
          <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
