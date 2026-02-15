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
    default: "EcoMovie - Откройте Фильмы и ТВ-шоу",
    template: "%s | EcoMovie",
  },
  icons: {
    icon: "https://movie.elcho.dev/assets/eco-movie-logo-a8_bjuTM.svg",
    apple: "https://movie.elcho.dev/assets/eco-movie-logo-a8_bjuTM.svg",
  },
  description:
    "Откройте миллионы фильмов, ТВ-шоу и актёров. Исследуйте тренды, популярное и топ-рейтинговое содержание. Ваше удивительное место для развлечений на основе кино.",
  keywords: [
    "фильмы",
    "ТВ-шоу",
    "кино",
    "развлечения",
    "фильмография",
    "потоковое видео",
  ],
  authors: [{ name: "EcoMovie" }],
  creator: "EcoMovie",
  publisher: "EcoMovie",
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
    locale: "ru_RU",
    url: "/",
    siteName: "EcoMovie",
    title: "EcoMovie - Откройте Фильмы и ТВ-шоу",
    description:
      "Откройте миллионы фильмов, ТВ-шоу и актёров. Исследуйте тренды, популярное и топ-рейтинговое содержание.",
    images: [
      {
        url: "/banner.webp",
        width: 1200,
        height: 630,
        alt: "EcoMovie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoMovie - Откройте Фильмы и ТВ-шоу",
    description:
      "Откройте миллионы фильмов, ТВ-шоу и актёров. Исследуйте тренды, популярное и топ-рейтинговое содержание.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" prefix="og: https://ogp.me/ns#">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Провайдер React Query для управления состоянием серверных данных */}
        <ReactQueryProvider>
          {/* Заголовок приложения */}
          <Header />
          {/* Основной контент страницы */}
          {children}
          {/* React Query devtools для отладки */}
          <ReactQueryDevtools initialIsOpen={false} />
          {/* Подвал приложения */}
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
