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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://*.lenco.co https://checkout.flutterwave.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://images.unsplash.com https://ellswjqkvfcgiaqjuvkn.supabase.co; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://api.lenco.co https://api.flutterwave.com; frame-src 'self' https://*.lenco.co https://checkout.flutterwave.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
