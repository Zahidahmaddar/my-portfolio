import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ClientWrapper from "@/components/ClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zahid Farooq | Software Engineer",
  description:
    "Experienced Software Engineer specializing in React, Next.js, and modern web technologies. Building scalable web applications with clean code and exceptional user experiences.",
  keywords: [
    "Zahid Farooq",
    "Software Engineer",
    "React Developer",
    "Next.js Developer",
    "JavaScript Developer",
    "TypeScript Developer",
    "Web Development",
    "Frontend Developer",
    "Portfolio",
    "Software Development",
    "Web Applications",
  ],
  authors: [{ name: "Zahid Farooq", url: "https://zahidfarooq.com" }],
  creator: "Zahid Farooq",
  publisher: "Zahid Farooq",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",

  // Favicon and icons
  icons: {
    icon: [
      { url: "/favicon-3.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },

  // Open Graph metadata for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zahidfarooq.com",
    siteName: "Zahid Farooq Portfolio",
    title: "Zahid Farooq | Software Engineer",
    description:
      "Experienced Software Engineer specializing in React, Next.js, and modern web technologies. Building scalable web applications with clean code and exceptional user experiences.",
    images: [
      {
        url: "https://res.cloudinary.com/dtzswo7hc/image/upload/v1755886341/WhatsApp_Image_2025-08-22_at_23.42.08_mqx4bq.jpg",
        width: 1200,
        height: 630,
        alt: "Zahid Farooq - Software Engineer",
        type: "image/jpeg",
      },
      {
        url: "https://res.cloudinary.com/dtzswo7hc/image/upload/v1755886341/WhatsApp_Image_2025-08-22_at_23.42.08_mqx4bq.jpg",
        width: 400,
        height: 400,
        alt: "Zahid Farooq Profile Picture",
        type: "image/jpeg",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: "@muzamiladnan", // Add your Twitter handle if you have one
    creator: "@muzamiladnan",
    title: "Zahid Farooq | Full-Stack Developer & Software Engineer",
    description:
      "Experienced Full-Stack Developer specializing in React, Next.js, Node.js, and modern web technologies. Building scalable web applications with clean code and exceptional user experiences.",
    images: [
      {
        url: "https://res.cloudinary.com/dtzswo7hc/image/upload/v1755886341/WhatsApp_Image_2025-08-22_at_23.42.08_mqx4bq.jpg",
        alt: "Zahid Farooq - Full-Stack Developer",
      },
    ],
  },

  // Additional metadata
  category: "Technology",
  classification: "Portfolio Website",

  // Verification and other meta tags
  other: {
    "theme-color": "#3b82f6",
    "color-scheme": "light dark",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ClientWrapper>
          <Navbar />
          <main className="flex-grow bg-[var(--background)] transition-colors duration-300">
            {children}
          </main>
          <Footer />
        </ClientWrapper>
      </body>
    </html>
  );
}
