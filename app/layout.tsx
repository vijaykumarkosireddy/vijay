import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/shared/Navbar"
import Footer from "@/components/shared/Footer"
import LoginOverlay from "@/components/shared/LoginOverlay"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Vijay Kumar Kosireddy | Carnatic Music  & Pencil Sketch Artist",
  description:
    "Official portfolio of Vijay Kumar Kosireddy - Carnatic music  at Sree Saraswathi Sangeetha Vidhayalam and professional mono-realistic pencil sketch artist. Explore music performances and art gallery.",
  keywords: [
    "Carnatic Music",
    "Sree Saraswathi Sangeetha Vidhayalam",
    "Pencil Sketch Artist",
    "Vijay Kumar Kosireddy",
    "Art Portfolio",
    "Music ",
    "Mono-realistic Art",
    "Graphite Portraits",
    "Indian Classical Music",
  ],
  authors: [{ name: "Vijay Kumar Kosireddy" }],
  creator: "Vijay Kumar Kosireddy",
  publisher: "Vijay Kumar Kosireddy",
  metadataBase: new URL("https://vijaykumarkosireddy.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vijaykumarkosireddy.vercel.app",
    title: "Vijay Kumar Kosireddy | Carnatic Music  & Pencil Sketch Artist",
    description:
      "Official portfolio of Vijay Kumar Kosireddy - Carnatic music  and professional mono-realistic pencil sketch artist.",
    siteName: "Vijay Kumar Kosireddy Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vijay Kumar Kosireddy - Artist & Music ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vijay Kumar Kosireddy | Carnatic Music  & Pencil Sketch Artist",
    description: "Explore the world of Carnatic music and mono-realistic pencil art.",
    images: ["/og-image.jpg"],
    creator: "@vijaykumarkosireddy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "d56dDcwHM98uomMxjF4akLV3YQmML8C-2rm3_GoAznU",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#C5A059" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Vijay Portfolio" />

        {/* PWA Icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Poornima Kala Samskruthika Kendram",
              url: "https://vijaykumarkosireddy.vercel.app",
              logo: "https://vijaykumarkosireddy.vercel.app/icon-512.png",
              description: "Music and art institution founded by Vijay Kumar Kosireddy",
              founder: {
                "@type": "Person",
                name: "Vijay Kumar Kosireddy",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Jaggampeta",
                addressRegion: "Andhra Pradesh",
                addressCountry: "IN",
              },
              sameAs: [
                "https://www.youtube.com/@vijaykumarkosireddy",
                "https://www.instagram.com/vijaykumarkosireddy",
              ],
            }),
          }}
        />

        {/* Structured Data - Person (Artist & Music ) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Vijay Kumar Kosireddy",
              url: "https://vijaykumarkosireddy.vercel.app",
              image: "https://vijaykumarkosireddy.vercel.app/icon-512.png",
              jobTitle: "Carnatic Music  & Pencil Sketch Artist",
              description: "Professional Carnatic music  at Sree Saraswathi Sangeetha Vidhayalam and expert mono-realistic pencil sketch artist specializing in graphite portraits.",
              knowsAbout: [
                "Carnatic Music",
                "Music Education",
                "Pencil Sketch Art",
                "Mono-realistic Portraits",
                "Graphite Art",
                "Indian Classical Music",
              ],
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "Sree Saraswathi Sangeetha Vidhayalam",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Jaggampeta",
                addressRegion: "Andhra Pradesh",
                addressCountry: "IN",
              },
              sameAs: [
                "https://www.youtube.com/@vijaykumarkosireddy",
                "https://www.instagram.com/vijaykumarkosireddy",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased selection:bg-primary/30 selection:text-primary`}
      >
        <Navbar />
        <LoginOverlay />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
