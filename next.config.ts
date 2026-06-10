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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.flutterwave.com https://api.lenco.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com https://ellswjqkvfcgiaqjuvkn.supabase.co https://api.lenco.co; connect-src 'self' https://ellswjqkvfcgiaqjuvkn.supabase.co https://api.flutterwave.com https://api.lenco.co; frame-src 'self' https://checkout.flutterwave.com https://api.lenco.co;",
          },
        ],
      },
    ];
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
};

export default nextConfig;
