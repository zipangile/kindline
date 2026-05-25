import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ellswjqkvfcgiaqjuvkn.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/programs',
        destination: '/programmes',
        permanent: true,
      },
      {
        source: '/admin/programs',
        destination: '/admin/programmes',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.flutterwave.com https://api.lenco.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://images.unsplash.com https://ellswjqkvfcgiaqjuvkn.supabase.co https://*.supabase.co; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://ellswjqkvfcgiaqjuvkn.supabase.co https://*.supabase.co https://api.flutterwave.com https://api.lenco.co; frame-src 'self' https://checkout.flutterwave.com; upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
