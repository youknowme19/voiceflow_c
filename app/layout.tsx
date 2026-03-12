import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../lib/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VoiceBuild | Next-Gen AI Voice Operating System",
  description: "Build, deploy, and scale intelligent AI voice agents with visual excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#0B0B0F] text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
