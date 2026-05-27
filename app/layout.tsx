import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import { Analytics } from "@vercel/analytics/react";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Movies",
  description: "Watch and Chill",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} antialiased bg-slate-950 min-h-screen`}>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
