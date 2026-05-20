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
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.flutterwave.com https://checkout.flutterwave.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com https://ellswjqkvfcgiaqjuvkn.supabase.co https://*.supabase.co; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.flutterwave.com https://api.lenco.co https://*.supabase.co; frame-src 'self' https://checkout.flutterwave.com;"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
