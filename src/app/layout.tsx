import React from 'react';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Data Scrape',
  description: 'A web Scraper for price comparison',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.className} ${inter.className} antialiased`}
        suppressHydrationWarning
      >
      <main className="max-w-10xl mx-auto">
          <Navbar />
          {children}
      </main>
      </body>
    </html>
  );
}
