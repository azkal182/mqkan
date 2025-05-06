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
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'tizoiyihjofpuxdnsnrb.supabase.co',
        pathname: '/storage/v1/object/public/**'
      }
    ]
  },
  transpilePackages: ['geist'],
  serverExternalPackages: ['pdfkit']
};

module.exports = nextConfig;
