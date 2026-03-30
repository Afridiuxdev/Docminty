import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://docminty.com"),
  title: {
    default: "DocMinty - Free GST Invoice Generator for India",
    template: "%s | DocMinty",
  },
  description: "Free GST invoice generator for Indian businesses. Create invoices, quotations, salary slips, certificates and more. No sign-up required. Instant PDF download.",
  keywords: [
    "GST invoice generator",
    "free invoice maker India",
    "GST invoice India",
    "invoice generator online",
    "salary slip generator",
    "quotation generator",
    "rent receipt generator",
    "Indian business documents",
    "PDF invoice generator",
    "free GST bill format",
  ],
  authors: [{ name: "DocMinty", url: "https://docminty.com" }],
  creator: "DocMinty",
  publisher: "DocMinty",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://docminty.com",
    siteName: "DocMinty",
    title: "DocMinty - Free GST Invoice Generator for India",
    description: "Create GST invoices, quotations, salary slips & more. Free, instant PDF, no sign-up needed.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DocMinty - Free GST Invoice Generator for India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DocMinty - Free GST Invoice Generator for India",
    description: "Create GST invoices, quotations, salary slips & more. Free, instant PDF, no sign-up needed.",
    images: ["/og-image.png"],
    creator: "@docminty",
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://docminty.com",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <head>
        <meta name="theme-color" content="#0D9488" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        <link rel="canonical" href="https://docminty.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "DocMinty",
              "url": "https://docminty.com",
              "description": "Free GST invoice generator for Indian businesses",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR",
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "2400",
              },
            }),
          }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable}`}>
        <AuthProvider>
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}