/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Security headers on all routes */
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options',           value: 'DENY' },
        { key: 'X-Content-Type-Options',    value: 'nosniff' },
        { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'X-XSS-Protection',          value: '1; mode=block' },
      ],
    }];
  },
  /* Allowed external image domains */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: '*.s3.me-central-1.amazonaws.com' },
      { protocol: 'https', hostname: '*.cloudfront.net' },
      { protocol: 'https', hostname: 'cdn.honeymoon.ae' },
      { protocol: 'https', hostname: 'placeholder.honeymoon.ae' },
    ],
  },
};
module.exports = nextConfig;
