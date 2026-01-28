import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import LoginOverlay from "@/components/shared/LoginOverlay";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Vijay Kumar Kosireddy | Carnatic Music Teacher & Pencil Sketch Artist",
  description: "Official portfolio of Vijay Kumar Kosireddy - Carnatic music teacher at Sree Saraswathi Sangeetha Vidhayalam and professional mono-realistic pencil sketch artist. Explore music performances and art gallery.",
  keywords: [
    "Carnatic Music",
    "Sree Saraswathi Sangeetha Vidhayalam",
    "Pencil Sketch Artist",
    "Vijay Kumar Kosireddy",
    "Art Portfolio",
    "Music Teacher",
    "Mono-realistic Art",
    "Graphite Portraits",
    "Indian Classical Music",
  ],
  authors: [{ name: "Vijay Kumar Kosireddy" }],
  creator: "Vijay Kumar Kosireddy",
  publisher: "Vijay Kumar Kosireddy",
  metadataBase: new URL('https://vijaykumarkosireddy.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vijaykumarkosireddy.com',
    title: 'Vijay Kumar Kosireddy | Carnatic Music Teacher & Pencil Sketch Artist',
    description: 'Official portfolio of Vijay Kumar Kosireddy - Carnatic music teacher and professional mono-realistic pencil sketch artist.',
    siteName: 'Vijay Kumar Kosireddy Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vijay Kumar Kosireddy - Artist & Music Teacher',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vijay Kumar Kosireddy | Carnatic Music Teacher & Pencil Sketch Artist',
    description: 'Explore the world of Carnatic music and mono-realistic pencil art.',
    images: ['/og-image.jpg'],
    creator: '@vijaykumarkosireddy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased selection:bg-primary/30 selection:text-primary`}>
        <Navbar />
        <LoginOverlay />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
