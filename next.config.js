/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '9mb'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  transpilePackages: ['geist'],
  serverExternalPackages: ['pdfkit']
};

module.exports = nextConfig;
