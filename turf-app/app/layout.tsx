import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Turf - Daily Debate Platform",
  description: "A social chat platform designed for engaging debates on a single daily topic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
