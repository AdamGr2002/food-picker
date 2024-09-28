/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.themealdb.com', 'world.openfoodfacts.org','images.clerk.dev'],
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://www.themealdb.com/api/json/v1/1/:path*',
      },
    ]
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@clerk/nextjs'],
  },
  // Add this line to increase the timeout
  serverRuntimeConfig: {
    fetchTimeout: 10000, // 10 seconds
  },
}

module.exports = nextConfig