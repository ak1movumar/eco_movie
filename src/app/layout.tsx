import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "swiper/css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Eco Movie - Discover Movies & TV Shows",
    template: "%s | Eco Movie",
  },
  icons: {
    icon: "https://movie.elcho.dev/assets/eco-movie-logo-a8_bjuTM.svg", // файл должен лежать в папке public/
    apple: "https://movie.elcho.dev/assets/eco-movie-logo-a8_bjuTM.svg",
  },
  description:
    "Discover millions of movies, TV shows and people. Explore trending, popular and top-rated content. Your ultimate destination for cinematic entertainment.",
  keywords: [
    "movies",
    "TV shows",
    "cinema",
    "entertainment",
    "films",
    "streaming",
  ],
  authors: [{ name: "Eco Movie" }],
  creator: "Eco Movie",
  publisher: "Eco Movie",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Eco Movie",
    title: "Eco Movie - Discover Movies & TV Shows",
    description:
      "Discover millions of movies, TV shows and people. Explore trending, popular and top-rated content.",
    images: [
      {
        url: "/banner.webp",
        width: 1200,
        height: 630,
        alt: "Eco Movie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eco Movie - Discover Movies & TV Shows",
    description:
      "Discover millions of movies, TV shows and people. Explore trending, popular and top-rated content.",
    images: ["/banner.webp"],
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
    // Добавьте здесь ваш verification код для Google Search Console
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" prefix="og: https://ogp.me/ns#">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>
          <Header />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />{" "}
          {/* initialIsOpen={false} чтобы он не открывался сразу */}
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
