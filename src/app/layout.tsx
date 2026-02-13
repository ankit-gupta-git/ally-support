import type { Metadata } from "next";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import localFont from 'next/font/local';

const gyst = localFont({
  src: "../../public/fonts/Gyst-Regular.woff2",
  variable: "--font-gyst",
});

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
    <html lang="en">
      <body className={`${gyst.variable} antialiased`}>
        <NextTopLoader color="#18181b" showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
