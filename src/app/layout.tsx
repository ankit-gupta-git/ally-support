import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        {children}
      </body>
    </html>
  );
}
