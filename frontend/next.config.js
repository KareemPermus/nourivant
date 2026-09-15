/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.preview.myndlab.ai', '*.hotload.myndlab.ai', '*.localhost', 'localhost'],
  serverExternalPackages: ['better-sqlite3'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
    ],
  },
};

module.exports = nextConfig;