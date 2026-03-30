import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Eye Care",
  description:
    "Protect your eyes with Dev Eye Care - the ultimate eye care app for developers. Track screen time, set reminders, and access eye exercises to maintain healthy vision while coding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0b1326] ">{children}</body>
    </html>
  );
}
