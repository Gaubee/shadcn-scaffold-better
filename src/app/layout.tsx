import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scaffold UI",
  description: "A Flutter-inspired scaffold component system for React",
  keywords: ["scaffold", "ui", "react", "nextjs", "components", "flutter", "material design"],
  authors: [{ name: "Scaffold UI Team" }],
  creator: "Scaffold UI",
  publisher: "Scaffold UI",
  metadataBase: new URL("https://scaffold-ui.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://scaffold-ui.dev",
    title: "Scaffold UI",
    description: "A Flutter-inspired scaffold component system for React",
    siteName: "Scaffold UI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scaffold UI",
    description: "A Flutter-inspired scaffold component system for React",
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light dark",
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
