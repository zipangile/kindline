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
            value: 'origin-when-cross-origin',
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
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Content-Security-Policy',
            // Note: 'unsafe-inline' and 'unsafe-eval' are included to maintain compatibility
            // with third-party payment integrations (e.g., Flutterwave) that require them.
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.flutterwave.com https://js.lenco.co; connect-src 'self' https://api.lenco.co https://api.flutterwave.com https://*.supabase.co; img-src 'self' data: https://images.unsplash.com https://*.supabase.co; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src 'self' https://checkout.flutterwave.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
