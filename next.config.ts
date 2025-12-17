import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Оптимизация изображений
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Компрессия
  compress: true,
  
  // Оптимизация для лучшего SEO
  poweredByHeader: false,
  
  // Экспериментальные функции для производительности
  experimental: {
    optimizePackageImports: ['react-icons', '@tanstack/react-query'],
  },
};

export default nextConfig;
