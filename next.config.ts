import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ellswjqkvfcgiaqjuvkn.supabase.co' },
    ],
  },
  async redirects() {
    return [
      { source: '/programs', destination: '/programmes', permanent: true },
      { source: '/admin/programs', destination: '/admin/programmes', permanent: true },
    ];
  },
  async headers() {
    const csp = `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.flutterwave.com https://api.lenco.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://images.unsplash.com https://ellswjqkvfcgiaqjuvkn.supabase.co https://checkout.flutterwave.com; font-src 'self' https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'self' https://checkout.flutterwave.com; connect-src 'self' https://ellswjqkvfcgiaqjuvkn.supabase.co https://api.flutterwave.com https://api.lenco.co; upgrade-insecure-requests;`.replace(/\s{2,}/g, ' ').trim();
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: csp },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }];
  },
};

export default nextConfig;
