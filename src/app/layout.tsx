import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider, themeInitScript } from "@/contexts/ThemeContext";
import { SITE_URL } from "@/lib/site";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const title = "Zahid Farooq | Software Engineer";
const description =
  "Software engineer in Kashmir building web and mobile products with React, Next.js and React Native.";
const shareImage =
  "https://res.cloudinary.com/dtzswo7hc/image/upload/v1755886341/WhatsApp_Image_2025-08-22_at_23.42.08_mqx4bq.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords: [
    "Zahid Farooq",
    "Software Engineer",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "React Native Developer",
    "TypeScript Developer",
    "Kashmir",
  ],
  authors: [{ name: "Zahid Farooq", url: SITE_URL }],
  creator: "Zahid Farooq",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Zahid Farooq",
    title,
    description,
    images: [{ url: shareImage, alt: "Zahid Farooq" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: shareImage, alt: "Zahid Farooq" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0f151d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${instrumentSans.variable} font-sans antialiased min-h-screen`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
