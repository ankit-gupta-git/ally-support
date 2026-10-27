import type { Metadata } from "next";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import localFont from 'next/font/local';
import { Geist, Geist_Mono } from 'next/font/google';
import { SmoothScroll } from "@/components/SmoothScroll";

const gyst = localFont({
  src: [
    {
      path: "../../public/fonts/gyst-bold.woff2",
      weight: "700",
    }
  ],
  variable: "--font-gyst",
});

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Support.ai",
  description: "the chatbot that you can embed in your website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${gyst.variable} ${geist.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <NextTopLoader color="#ff4a1c" showSpinner={false} height={2} />
        <SmoothScroll />
        <div id="top" aria-hidden />
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
